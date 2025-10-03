
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ImageDisplay from './components/ImageDisplay';
import useImageGenerator from './hooks/useImageGenerator';
import type { GeneratedImage, GenerationOptions } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const { generatedImage, isLoading, error, generateImage } = useImageGenerator();

  const handleGenerate = async (options: GenerationOptions) => {
    if (!prompt || !referenceImage) {
      alert('프롬프트와 참조 이미지를 모두 입력해주세요.');
      return;
    }

    // Construct the detailed prompt from user input and selected options
    const detailedPrompt = `
      사용자 프롬프트: "${prompt}"
      ---
      요청 스타일:
      - 캔버스 사이즈: ${options.canvasSize}
      - 아트 스타일: ${options.artStyle}
      - 화질: ${options.quality}
      - 조명: ${options.lighting}
      - 컬러 팔레트: ${options.colorPalette}
      ---
      위 스타일을 참조하여 이미지를 생성해줘.
    `.trim();

    await generateImage(detailedPrompt, referenceImage);
  };

  return (
    <div className="flex h-screen bg-slate-800 text-white font-sans">
      <Sidebar
        prompt={prompt}
        setPrompt={setPrompt}
        referenceImage={referenceImage}
        setReferenceImage={setReferenceImage}
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />
      <main className="flex-1 p-8 flex items-center justify-center">
        <ImageDisplay
          generatedImage={generatedImage}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
};

export default App;
