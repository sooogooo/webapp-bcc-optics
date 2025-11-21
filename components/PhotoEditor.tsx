
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Wand2, RotateCw, Image as ImageIcon, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { Photo, FilterType, AppSettings } from '../types.ts';
import { GoogleGenAI, Modality } from "@google/genai";

interface PhotoEditorProps {
  photo: Photo;
  settings: AppSettings;
  onSave: (updatedPhoto: Photo) => void;
  onClose: () => void;
}

const getFilterCSS = (type: FilterType) => {
    switch (type) {
      case 'vivid': return 'contrast-[1.3] saturate-[1.6]';
      case 'bw': return 'grayscale-[1] contrast-[1.2] brightness-[1.1]';
      case 'vintage': return 'sepia-[0.4] contrast-[0.9] brightness-[1.1] hue-rotate-[-10deg]';
      case 'warm': return 'sepia-[0.2] saturate-[1.3] hue-rotate-[-5deg] contrast-[1.05]';
      case 'cool': return 'hue-rotate-[180deg] sepia-[0.1] saturate-[0.8] brightness-[1.1] mix-blend-hard-light';
      case 'drama': return 'contrast-[1.4] brightness-[0.9] saturate-[0.8]';
      case 'cyber': return 'contrast-[1.2] brightness-[1.1] hue-rotate-[20deg] saturate-[1.4]';
      case 'beauty_face': return 'brightness-[1.05] contrast-[0.95] blur-[0.5px] saturate-[0.9]';
      case 'makeup': return 'saturate-[1.3] contrast-[1.1] brightness-[1.05]';
      case 'micro_sculpt': return 'contrast-[1.2] brightness-[1.1] sepia-[0.1]';
      case 'kodak': return 'contrast-[1.2] saturate-[1.3] sepia-[0.2] hue-rotate-[-5deg] brightness-[1.05]';
      case 'fuji': return 'contrast-[1.05] saturate-[1.1] brightness-[1.05] hue-rotate-[5deg] sepia-[0.1]';
      case 'agfa': return 'contrast-[1.3] saturate-[1.4] sepia-[0.3] hue-rotate-[-10deg] brightness-[1.1]';
      default: return '';
    }
};

const FILTER_LABELS: Record<FilterType, string> = {
    normal: '原图', vivid: '鲜艳', bw: '黑白', vintage: '复古',
    warm: '暖阳', cool: '冷调', drama: '剧场', cyber: '赛博',
    beauty_face: '捏脸', makeup: '扮靓', micro_sculpt: '微整',
    kodak: '柯达', fuji: '富士', agfa: '爱克发'
};

const PhotoEditor: React.FC<PhotoEditorProps> = ({ photo, settings, onSave, onClose }) => {
  const [editedPhoto, setEditedPhoto] = useState<Photo>({ ...photo });
  const [activeTab, setActiveTab] = useState<'filter' | 'adjust' | 'ai'>('filter');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  // -- AI Logic --
  const handleAICaption = async () => {
    if (!process.env.API_KEY) {
        alert("AI Service Unavailable (Missing API Key)");
        return;
    }
    setIsProcessing(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const lengthInstruction = settings.aiLength === 'short' ? 'MAX 15 characters.' : settings.aiLength === 'detailed' ? 'Around 30-40 characters.' : 'Around 20 characters.';
        
        const prompt = `Analyze this image. Generate a Chinese caption in a '${settings.aiPersonality}' style. 
        Length requirement: ${lengthInstruction}
        It should feel like a nostalgic photo note.
        Return ONLY the caption text.`;

        const base64Data = editedPhoto.dataUrl.split(',')[1];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                    { text: prompt }
                ]
            }
        });

        const text = response.text?.trim();
        if (text) {
            setEditedPhoto(prev => ({ ...prev, caption: text }));
        }
    } catch (e) {
        console.error(e);
        alert("AI Analysis Failed");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleAIRemix = async () => {
      if (!process.env.API_KEY || !aiPrompt) return;
      setIsProcessing(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const base64Data = editedPhoto.dataUrl.split(',')[1];
          
          // Using gemini-2.5-flash-image (Nano Banana) for editing
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                    { text: `Edit this image: ${aiPrompt}` }
                ]
            },
            config: {
                responseModalities: [Modality.IMAGE]
            }
          });

          const candidates = response.candidates;
          if (candidates && candidates[0].content.parts) {
             for (const part of candidates[0].content.parts) {
                 if (part.inlineData && part.inlineData.data) {
                     const newUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                     setEditedPhoto(prev => ({ ...prev, dataUrl: newUrl }));
                     break;
                 }
             }
          }
      } catch (e) {
          console.error(e);
          alert("AI Edit Failed. Please try a different prompt.");
      } finally {
          setIsProcessing(false);
      }
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
    >
        <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
            {/* Header */}
            <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-[#222]">
                <button onClick={onClose} className="p-2 text-white/70 hover:text-white"><X size={20} /></button>
                <span className="text-white font-medium tracking-wide text-sm">PHOTO EDITOR</span>
                <button onClick={() => onSave(editedPhoto)} className="p-2 text-blue-400 hover:text-blue-300"><Check size={20} /></button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 relative bg-[#111] flex items-center justify-center overflow-hidden p-8">
                <div 
                    className="relative shadow-2xl transition-all duration-300"
                    style={{ 
                        transform: `rotate(${editedPhoto.rotation}deg) scale(${editedPhoto.scale})`
                    }}
                >
                    <img 
                        src={editedPhoto.dataUrl} 
                        className={`max-w-full max-h-[50vh] object-contain border-[8px] border-white shadow-lg ${getFilterCSS(editedPhoto.filter)}`}
                        style={{
                            objectFit: editedPhoto.fit || 'cover',
                            objectPosition: editedPhoto.focusPoint ? `${editedPhoto.focusPoint.x}% ${editedPhoto.focusPoint.y}%` : 'center'
                        }}
                    />
                    {editedPhoto.caption && (
                        <div className="absolute bottom-4 left-0 right-0 text-center px-2">
                            <span className="bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                                {editedPhoto.caption}
                            </span>
                        </div>
                    )}
                </div>
                
                {isProcessing && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 z-50 backdrop-blur-sm">
                        <Loader2 className="animate-spin text-rose-400" size={40} />
                        <span className="text-white text-xs font-mono animate-pulse">AI PROCESSING...</span>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="bg-[#222] border-t border-white/10">
                {/* Tabs */}
                <div className="flex border-b border-white/5">
                    <button onClick={() => setActiveTab('filter')} className={`flex-1 py-3 flex justify-center ${activeTab === 'filter' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-white/50'}`}>
                        <Wand2 size={20} />
                    </button>
                    <button onClick={() => setActiveTab('adjust')} className={`flex-1 py-3 flex justify-center ${activeTab === 'adjust' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-white/50'}`}>
                        <RotateCw size={20} />
                    </button>
                    <button onClick={() => setActiveTab('ai')} className={`flex-1 py-3 flex justify-center ${activeTab === 'ai' ? 'text-rose-400 border-b-2 border-rose-400' : 'text-white/50'}`}>
                        <Sparkles size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="h-48 p-4 overflow-y-auto">
                    
                    {activeTab === 'filter' && (
                        <div className="grid grid-cols-4 gap-3">
                            {settings.activeFilters.map(f => (
                                <button 
                                    key={f}
                                    onClick={() => setEditedPhoto({...editedPhoto, filter: f})}
                                    className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all ${editedPhoto.filter === f ? 'border-rose-500 bg-white/5' : 'border-transparent hover:bg-white/5'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full bg-gray-500 ${getFilterCSS(f)}`}></div>
                                    <span className="text-[10px] text-white/70">{FILTER_LABELS[f]}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'adjust' && (
                        <div className="space-y-4 px-4 pt-2">
                            <div>
                                <label className="text-xs text-white/50 block mb-2">Rotation</label>
                                <input 
                                    type="range" min="-45" max="45" 
                                    value={editedPhoto.rotation}
                                    onChange={(e) => setEditedPhoto({...editedPhoto, rotation: Number(e.target.value)})}
                                    className="w-full accent-rose-500 h-1 bg-white/20 rounded-full appearance-none"
                                />
                            </div>
                             <div>
                                <label className="text-xs text-white/50 block mb-2">Crop Fit</label>
                                <div className="flex bg-white/10 rounded p-1">
                                    <button 
                                        onClick={() => setEditedPhoto({...editedPhoto, fit: 'cover'})} 
                                        className={`flex-1 text-xs py-1 rounded ${editedPhoto.fit === 'cover' ? 'bg-rose-500 text-white' : 'text-gray-400'}`}
                                    >
                                        Fill Square
                                    </button>
                                    <button 
                                        onClick={() => setEditedPhoto({...editedPhoto, fit: 'contain'})} 
                                        className={`flex-1 text-xs py-1 rounded ${editedPhoto.fit === 'contain' ? 'bg-rose-500 text-white' : 'text-gray-400'}`}
                                    >
                                        Original
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ai' && (
                        <div className="space-y-3">
                            <button 
                                onClick={handleAICaption}
                                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center gap-2 text-white font-medium shadow-lg hover:brightness-110 active:scale-95 transition-all"
                            >
                                <MessageSquare size={16} />
                                <span>智能配文 (Smart Caption)</span>
                            </button>
                            
                            <div className="flex gap-2 mt-2">
                                <input 
                                    type="text" 
                                    placeholder="Remix prompt (e.g. 'Add a cat')"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    className="flex-1 bg-black/30 border border-white/20 rounded-lg px-3 text-sm text-white focus:border-rose-500 outline-none"
                                />
                                <button 
                                    onClick={handleAIRemix}
                                    disabled={!aiPrompt}
                                    className="p-2 bg-white/10 rounded-lg text-rose-400 disabled:opacity-50 hover:bg-white/20"
                                >
                                    <Wand2 size={20} />
                                </button>
                            </div>
                            <p className="text-[10px] text-white/40 text-center">Powered by Gemini Nano Banana</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
  );
};

export default PhotoEditor;
