
import React, { useState, useEffect } from 'react';
import { Photo, FilterType, TemplateType } from '../types.ts';
import { motion } from 'framer-motion';
import { X, Wand2, MessageCircle, Shuffle, Maximize2 } from 'lucide-react';

interface PolaroidProps {
  photo: Photo;
  showDateStamp: boolean;
  availableFilters: FilterType[]; 
  fontSize?: 'small' | 'medium' | 'large';
  goldenSentences?: string;
  allowResize: boolean;
  onUpdateCaption: (id: string, caption: string) => void;
  onDelete: (id: string) => void;
  onBringToFront: (id: string) => void;
  onEdit: (photo: Photo) => void; 
  onUpdateScale: (id: string, scale: number) => void;
  onUpdatePhoto: (photo: Photo) => void;
}

const Polaroid: React.FC<PolaroidProps> = ({ 
    photo, 
    showDateStamp, 
    availableFilters, 
    fontSize = 'medium', 
    goldenSentences = '', 
    allowResize,
    onUpdateCaption, 
    onDelete, 
    onBringToFront, 
    onEdit,
    onUpdateScale,
    onUpdatePhoto
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeveloping, setIsDeveloping] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDeveloping(false);
    }, 8000); 
    return () => clearTimeout(timer);
  }, []);

  const handleFilterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Cycle through available filters
    const currentIndex = availableFilters.indexOf(photo.filter);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= availableFilters.length) nextIndex = 0;
    onUpdatePhoto({ ...photo, filter: availableFilters[nextIndex] });
  };

  const handleRandomCaption = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (goldenSentences) {
          const sentences = goldenSentences.split('\n').filter(s => s.trim());
          if (sentences.length > 0) {
              const random = sentences[Math.floor(Math.random() * sentences.length)];
              onUpdateCaption(photo.id, random);
              setIsEditing(false);
              setShowSuggestions(false);
          }
      }
  };

  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation(); // Prevent dragging the card itself
    onBringToFront(photo.id);
    
    const startY = e.clientY;
    const startScale = photo.scale;

    const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaY = startY - moveEvent.clientY; // Drag up to grow, down to shrink
        // Distance logic:
        const delta = moveEvent.clientY - startY;
        const sensitivity = 0.005;
        const newScale = Math.max(0.5, Math.min(3.0, startScale + delta * sensitivity));
        onUpdateScale(photo.id, newScale);
    };

    const handlePointerUp = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const getFilterClass = (type: string) => {
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

  const getFontSizeClass = () => {
      const size = photo.fontSize || fontSize;
      switch (size) {
          case 'small': return 'text-[10px]';
          case 'large': return 'text-lg';
          default: return 'text-sm';
      }
  };

  const date = new Date(photo.timestamp);
  const dateStr = `'${date.getFullYear().toString().slice(2)} ${String(date.getMonth() + 1).padStart(2, '0')} ${String(date.getDate()).padStart(2, '0')}`;

  const renderControls = () => (
    <div className="absolute -right-8 -top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <button 
            onClick={(e) => { e.stopPropagation(); onDelete(photo.id); }}
            className="bg-white text-red-500 rounded-full p-2 shadow-md border border-gray-100 hover:bg-red-50 hover:scale-110 transition-all"
        >
            <X size={14} />
        </button>
        <button 
            onClick={handleFilterClick}
            className="bg-white text-rose-500 rounded-full p-2 shadow-md border border-gray-100 hover:bg-rose-50 hover:scale-110 transition-all"
        >
            <Wand2 size={14} />
        </button>
    </div>
  );

  const renderResizeHandle = () => (
    allowResize && (
        <div 
            className="absolute -right-2 -bottom-2 w-6 h-6 bg-white text-gray-400 rounded-full border border-gray-200 shadow-sm flex items-center justify-center cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-50 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200"
            onPointerDown={handleResizePointerDown}
        >
            <Maximize2 size={12} />
        </div>
    )
  );

  const renderImageContent = () => (
    <>
        <motion.img 
            src={photo.dataUrl} 
            alt="Memory" 
            crossOrigin="anonymous"
            className={`w-full h-full ${getFilterClass(photo.filter)}`} 
            style={{
                objectFit: photo.fit || 'cover',
                objectPosition: photo.focusPoint ? `${photo.focusPoint.x}% ${photo.focusPoint.y}%` : 'center'
            }}
            draggable={false}
            initial={{ filter: "blur(15px) contrast(0.5) grayscale(1)" }}
            animate={isDeveloping ? {
              filter: [
                "blur(15px) contrast(0.5) grayscale(1) brightness(1.8)", 
                "blur(10px) contrast(0.7) grayscale(0.9) brightness(1.4)",
                "blur(5px) contrast(0.9) grayscale(0.4) brightness(1.2)",
                "blur(0px) contrast(1) grayscale(0) brightness(1)"
              ]
            } : { filter: "none", opacity: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
            onClick={(e) => { e.stopPropagation(); onEdit(photo); }}
        />
        
        {isDeveloping && (
             <>
                <motion.div 
                   className="absolute inset-0 z-30 bg-[#223344]"
                   initial={{ opacity: 1 }}
                   animate={{ opacity: 0 }}
                   transition={{ duration: 7, ease: "linear" }}
                />
                 {/* Chemical Flow Layer */}
                <motion.div
                    className="absolute inset-0 z-20 bg-gradient-to-br from-blue-900/40 to-amber-900/40 mix-blend-overlay"
                    initial={{ opacity: 1, scale: 1.2 }}
                    animate={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 7, ease: "easeOut" }}
                />
                {/* Uneven Developing Mask */}
                <motion.div
                    className="absolute inset-0 z-20 bg-[#6b8ba4] mix-blend-hard-light"
                    initial={{ opacity: 1, maskImage: "radial-gradient(circle at 50% 50%, transparent 0%, black 100%)" }}
                    animate={{ 
                        opacity: 0,
                        maskImage: [
                            "radial-gradient(circle at 30% 120%, transparent 10%, black 100%)",
                            "radial-gradient(circle at 70% 80%, transparent 40%, black 100%)",
                            "radial-gradient(circle at 50% 50%, transparent 100%, black 100%)"
                        ]
                    }}
                    transition={{ duration: 6, ease: "easeInOut" }}
                />
             </>
        )}

        {showDateStamp && !isDeveloping && (
             <div 
               className="absolute bottom-2 right-2 font-bold text-[10px] tracking-widest select-none pointer-events-none z-20 opacity-80"
               style={{ 
                   color: '#ff7e33', 
                   fontFamily: "'Courier New', monospace",
                   mixBlendMode: 'screen'
               }}
             >
               {dateStr}
             </div>
        )}
        
        <div className="absolute inset-0 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none mix-blend-overlay z-30"></div>
    </>
  );

  const renderCaptionInput = (textColorClass: string) => (
     <div className="relative w-full">
         {isEditing ? (
            <div className="relative">
                <input
                    autoFocus
                    type="text"
                    value={photo.caption}
                    onChange={(e) => onUpdateCaption(photo.id, e.target.value)}
                    onBlur={() => {
                        // Delayed blur to allow clicking suggestions
                        setTimeout(() => {
                             setIsEditing(false);
                             setShowSuggestions(false);
                        }, 200);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                    className={`w-full bg-transparent border-b border-gray-300 text-center handwritten ${getFontSizeClass()} ${textColorClass} leading-none focus:outline-none p-1`}
                    placeholder="写下回忆..."
                />
                {showSuggestions && goldenSentences && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg z-50 max-h-32 overflow-y-auto text-left border border-gray-100 scrollbar-hide">
                         <div 
                            className="px-3 py-2 hover:bg-rose-50 cursor-pointer text-xs text-rose-500 border-b border-gray-50 font-bold flex items-center gap-2 sticky top-0 bg-white/95 backdrop-blur-sm"
                            onMouseDown={handleRandomCaption}
                         >
                            <Shuffle size={12} /> 随机金句 (Random)
                         </div>
                        {goldenSentences.split('\n').filter(s=>s.trim()).map((sentence, idx) => (
                            <div 
                                key={idx}
                                className="px-3 py-2 hover:bg-rose-50 cursor-pointer text-xs text-gray-600 border-b border-gray-50 last:border-0"
                                onMouseDown={(e) => {
                                    e.preventDefault(); 
                                    onUpdateCaption(photo.id, sentence);
                                    setIsEditing(false);
                                }}
                            >
                                {sentence}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ) : (
            <div 
                onClick={() => setIsEditing(true)}
                className={`w-full h-full flex items-center justify-center text-center handwritten ${getFontSizeClass()} ${textColorClass} cursor-text px-2 leading-none min-h-[1.5em] group-hover:bg-gray-50/30 rounded transition-colors`}
            >
                {photo.caption || <span className="text-gray-300 text-[10px] font-sans opacity-50 flex items-center gap-1"><MessageCircle size={10}/> Click to note</span>}
            </div>
        )}
     </div>
  );

  const frameStyle = "bg-[#fdfdfd] shadow-[0_2px_10px_rgba(0,0,0,0.15)] rounded-[2px] transition-shadow hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)]";

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ scale: 0.5, opacity: 0, y: 300, x: 0, rotate: 0 }}
      animate={{ scale: photo.scale, rotate: photo.rotation, opacity: 1, x: photo.x, y: photo.y }}
      transition={{ type: "spring", damping: 20, stiffness: 100, mass: 1.2 }}
      style={{ zIndex: photo.zIndex }}
      whileDrag={{ scale: photo.scale * 1.05, zIndex: 9999, cursor: 'grabbing' }}
      onDragStart={() => onBringToFront(photo.id)}
      onTap={() => onBringToFront(photo.id)}
      className="absolute left-1/2 top-1/2 -ml-[5.5rem] -mt-[5.5rem] touch-none cursor-grab"
    >
      <div className={`relative group ${photo.template === 'cinema' ? 'bg-[#111] border-gray-800' : 'bg-[#fdfdfd]'} ${photo.template === 'cinema' ? 'w-56 h-40 p-3' : 'w-44 h-52 p-3 pb-1'} ${frameStyle}`}>
          {photo.template === 'cinema' ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden relative">
                   <div className="w-full h-[80%] overflow-hidden relative">{renderImageContent()}</div>
                   {photo.caption && <div className="absolute bottom-1 text-[8px] text-yellow-500 opacity-80">{photo.caption}</div>}
              </div>
          ) : (
             <div className="flex flex-col h-full">
                <div className="w-[9.5rem] h-[9.5rem] bg-[#101010] overflow-hidden relative mb-2 shrink-0 mx-auto shadow-inner">
                   {renderImageContent()}
                </div>
                <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                   {renderCaptionInput('text-gray-800')}
                </div>
             </div>
          )}
          {renderControls()}
          {renderResizeHandle()}
      </div>
    </motion.div>
  );
};

export default Polaroid;
