/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { getBrailleDots } from '../lib/braille.ts';

interface BrailleCellProps {
  char: string;
  originalChar?: string;
  size?: 'sm' | 'md' | 'lg';
  activeColor?: string;
  showLabels?: boolean;
}

export const BrailleCell: React.FC<BrailleCellProps> = ({
  char,
  originalChar,
  size = 'md',
  activeColor = 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.5)]',
  showLabels = false,
}) => {
  const dots = getBrailleDots(char);
  const isSpace = char === ' ' || char === '⠀';

  const sizeClasses = {
    sm: 'w-6 h-9 p-1 gap-1',
    md: 'w-10 h-14 p-1.5 gap-1.5',
    lg: 'w-14 h-20 p-2 gap-2',
  }[size];

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
  }[size];

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`relative grid grid-cols-2 rounded-lg bg-slate-900/90 border border-slate-700/80 ${sizeClasses} shadow-inner transition-all hover:border-slate-500`}
        title={`Char: ${originalChar || char} | Unicode: U+${char.charCodeAt(0).toString(16).toUpperCase()}`}
      >
        {/* Left Column: Dots 1, 2, 3 */}
        <div className="flex flex-col justify-between items-center h-full">
          {[0, 1, 2].map((dotIdx) => {
            const isActive = dots[dotIdx];
            return (
              <div
                key={dotIdx}
                className={`rounded-full transition-all duration-150 ${dotSizeClasses} ${
                  isActive
                    ? activeColor
                    : 'bg-slate-800 border border-slate-700/60 opacity-40'
                }`}
              />
            );
          })}
        </div>

        {/* Right Column: Dots 4, 5, 6 */}
        <div className="flex flex-col justify-between items-center h-full">
          {[3, 4, 5].map((dotIdx) => {
            const isActive = dots[dotIdx];
            return (
              <div
                key={dotIdx}
                className={`rounded-full transition-all duration-150 ${dotSizeClasses} ${
                  isActive
                    ? activeColor
                    : 'bg-slate-800 border border-slate-700/60 opacity-40'
                }`}
              />
            );
          })}
        </div>
      </div>

      {showLabels && (
        <span className="text-[11px] font-mono text-slate-400">
          {isSpace ? '␣' : originalChar || char}
        </span>
      )}
    </div>
  );
};
