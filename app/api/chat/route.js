import { NextResponse } from 'next/server';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req) {
  const data = await req.json();

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gryphe/mythomist-7b:free',
        messages: [
          { role: 'system', content: 'You are a customer support bot for PlantifyAI.' },
          ...data,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text(); 
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const result = await response.json();
    
    return new Response(result.choices[0]?.message?.content || 'No response content', {
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
