import { useState, useCallback } from 'react';
import { editImage } from '../services/geminiService';
import type { GeneratedImage } from '../types';

const useImageGenerator = () => {
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = useCallback(async (prompt: string, imageFile: File) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await editImage(prompt, imageFile);
      setGeneratedImage(result);
    } catch (e: any) {
      console.error("Image generation failed:", e);
      
      let userFriendlyError = '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      
      switch (e.message) {
          case 'NETWORK_ERROR':
              userFriendlyError = '네트워크에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.';
              break;
          case 'API_KEY_INVALID':
              userFriendlyError = '이미지 생성 서비스 인증에 문제가 발생했습니다. 관리자에게 문의해주세요.';
              break;
          case 'GENERATION_TIMEOUT':
              userFriendlyError = '이미지 생성 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
              break;
          case 'INVALID_GEMINI_REQUEST':
              userFriendlyError = '모델이 요청을 처리할 수 없습니다. 프롬프트나 이미지를 변경하여 다시 시도해보세요.';
              break;
      }
      
      setError(userFriendlyError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { generatedImage, isLoading, error, generateImage };
};

export default useImageGenerator;