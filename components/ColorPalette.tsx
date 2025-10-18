
import React from 'react';

interface ColorPaletteProps {
  colors: string[];
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors }) => {

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color, index) => (
        <div 
            key={index} 
            className="group relative flex-1 min-w-[60px] cursor-pointer"
            onClick={() => copyToClipboard(color)}
        >
          <div
            className="h-16 rounded-md transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: color }}
          />
          <span className="mt-1.5 block text-center text-xs text-gray-400 tracking-wider">{color}</span>
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
            <span className="text-white text-xs font-semibold">Copy</span>
          </div>
        </div>
      ))}
    </div>
  );
};
