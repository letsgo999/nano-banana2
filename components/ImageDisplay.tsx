import React from 'react';
import type { GeneratedImage } from '../types';
import Spinner from './Spinner';
import { ErrorIcon } from './Icons';

interface ImageDisplayProps {
  generatedImage: GeneratedImage | null;
  isLoading: boolean;
  error: string | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ generatedImage, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-slate-400">
        <Spinner />
        <p className="mt-4 text-lg">이미지를 생성하는 중...</p>
        <p className="text-sm">잠시만 기다려 주세요.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center bg-red-900/20 border border-red-500/50 rounded-lg p-8">
        <ErrorIcon className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-red-400">오류 발생</h2>
        <p className="mt-2 text-red-300 max-w-md">{error}</p>
      </div>
    );
  }

  if (generatedImage) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <img
          src={generatedImage.imageUrl}
          alt="생성된 이미지"
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/50"
        />
      </div>
    );
  }

  return (
    <div className="text-center text-slate-500">
      <div className="w-96 h-96 bg-slate-800 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center">
        <h2 className="text-xl font-medium">생성된 이미지가 여기에 표시됩니다.</h2>
        <p className="mt-2 text-sm">왼쪽 패널에서 프롬프트를 입력하고 이미지를 업로드하세요.</p>
      </div>
    </div>
  );
};

export default ImageDisplay;