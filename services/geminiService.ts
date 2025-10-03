import type { GeneratedImage } from "../types";

// 파일을 Base64로 인코딩하는 헬퍼 함수
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};


export async function editImage(prompt: string, imageFile: File): Promise<GeneratedImage> {
  try {
    const base64Image = await fileToBase64(imageFile);

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        image: {
          data: base64Image,
          mimeType: imageFile.type,
        },
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || `서버 오류: ${response.statusText}`);
    }

    const result = await response.json();
    return result as GeneratedImage;

  } catch (error: any) {
    console.error('API Service Error:', error);
    // 네트워크 오류 감지
    if (error instanceof TypeError) {
      throw new Error('NETWORK_ERROR');
    }
    // 서버에서 받은 오류 메시지 또는 기타 오류를 다시 throw
    throw error;
  }
}