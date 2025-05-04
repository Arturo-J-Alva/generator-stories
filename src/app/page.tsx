"use client";

import StoryGeneratorForm from '@/components/StoryGeneratorForm';
import { useEffect, useRef, useState } from 'react';

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
  const [streamedContent, setStreamedContent] = useState<string>('');
  const eventSourceRef = useRef<EventSource | null>(null);

  // Cleanup event source on component unmount
  useEffect(() => {
    return () => {
      const eventSource = eventSourceRef.current;
      if (eventSource) {
        eventSource.close();
      }
      eventSourceRef.current = null;
    };
  }, []);

  const connectToStream = async (message: string) => {
    // Close any existing stream
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Set loading state and clear previous content
    setIsLoading(true);
    setStreamedContent('');
    setSubmissionCompleted(false);

    try {
      // Create the request to our API endpoint
      const response = await fetch('/api/openai/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the readable stream and reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let storyText = '';

      // Read stream chunks
      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.substring(6));

                  // Handle different event types
                  switch (data.type) {
                    case 'text':
                      storyText += data.content;
                      const word = '"history": "'
                      const historyIndex = storyText.indexOf(word);
                      if (historyIndex !== -1) {
                        const historyContent = storyText
                          .substring(historyIndex + word.length)
                          .replace(/\n\n/g, '')
                          .replace(/\n/g, '')
                          .replace(/\"/g, '')
                          .replace(/}/g, '');

                        setStreamedContent(historyContent);
                      }
                      break;
                    case 'done':
                      const { title, history } = JSON.parse(storyText)
                      // Create story object
                      setGeneratedStory({
                        title,
                        content: history
                      });

                      setSubmissionCompleted(true);
                      setIsLoading(false);
                      break;
                    case 'error':
                      console.error('Stream error:', data.error);
                      throw new Error(data.error);
                  }
                } catch (e) {
                  console.error('Error parsing SSE data:', e, line);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error reading stream:', error);
          setIsLoading(false);
        }
      };

      processStream();
    } catch (error) {
      console.error('Error connecting to stream:', error);
      setIsLoading(false);
      alert('Hubo un error al generar tu cuento. Por favor, intenta de nuevo.');
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    // Create a prompt for story generation based on form data
    const storyPrompt = `Escribe un cuento infantil corto que sea ${formData.theme} sobre ${formData.storyPrompt}. 
    Escribe un título atractivo y luego el contenido del cuento en varios párrafos. 
    Usa un lenguaje sencillo y apropiado para niños.`;

    // Connect to stream with the story prompt
    connectToStream(storyPrompt);
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
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  <span className="ml-4 text-xl text-purple-700">Generando tu cuento mágico...</span>
                </div>

                {streamedContent && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg max-h-60 overflow-y-auto w-full">
                    <p className="whitespace-pre-wrap text-left">{streamedContent.replace(/\n/g, ' ').replace(/\"/g, ' ').replace(/}/g, ' ')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!isLoading && generatedStory && (
          <div className="relative mt-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg blur opacity-50"></div>
            <div className="relative bg-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">{generatedStory.title}</h2>
              <div className="prose prose-lg">
                <p>{generatedStory.content}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
