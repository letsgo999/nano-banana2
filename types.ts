
export interface GeneratedImage {
  imageUrl: string;
  text: string;
}

export type CanvasSize = '1:1 (정사각형)' | '16:9 (와이드)' | '9:16 (세로)' | '4:3 (클래식)';
export type ArtStyle = '사진' | '애니메이션' | '디지털 아트' | '유화' | '스케치' | '수채화' | '추상화' | '만화';
export type Quality = '최고화질' | '고화질' | '표준';
export type Lighting = '시네마틱' | '따뜻한' | '차가운' | '자연광';
export type ColorPalette = '선명한 색' | '파스텔' | '모노크롬' | '빈티지';

export interface GenerationOptions {
  canvasSize: CanvasSize;
  artStyle: ArtStyle;
  quality: Quality;
  lighting: Lighting;
  colorPalette: ColorPalette;
}
