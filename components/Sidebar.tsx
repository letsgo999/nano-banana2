
import React, { useState, useEffect, useCallback } from 'react';
import { 
  SparklesIcon, UploadIcon, SquareIcon, WideScreenIcon, TallScreenIcon, ClassicScreenIcon,
  CameraIcon, GhostIcon, PenToolIcon, PaletteIcon, PencilIcon, PaintBrushIcon, ShapesIcon, ChatBubbleIcon
} from './Icons';
import type { GenerationOptions, CanvasSize, ArtStyle, Quality, Lighting, ColorPalette } from '../types';

interface SidebarProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  referenceImage: File | null;
  setReferenceImage: (file: File | null) => void;
  onGenerate: (options: GenerationOptions) => void;
  isLoading: boolean;
}

const ControlGroup: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-medium text-slate-300 mb-2">{title}</h3>
    {children}
  </div>
);

const OptionButton: React.FC<{ onClick: () => void, isActive: boolean, children: React.ReactNode }> = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-3 rounded-md text-sm flex items-center space-x-2 transition-colors duration-200 ${
      isActive
        ? 'bg-violet-600 text-white'
        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
    }`}
  >
    {children}
  </button>
);

const CustomSelect: React.FC<{ value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }> = ({ value, onChange, children }) => (
    <div className="relative">
        <select 
            value={value}
            onChange={onChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-md py-2.5 px-3 text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition appearance-none"
        >
            {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
    </div>
);


const Sidebar: React.FC<SidebarProps> = ({
  prompt,
  setPrompt,
  referenceImage,
  setReferenceImage,
  onGenerate,
  isLoading,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // State for new options
  const [canvasSize, setCanvasSize] = useState<CanvasSize>('1:1 (정사각형)');
  const [artStyle, setArtStyle] = useState<ArtStyle>('사진');
  const [quality, setQuality] = useState<Quality>('최고화질');
  const [lighting, setLighting] = useState<Lighting>('시네마틱');
  const [colorPalette, setColorPalette] = useState<ColorPalette>('선명한 색');

  const canvasSizes: { name: CanvasSize, icon: React.ReactNode }[] = [
    { name: '1:1 (정사각형)', icon: <SquareIcon className="w-5 h-5" /> },
    { name: '16:9 (와이드)', icon: <WideScreenIcon className="w-5 h-5" /> },
    { name: '9:16 (세로)', icon: <TallScreenIcon className="w-5 h-5" /> },
    { name: '4:3 (클래식)', icon: <ClassicScreenIcon className="w-5 h-5" /> },
  ];

  const artStyles: { name: ArtStyle, icon: React.ReactNode }[] = [
    { name: '사진', icon: <CameraIcon className="w-5 h-5" /> },
    { name: '애니메이션', icon: <GhostIcon className="w-5 h-5" /> },
    { name: '디지털 아트', icon: <PenToolIcon className="w-5 h-5" /> },
    { name: '유화', icon: <PaletteIcon className="w-5 h-5" /> },
    { name: '스케치', icon: <PencilIcon className="w-5 h-5" /> },
    { name: '수채화', icon: <PaintBrushIcon className="w-5 h-5" /> },
    { name: '추상화', icon: <ShapesIcon className="w-5 h-5" /> },
    { name: '만화', icon: <ChatBubbleIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    if (referenceImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(referenceImage);
    } else {
      setImagePreview(null);
    }
  }, [referenceImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReferenceImage(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setReferenceImage(e.dataTransfer.files[0]);
    }
  }, [setReferenceImage]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleGenerateClick = () => {
    onGenerate({ canvasSize, artStyle, quality, lighting, colorPalette });
  };

  return (
    <aside className="w-96 bg-slate-900 p-6 flex flex-col space-y-4 overflow-y-auto">
      <div className="flex-grow flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-violet-400">Nano Banana</h1>
          <p className="text-slate-400 text-sm">이미지 생성기</p>
        </div>

        <ControlGroup title="프롬프트">
          <textarea
            id="prompt"
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
            placeholder="연꽃이 핀 연못"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </ControlGroup>
        
        <ControlGroup title="참고 이미지 (선택)">
          <label
            htmlFor="file-upload"
            className="mt-1 flex justify-center items-center w-full h-32 px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-md cursor-pointer hover:border-violet-500 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="참고 이미지 프리뷰" className="max-h-full max-w-full object-contain rounded-md" />
            ) : (
              <div className="space-y-1 text-center">
                <UploadIcon className="mx-auto h-10 w-10 text-slate-500" />
                <p className="text-xs text-slate-500">
                  클릭 또는 드래그 앤 드롭
                </p>
              </div>
            )}
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" />
          </label>
        </ControlGroup>
        
        <ControlGroup title="캔버스 사이즈">
            <div className="grid grid-cols-2 gap-2">
                {canvasSizes.map(size => (
                    <OptionButton key={size.name} onClick={() => setCanvasSize(size.name)} isActive={canvasSize === size.name}>
                        {size.icon}<span>{size.name}</span>
                    </OptionButton>
                ))}
            </div>
        </ControlGroup>
        
        <ControlGroup title="아트 스타일">
            <div className="grid grid-cols-2 gap-2">
                {artStyles.map(style => (
                    <OptionButton key={style.name} onClick={() => setArtStyle(style.name)} isActive={artStyle === style.name}>
                        {style.icon}<span>{style.name}</span>
                    </OptionButton>
                ))}
            </div>
        </ControlGroup>

        <ControlGroup title="화질 설정">
          <CustomSelect value={quality} onChange={(e) => setQuality(e.target.value as Quality)}>
            <option>최고화질</option>
            <option>고화질</option>
            <option>표준</option>
          </CustomSelect>
        </ControlGroup>

        <ControlGroup title="조명 설정">
          <CustomSelect value={lighting} onChange={(e) => setLighting(e.target.value as Lighting)}>
            <option>시네마틱</option>
            <option>따뜻한</option>
            <option>차가운</option>
            <option>자연광</option>
          </CustomSelect>
        </ControlGroup>

        <ControlGroup title="컬러 팔레트">
          <CustomSelect value={colorPalette} onChange={(e) => setColorPalette(e.target.value as ColorPalette)}>
            <option>선명한 색</option>
            <option>파스텔</option>
            <option>모노크롬</option>
            <option>빈티지</option>
          </CustomSelect>
        </ControlGroup>

      </div>

      <div className="flex-shrink-0 pt-4 border-t border-slate-800">
        <button
          onClick={handleGenerateClick}
          disabled={isLoading || !prompt || !referenceImage}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              생성 중...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              생성
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
