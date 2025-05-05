import React, { FormEvent, useCallback, useEffect, useState } from 'react';

interface FormData {
    theme: string;
    storyPrompt: string;
}

interface StoryGeneratorFormProps {
    onSubmit: (formData: FormData) => void;
    isGeneratingHistory: boolean
    submissionCompleted?: boolean;
}

const initialFormState: FormData = {
    theme: 'divertido',
    storyPrompt: '',
};

export default function StoryGeneratorForm({ onSubmit, submissionCompleted = false,isGeneratingHistory }: StoryGeneratorFormProps) {

    const [formData, setFormData] = useState<FormData>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = useCallback(() => {
        setFormData(initialFormState);
    }, []);

    // Reset form when submission is completed
    useEffect(() => {
        if (submissionCompleted && !isSubmitting) {
            resetForm();
        }
    }, [submissionCompleted, isSubmitting, resetForm]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!formData.storyPrompt.trim()) {
            alert('Por favor, describe tu cuento antes de generarlo.');
            return;
        }

        setIsSubmitting(true);

        try {
            onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isDisabledButton = isSubmitting || isGeneratingHistory

    return (
        <form onSubmit={handleSubmit} className="space-y-8 px-4">
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg blur opacity-50"></div>
                <div className="relative bg-white p-6 rounded-lg">
                    <label htmlFor="theme" className="block text-2xl font-medium text-purple-700 mb-4">
                        🎭 Elige un tema:
                    </label>
                    <select
                        id="theme"
                        name="theme"
                        value={formData.theme}
                        onChange={handleChange}
                        className="w-full p-4 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 text-lg"
                    >
                        <option value="divertido">😄 Divertido</option>
                        <option value="dormir">🌙 Para dormir</option>
                        <option value="emocionante">🚀 Emocionante</option>
                        <option value="educativa">🔍 Educativa</option>
                    </select>
                </div>
            </div>

            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-lg blur opacity-50"></div>
                <div className="relative bg-white p-6 rounded-lg">
                    <label htmlFor="storyPrompt" className="block text-2xl font-medium text-purple-700 mb-4">
                        💭 Describe tu cuento:
                    </label>
                    <textarea
                        id="storyPrompt"
                        name="storyPrompt"
                        value={formData.storyPrompt}
                        onChange={handleChange}
                        rows={5}
                        className="w-full p-4 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 text-lg"
                        placeholder="Escribe sobre qué quieres que sea tu cuento..."
                    ></textarea>
                </div>
            </div>

            <div className="mt-10 text-center">
                <button
                    type="submit"
                    disabled={isDisabledButton}
                    className={`inline-block px-10 py-4 text-white font-bold text-xl rounded-full transform transition 
                    ${isDisabledButton 
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 opacity-70 cursor-not-allowed shadow-md' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105'
                    }`}
                >
                    {isSubmitting 
                        ? '⏳ Generando...' 
                        : isGeneratingHistory 
                            ? '🔄 Procesando historia...' 
                            : '🪄 ¡Generar Cuento! 🦄'}
                </button>
            </div>
        </form>
    );
}