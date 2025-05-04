import { NextRequest } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Get the assistant ID from environment variables
    const assistantId = process.env.OPENAI_ASSISTANT_ID;
    
    if (!assistantId) {
      return new Response(
        JSON.stringify({ error: 'Assistant ID is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await request.json();
    const { content } = body;
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Message content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a new ReadableStream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Step 1: Create a new thread
          const thread = await openai.beta.threads.create();
          
          // Send thread ID to client for possible future reference
          controller.enqueue(`data: ${JSON.stringify({ 
            type: 'thread', 
            threadId: thread.id 
          })}\n\n`);

          // Step 2: Add a message to the thread
          await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: content,
          });

          // Step 3: Create a run with the assistant
          const run = openai.beta.threads.runs.stream(thread.id, {
            assistant_id: assistantId
          })
            .on('textCreated', () => {
              controller.enqueue(`data: ${JSON.stringify({ 
                type: 'start' 
              })}\n\n`);
            })
            .on('textDelta', (textDelta: OpenAI.Beta.Threads.Messages.TextDelta) => {
              controller.enqueue(`data: ${JSON.stringify({ 
                type: 'text', 
                content: textDelta.value 
              })}\n\n`);
            })
            .on('toolCallCreated', (toolCall) => {
              controller.enqueue(`data: ${JSON.stringify({ 
                type: 'tool', 
                tool: toolCall.type 
              })}\n\n`);
            })
            .on('toolCallDelta', (toolCallDelta) => {
              if (toolCallDelta.type === 'code_interpreter') {
                if (toolCallDelta.code_interpreter?.input) {
                  controller.enqueue(`data: ${JSON.stringify({ 
                    type: 'code_input', 
                    content: toolCallDelta.code_interpreter.input 
                  })}\n\n`);
                }
                if (toolCallDelta?.code_interpreter?.outputs) {
                  toolCallDelta.code_interpreter.outputs.forEach(output => {
                    if (output.type === "logs") {
                      controller.enqueue(`data: ${JSON.stringify({ 
                        type: 'code_output', 
                        content: output.logs 
                      })}\n\n`);
                    }
                  });
                }
              }
            })
            .on('error', (error) => {
              controller.enqueue(`data: ${JSON.stringify({ 
                type: 'error', 
                error: error.message 
              })}\n\n`);
              controller.close();
            })
            .on('end', () => {
              controller.enqueue(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
              controller.close();
            });

          // Wait for the run to complete
          await run.finalRun;
        } catch {
          controller.enqueue(`data: ${JSON.stringify({ 
            type: 'error', 
            error: 'An error occurred while processing your request' 
          })}\n\n`);
          controller.close();
        }
      }
    });

    // Return the stream as SSE
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error setting up stream:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to set up streaming response' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}