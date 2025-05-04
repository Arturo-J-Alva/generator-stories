"use client";

import StoryGeneratorForm from '@/components/StoryGeneratorForm';
import { useState } from 'react';

interface FormData {
  theme: string;
  storyPrompt: string;
}

interface StoryData {
  title: string;
  content: string[];
}

export default function Home() {
  const [generatedStory, setGeneratedStory] = useState<StoryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionCompleted, setSubmissionCompleted] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setSubmissionCompleted(false);
    
    try {
      // In a real app, this would be an API call to a story generation endpoint
      console.log('Generating story with:', formData);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just create a mock story based on the form data
      const mockStory: StoryData = {
        title: `La aventura ${formData.theme}: ${formData.storyPrompt.slice(0, 30)}...`,
        content: [
          `Había una vez un cuento ${formData.theme} sobre ${formData.storyPrompt}.`,
          "Los personajes se embarcaron en una aventura increíble llena de sorpresas.",
          "Aprendieron muchas lecciones importantes durante su viaje.",
          "Y al final, todos vivieron felices para siempre."
        ]
      };
      
      setGeneratedStory(mockStory);
      setSubmissionCompleted(true);
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Hubo un error al generar tu cuento. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-blue-100 to-pink-100 p-6">
      <main className="max-w-4xl mx-auto py-8">
        <h1 className="text-5xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 drop-shadow-md">
          🧙‍♂️ Generador de cuentos infantiles 📚
        </h1>
        
        <StoryGeneratorForm 
          onSubmit={handleFormSubmit} 
          submissionCompleted={submissionCompleted} 
        />

        {isLoading && (
          <div className="mt-12 text-center">
            <div className="inline-block p-6 bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <span className="ml-4 text-xl text-purple-700">Generando tu cuento mágico...</span>
              </div>
            </div>
          </div>
        )}

        {!isLoading && generatedStory ? (
          <div className="relative mt-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg blur opacity-50"></div>
            <div className="relative bg-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-orange-600 mb-4">📖 {generatedStory.title}</h2>
              <div className="prose prose-lg">
                {generatedStory.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        ) : !isLoading && (
          <div className="relative mt-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg blur opacity-50"></div>
            <div className="relative bg-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-orange-600 mb-4">📖 Ejemplo de Cuento: La Aventura de Luna 🐢</h2>
              <div className="prose prose-lg">
                <p>
                  Había una vez una pequeña tortuga llamada Luna 🐢 que soñaba con explorar el océano 🌊. Aunque sus amigos le decían que era imposible para una tortuga tan pequeña, Luna estaba decidida a cumplir su sueño.
                </p>
                <p>
                  Un día, Luna encontró una concha mágica ✨ en la orilla. &quot;Si crees en ti misma, todo es posible&quot;, susurró la concha. Con valentía, Luna se adentró en el agua.
                </p>
                <p>
                  Durante su viaje, Luna hizo nuevos amigos: un pez payaso muy gracioso 🐠, una sabia estrella de mar ⭐ y un delfín veloz 🐬. Juntos exploraron arrecifes de colores, grutas misteriosas y bailaron con las medusas luminosas.
                </p>
                <p>
                  Al regresar a casa, Luna ya no era la misma. Había aprendido que con amistad y valentía, hasta el sueño más grande puede hacerse realidad. 🌈
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
