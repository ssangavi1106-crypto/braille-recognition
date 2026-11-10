/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  toBrailleSentence,
  brailleSentenceToText,
  containsBraille,
  SUPPORTED_LANGUAGES,
} from './src/lib/braille.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Increase JSON & URL-encoded limits for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize Gemini client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Language list endpoint
const handleLanguages = (req: express.Request, res: express.Response) => {
  const map: Record<string, string> = {};
  for (const [code, info] of Object.entries(SUPPORTED_LANGUAGES)) {
    map[code] = `${info.name} (${info.nativeName})`;
  }
  res.json(map);
};

app.get('/api/languages', handleLanguages);
app.get('/languages', handleLanguages);

// Recognition and Prediction Handler
async function handlePrediction(req: express.Request, res: express.Response) {
  try {
    let base64Data = '';
    let mimeType = 'image/jpeg';
    let lang = (req.body?.lang || req.query?.lang || 'en') as string;

    // Check if image passed in body
    if (req.body?.image) {
      const match = req.body.image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      } else {
        base64Data = req.body.image;
      }
    }

    if (!base64Data) {
      return res.status(400).json({ error: 'No image provided. Please upload or capture an image.' });
    }

    let recognizedText = '';
    let brailleSentence = '';
    let detectedType = 'text';
    let notes = '';

    // If Gemini AI is configured, perform multimodal vision OCR + Braille analysis
    if (ai) {
      try {
        const prompt = `You are an expert system in Optical Character Recognition (OCR), Braille decoding, and Indian language translation (including Tamil).
Carefully analyze the image provided.
Tasks:
1. Examine if the image contains:
   a) Braille dot patterns (6-dot embossed paper, signage, digital Braille, or Unicode Braille characters).
   b) Printed or handwritten text (in English, Tamil, Hindi, etc.).
   c) Mixed text and Braille.
2. If it is Braille:
   - Accurately decode the 6-dot cells into plain readable text (e.g. English Grade 1/2 or Tamil Bharati Braille).
   - Also provide the exact Unicode Braille string (characters between U+2800 and U+28FF).
3. If it is standard printed or handwritten text:
   - Extract the full text accurately verbatim.
   - Convert that extracted text into standard Braille Unicode notation (including capital indicators ⠠, number signs ⠼, spaces, and punctuation).
4. If the target language requested is "${lang}", provide the primary text transcription in that language or English as appropriate.

Output strictly valid JSON with the following schema:
{
  "text": "The decoded or recognized natural text sentence",
  "braille": "The corresponding Unicode Braille characters (e.g. ⠺⠑⠇⠉⠕⠍⠑)",
  "detectedType": "braille_dots" or "printed_text" or "handwritten",
  "detectedLanguage": "en" or "ta" or other language code,
  "confidenceScore": number between 0 and 1,
  "notes": "Brief 1-sentence explanation of what was detected"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
              {
                text: prompt,
              },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                braille: { type: Type.STRING },
                detectedType: { type: Type.STRING },
                detectedLanguage: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER },
                notes: { type: Type.STRING },
              },
              required: ['text', 'braille'],
            },
          },
        });

        const jsonText = response.text?.trim();
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          recognizedText = parsed.text || '';
          brailleSentence = parsed.braille || '';
          detectedType = parsed.detectedType || 'text';
          notes = parsed.notes || '';
        }
      } catch (err: any) {
        if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('Quota exceeded')) {
          console.warn('Gemini API quota exceeded (Free Tier limit reached). Seamlessly using browser OCR & local Braille translation.');
          notes = 'AI Quota limit reached; used local browser OCR & translation engine.';
        } else {
          console.warn('Gemini vision analysis fallback warning:', err?.message);
        }
      }
    }

    // Only populate if text or Braille was actually recognized from the user's photo
    if (!recognizedText && !brailleSentence) {
      return res.json({
        braille: '',
        text: '',
        detectedType: 'none',
        notes: 'No readable text or Braille dots were detected in this image. Please upload a clearer photo.',
        audio_url: null,
        lang,
      });
    }

    if (recognizedText && !brailleSentence) {
      brailleSentence = toBrailleSentence(recognizedText);
    } else if (brailleSentence && !recognizedText) {
      recognizedText = brailleSentenceToText(brailleSentence);
    }

    return res.json({
      braille: brailleSentence,
      text: recognizedText,
      detectedType,
      notes,
      lang,
      audio_url: `/api/tts?text=${encodeURIComponent(recognizedText)}&lang=${encodeURIComponent(lang)}`,
    });
  } catch (error: any) {
    console.error('Prediction error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process image',
      braille: '—',
      text: 'An error occurred during recognition.',
    });
  }
}

app.post('/api/predict', handlePrediction);
app.post('/predict', handlePrediction);

// Bidirectional translation endpoint (Direct Text <-> Braille)
app.post('/api/translate', (req, res) => {
  const { text = '', direction = 'text-to-braille', useGrade2 = true } = req.body;

  if (direction === 'braille-to-text' || containsBraille(text)) {
    const converted = brailleSentenceToText(text);
    return res.json({
      text: converted,
      braille: text,
      source: 'braille',
    });
  } else {
    const converted = toBrailleSentence(text, useGrade2);
    return res.json({
      text: text,
      braille: converted,
      source: 'text',
    });
  }
});

// TTS proxy / generator info endpoint
app.get('/api/tts', (req, res) => {
  const text = (req.query.text as string) || '';
  const lang = (req.query.lang as string) || 'en';
  // Return metadata for client-side Web Speech synthesis or player
  res.json({
    text,
    lang,
    supported: true,
  });
});
app.get('/get-audio', (req, res) => {
  const text = (req.query.text as string) || 'Audio synthesis ready';
  const lang = (req.query.lang as string) || 'en';
  res.json({ text, lang });
});

import fs from 'fs';

// Start server: prefer pre-built dist assets for instant sub-millisecond load, fallback to vite middleware
async function startServer() {
  const distIndex = path.join(__dirname, 'dist', 'index.html');
  const distExists = fs.existsSync(distIndex);

  if (distExists) {
    console.log('Serving production-ready dist assets');
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path === '/predict' || req.path === '/languages' || req.path === '/get-audio') {
        return next();
      }
      res.sendFile(distIndex);
    });
  } else {
    console.log('Dist not found, initializing Vite middleware');
    const { createServer } = await import('vite');
    const vite = await createServer({
      configFile: path.resolve(__dirname, 'vite.config.ts'),
      root: __dirname,
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Braille & Voice Recognition Studio running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

