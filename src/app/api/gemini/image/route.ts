import {
    GoogleGenAI,
} from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
const config = {
    responseModalities: [
        'image',
        'text',
    ],
    responseMimeType: 'text/plain',
};
const model = 'gemini-2.0-flash-exp-image-generation';

export async function POST(request: Request) {
    try {
        // Parse request body
        const body = await request.json();
        const { imagePrompt } = body;

        if (!imagePrompt) {
            return NextResponse.json(
                { error: 'Message imagePrompt is required' },
                { status: 400 }
            );
        }

        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: imagePrompt,
                    },
                ],
            },
        ];

        const response = await ai.models.generateContentStream({
            model,
            config,
            contents,
        });

        let imageData = null;
        let mimeType = null;

        for await (const chunk of response) {
            if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
                continue;
            }
            
            if (chunk.candidates[0].content.parts[0].inlineData) {
                const inlineData = chunk.candidates[0].content.parts[0].inlineData;
                imageData = inlineData.data || '';
                mimeType = inlineData.mimeType || 'image/png';
            } else {
                console.log(chunk.text);
            }
        }

        // Devolver directamente el base64 y el tipo MIME
        if (imageData) {
            return NextResponse.json({ 
                success: true, 
                imageData: imageData,
                mimeType: mimeType,
                dataUrl: `data:${mimeType};base64,${imageData}`,
                message: 'Image generated successfully'
            });
        } else {
            return NextResponse.json({ 
                success: false, 
                message: 'Failed to generate image' 
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Error generating image:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Error generating image',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}