
import React, { useState, useCallback } from 'react';
import { SketchUploader } from './components/SketchUploader';
import { DesignOutput } from './components/DesignOutput';
import { Spinner } from './components/Spinner';
import { generateDesignIdeas } from './services/geminiService';
import type { DesignSuggestions } from './types';

const App: React.FC = () => {
  const [sketchFile, setSketchFile] = useState<File | null>(null);
  const [sketchPreviewUrl, setSketchPreviewUrl] = useState<string | null>(null);
  const [designSuggestions, setDesignSuggestions] = useState<DesignSuggestions | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setSketchFile(file);
      setSketchPreviewUrl(URL.createObjectURL(file));
      setDesignSuggestions(null);
      setError(null);
    } else {
      setSketchFile(null);
      setSketchPreviewUrl(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });

  const handleGenerateClick = useCallback(async () => {
    if (!sketchFile) {
      setError('Please upload a sketch first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDesignSuggestions(null);

    try {
      const base64Data = await fileToBase64(sketchFile);
      const suggestions = await generateDesignIdeas(base64Data, sketchFile.type);
      setDesignSuggestions(suggestions);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [sketchFile]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="py-6 px-4 md:px-8 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Design Spark
          </h1>
          <p className="text-gray-400 hidden md:block">AI-Powered Brainstorming for Designers</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-semibold text-gray-200">1. Upload Your Sketch</h2>
            <SketchUploader
              onFileSelect={handleFileSelect}
              previewUrl={sketchPreviewUrl}
              isLoading={isLoading}
            />
            <button
              onClick={handleGenerateClick}
              disabled={!sketchFile || isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Generating Ideas...
                </>
              ) : (
                'Spark Inspiration ✨'
              )}
            </button>
          </div>
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-semibold text-gray-200">2. AI Generated Ideas</h2>
            <div className="bg-gray-800/50 rounded-lg p-6 min-h-[400px] border border-gray-700">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Spinner />
                  <p className="mt-4 text-gray-400">Analyzing your sketch and brewing up some creative ideas...</p>
                </div>
              )}
              {error && (
                 <div className="flex items-center justify-center h-full text-red-400">
                    <div className="text-center">
                        <p className="font-semibold">Oh no! Something went wrong.</p>
                        <p className="text-sm mt-2">{error}</p>
                    </div>
                 </div>
              )}
              {designSuggestions && !isLoading && (
                <DesignOutput suggestions={designSuggestions} />
              )}
              {!designSuggestions && !isLoading && !error && (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Your design ideas will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
