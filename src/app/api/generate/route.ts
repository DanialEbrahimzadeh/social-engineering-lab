import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { persona, keywords } = await req.json();
    const apiKey = req.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    if (!persona || !keywords || !Array.isArray(keywords)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    const prompt = `You are tasked with generating a social engineering attack message for educational purposes. Create a realistic but malicious message targeting the following persona:

Persona: ${persona}
Keywords to incorporate: ${keywords.join(', ')}

Requirements:
- Make it appear professional and urgent
- Incorporate psychological manipulation tactics (e.g., authority, scarcity, urgency)
- Use the provided keywords naturally within the context
- Keep it concise but convincing (2-3 paragraphs maximum)
- Make it seem like a legitimate business communication
- Include a clear but subtle call to action
- Use appropriate business formatting and tone
- Add a realistic signature line

Important Notes:
- This is for educational purposes only to demonstrate social engineering tactics
- The message should highlight common manipulation techniques
- Make it realistic enough to be educational but not harmful`;

    // Make direct API call to Gemini
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{
                text: prompt
              }]
            }],
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE"
              },
              {
                category: "HARM_CATEGORY_CIVIC_INTEGRITY",
                threshold: "BLOCK_NONE"
              }
            ]
          })
        }
      );

      // First check if the response is ok
      if (!response.ok) {
        let errorMessage = `API Error (${response.status})`;
        
        try {
          const errorData = await response.json();
          console.error('Gemini API Error:', errorData);
          errorMessage = errorData.error?.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', await response.text());
        }

        // Handle specific status codes
        switch (response.status) {
          case 404:
            return NextResponse.json(
              { error: 'Invalid model name or API version. Please check your configuration.' },
              { status: 404 }
            );
          case 403:
            return NextResponse.json(
              { error: 'API key is invalid or has insufficient permissions.' },
              { status: 403 }
            );
          case 429:
            return NextResponse.json(
              { error: 'Free quota exceeded. Please try again in a few minutes.' },
              { status: 429 }
            );
          default:
            return NextResponse.json(
              { error: errorMessage },
              { status: response.status }
            );
        }
      }

      // Parse the successful response
      try {
        const data = await response.json();
        const generatedMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedMessage) {
          throw new Error('No message generated in the response');
        }

        return NextResponse.json({ result: generatedMessage });
      } catch (parseError) {
        console.error('Error parsing success response:', parseError);
        return NextResponse.json(
          { error: 'Failed to parse API response' },
          { status: 500 }
        );
      }
    } catch (genError: any) {
      console.error('Gemini API Error:', genError);
      return NextResponse.json(
        { error: 'Failed to connect to Gemini API. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
} 