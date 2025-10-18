
import React from 'react';
import type { DesignSuggestions } from '../types';
import { ColorPalette } from './ColorPalette';

interface DesignOutputProps {
  suggestions: DesignSuggestions;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 last:mb-0">
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">{title}</h3>
        {children}
    </div>
);

export const DesignOutput: React.FC<DesignOutputProps> = ({ suggestions }) => {
  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">{suggestions.conceptTitle}</h2>
      
      <Section title="Concept Description">
        <p className="text-gray-300">{suggestions.description}</p>
      </Section>

      <Section title="Color Palette">
        <ColorPalette colors={suggestions.colorPalette} />
      </Section>
      
      <Section title="Typography">
        <div className="bg-gray-900/50 p-3 rounded-md">
            <p className="text-gray-300">
                <span className="font-semibold text-gray-100">Font Family:</span> {suggestions.typography.fontFamily}
            </p>
            <p className="text-gray-300">
                <span className="font-semibold text-gray-100">Heading Weight:</span> {suggestions.typography.fontWeight}
            </p>
        </div>
      </Section>

      <Section title="Key UI Components">
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          {suggestions.uiComponents.map((component, index) => (
            <li key={index}>{component}</li>
          ))}
        </ul>
      </Section>

      <Section title="Layout Suggestions">
        <p className="text-gray-300">{suggestions.layoutSuggestions}</p>
      </Section>
    </div>
  );
};
