import {
    GoogleGenAI,
} from '@google/genai';
import { writeFile } from 'fs/promises';
import mime from 'mime';
import { NextResponse } from 'next/server';
import path from 'path';

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

// Función para guardar la imagen en la carpeta public/images
async function saveBinaryFile(fileName: string, content: Buffer) {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const imagesDir = path.join(publicDir, 'images');
        
        // Crear la carpeta images si no existe
        try {
            await import('fs').then(async fs => {
                if (!fs.existsSync(imagesDir)) {
                    await import('fs/promises').then(async fsp => {
                        await fsp.mkdir(imagesDir, { recursive: true });
                    });
                }
            });
        } catch (error) {
            console.error('Error creating images directory:', error);
        }
        
        const fullPath = path.join(imagesDir, fileName);
        
        await writeFile(fullPath, content);
        console.log(`File ${fileName} saved to public/images directory.`);
        return `images/${fileName}`; // Retorna la ruta relativa incluyendo la carpeta images
    } catch (error) {
        console.error(`Error writing file ${fileName}:`, error);
        throw error;
    }
}

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

        let imagePath = null;

        for await (const chunk of response) {
            if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
                continue;
            }
            
            if (chunk.candidates[0].content.parts[0].inlineData) {
                const fileName = `image-${Date.now()}`;
                const inlineData = chunk.candidates[0].content.parts[0].inlineData;
                let fileExtension = mime.getExtension(inlineData.mimeType || '') || 'png';
                let buffer = Buffer.from(inlineData.data || '', 'base64');
                
                // Guardar el archivo y obtener el nombre
                const savedFileName = await saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
                imagePath = `/${savedFileName}`;
            } else {
                console.log(chunk.text);
            }
        }

        // Devolver la URL de la imagen generada
        if (imagePath) {
            return NextResponse.json({ 
                success: true, 
                imageUrl: imagePath,
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