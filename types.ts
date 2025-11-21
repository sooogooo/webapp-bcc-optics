
export type FilterType = 'normal' | 'vivid' | 'bw' | 'vintage' | 'warm' | 'cool' | 'drama' | 'cyber' | 'beauty_face' | 'makeup' | 'micro_sculpt' | 'kodak' | 'fuji' | 'agfa';

export type TemplateType = 'classic' | 'cinema' | 'minimal' | 'stamp' | 'film' | 'magazine' | 'cd_cover' | 'social_post';

export interface Photo {
  id: string;
  dataUrl: string;
  caption: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  timestamp: number;
  zIndex: number;
  filter: FilterType;
  template: TemplateType;
  fontSize?: 'small' | 'medium' | 'large';
  fit?: 'cover' | 'contain'; // cover = square crop, contain = original ratio
  focusPoint?: { x: number; y: number }; // Focus percentage for object-position
}

export enum CameraMode {
  User = 'user',
  Environment = 'environment'
}

export type IconStyle = 'classic' | 'minimal' | 'retro';
export type AIPersonality = 'humorous' | 'standard' | 'scientific';
export type AILength = 'detailed' | 'standard' | 'short';
export type ThemeType = 'neutral' | 'warm' | 'cool';

export interface AppSettings {
  allowResize: boolean;
  allowRotation: boolean;
  showDateStamp: boolean;
  activeFilters: FilterType[]; // User selects 3 preferred filters
  enableSounds: boolean;
  iconStyle: IconStyle;
  defaultTemplate: TemplateType;
  
  // New Settings
  goldenSentences: string; // Multiline string of memes/quotes
  aiPersonality: AIPersonality;
  aiLength: AILength;
  theme: ThemeType;
  fontSize: 'small' | 'medium' | 'large';
}
