
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Photo } from '../types.ts';
import { ChevronLeft, Share2, Trash2, Heart, Info } from 'lucide-react';

interface SlideViewerProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

const SlideViewer: React.FC<SlideViewerProps> = ({ photos, onClose }) => {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  
  // Sort photos by timestamp descending (newest first)
  const sortedPhotos = [...photos].sort((a, b) => b.timestamp - a.timestamp);

  // Group by date (Simulated)
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  const renderGrid = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col bg-white text-black"
    >
      {/* iOS Header */}
      <div className="pt-12 pb-2 px-4 flex justify-between items-end bg-white/90 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
        <h1 className="text-3xl font-bold tracking-tight">图库</h1>
        <button onClick={onClose} className="text-blue-600 font-semibold text-lg">关闭</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {/* Date Header */}
        <div className="px-4 py-2">
           <span className="text-lg font-bold text-gray-900">{dateStr}</span>
        </div>
        
        {/* Photo Grid */}
        <div className="grid grid-cols-3 gap-[2px] px-0">
           {sortedPhotos.map((photo) => (
             <motion.div 
                key={photo.id}
                layoutId={`photo-${photo.id}`}
                className="aspect-square relative cursor-pointer overflow-hidden bg-gray-100"
                onClick={() => setSelectedPhotoId(photo.id)}
             >
                <img 
                   src={photo.dataUrl} 
                   className="w-full h-full object-cover"
                   loading="lazy"
                />
                {/* Type Indicator Badge */}
                {photo.template !== 'classic' && (
                  <div className="absolute bottom-1 right-1 w-2 h-2 bg-white/80 rounded-full shadow"></div>
                )}
             </motion.div>
           ))}
           {sortedPhotos.length === 0 && (
             <div className="col-span-3 py-20 text-center text-gray-400 flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Info size={20} />
                </div>
                <p>暂无照片</p>
             </div>
           )}
        </div>
      </div>

      {/* Bottom Tab Bar Simulation */}
      <div className="h-20 border-t border-gray-200 bg-white/90 backdrop-blur flex justify-around items-start pt-3 text-gray-400 text-[10px] font-medium">
          <div className="flex flex-col items-center gap-1 text-blue-600">
             <div className="w-6 h-5 bg-blue-600 rounded-sm"></div>
             <span>图库</span>
          </div>
          <div className="flex flex-col items-center gap-1">
             <Heart size={22} />
             <span>为您推荐</span>
          </div>
          <div className="flex flex-col items-center gap-1">
             <div className="w-6 h-5 border-2 border-gray-400 rounded-sm"></div>
             <span>相簿</span>
          </div>
      </div>
    </motion.div>
  );

  const renderDetail = () => {
    const photo = sortedPhotos.find(p => p.id === selectedPhotoId);
    if (!photo) return null;

    return (
      <motion.div 
         className="fixed inset-0 z-50 bg-black flex flex-col"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
      >
         {/* Top Nav */}
         <div className="h-24 pt-8 px-4 flex justify-between items-center text-white z-20 bg-gradient-to-b from-black/60 to-transparent">
             <button onClick={() => setSelectedPhotoId(null)} className="flex items-center text-blue-400 text-lg">
                <ChevronLeft size={28} />
                Back
             </button>
             <div className="text-sm font-medium opacity-80">
                {new Date(photo.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
             </div>
             <button className="text-blue-400 text-lg">Edit</button>
         </div>

         {/* Main Image */}
         <div className="flex-1 flex items-center justify-center relative overflow-hidden">
             <motion.img 
                layoutId={`photo-${photo.id}`}
                src={photo.dataUrl} 
                className={`max-w-full max-h-full object-contain shadow-2xl`}
             />
         </div>

         {/* Bottom Actions */}
         <div className="h-24 pb-8 bg-black/80 backdrop-blur flex justify-between items-center px-8 text-white/90">
            <Share2 size={24} />
            <Heart size={24} />
            <Info size={24} />
            <Trash2 size={24} className="text-red-500" />
         </div>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-white overflow-hidden">
      <AnimatePresence>
        {selectedPhotoId ? renderDetail() : renderGrid()}
      </AnimatePresence>
    </div>
  );
};

export default SlideViewer;
