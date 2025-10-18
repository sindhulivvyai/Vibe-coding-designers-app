
import { GoogleGenAI, Type } from "@google/genai";
import type { DesignSuggestions } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const designSuggestionsSchema = {
    type: Type.OBJECT,
    properties: {
        conceptTitle: {
            type: Type.STRING,
            description: "A short, catchy title for the design concept."
        },
        description: {
            type: Type.STRING,
            description: "A detailed 2-3 sentence description of the design concept, elaborating on the sketch."
        },
        colorPalette: {
            type: Type.ARRAY,
            items: { 
                type: Type.STRING,
                description: "A hex color code string, e.g., '#RRGGBB'."
            },
            description: "An array of 5 hex color codes for a visually appealing color palette."
        },
        typography: {
            type: Type.OBJECT,
            properties: {
                fontFamily: { 
                    type: Type.STRING,
                    description: "A suggested font family (e.g., 'Inter', 'Poppins')."
                },
                fontWeight: { 
                    type: Type.STRING,
                    description: "A suggested font weight for headings (e.g., 'Bold', '600')."
                }
            },
            required: ['fontFamily', 'fontWeight']
        },
        uiComponents: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: "A list of 3-5 key UI components identified or suggested from the sketch (e.g., 'Primary Button', 'Info Card')."
        },
        layoutSuggestions: {
            type: Type.STRING,
            description: "Actionable advice on improving the layout, hierarchy, or structure of the design."
        }
    },
    required: ['conceptTitle', 'description', 'colorPalette', 'typography', 'uiComponents', 'layoutSuggestions']
};

export const generateDesignIdeas = async (imageBase64Data: string, mimeType: string): Promise<DesignSuggestions> => {
  const imagePart = {
    inlineData: {
      data: imageBase64Data,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: "Analyze this UI/UX sketch and provide brainstorming ideas for a design concept.",
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: designSuggestionsSchema,
      },
    });

    const jsonText = response.text.trim();
    const suggestions = JSON.parse(jsonText) as DesignSuggestions;
    
    // Basic validation
    if (!suggestions.conceptTitle || !Array.isArray(suggestions.colorPalette)) {
        throw new Error("Invalid response format from API.");
    }

    return suggestions;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("Failed to parse the design suggestions. The AI's response might be malformed.");
    }
    throw new Error("Could not generate design ideas. Please check the console for more details.");
  }
};
