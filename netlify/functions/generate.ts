import { GoogleGenAI, Modality, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;

// API 키가 설정되지 않은 경우에 대한 강력한 확인
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// 요청 본문의 타입을 정의
interface RequestBody {
  prompt: string;
  image: {
    data: string;
    mimeType: string;
  };
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { prompt, image } = (await req.json()) as RequestBody;

    if (!prompt || !image || !image.data || !image.mimeType) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
    }

    const imagePart = {
      inlineData: {
        data: image.data,
        mimeType: image.mimeType,
      },
    };
    const textPart = { text: prompt };
    const parts: Part[] = [imagePart, textPart];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    // API 응답에서 이미지와 텍스트를 추출
    let imageUrl = '';
    let text = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          text = part.text;
        }
      }
    }

    if (!imageUrl) {
        return new Response(JSON.stringify({ error: 'Image could not be generated from API response.' }), { status: 500 });
    }

    // 성공적인 응답을 클라이언트로 전송
    return new Response(JSON.stringify({ imageUrl, text }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error in generate function:', error);
    
    let errorMessage = 'An internal server error occurred.';
    
    const errorString = error.toString();
    if (errorString.includes('API key not valid')) {
        errorMessage = 'API_KEY_INVALID';
    } else if (errorString.includes('timed out')) {
        errorMessage = 'GENERATION_TIMEOUT';
    } else if (errorString.includes('Invalid request')) {
        errorMessage = 'INVALID_GEMINI_REQUEST';
    }

    return new Response(JSON.stringify({ error: errorMessage }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
};