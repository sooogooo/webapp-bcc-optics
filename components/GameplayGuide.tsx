
import React from 'react';
import { motion } from 'framer-motion';
import { X, Camera, Smartphone, Wand2 } from 'lucide-react';

interface GameplayGuideProps {
  onClose: () => void;
}

const GameplayGuide: React.FC<GameplayGuideProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">使用指南 (GUIDE)</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-8">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                    <Camera size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 mb-1">1. 拍摄 (Snap)</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">点击红色快门按钮拍摄。您也可以点击取景器进行对焦。</p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                    <Smartphone size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 mb-1">2. 显影 (Develop)</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">照片会在桌面上慢慢显影。您可以拖动它们，重新排列。</p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                    <Wand2 size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 mb-1">3. 编辑 (Edit)</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">点击照片上的魔棒或直接点击照片，添加滤镜、AI配文或进行修图。</p>
                </div>
            </div>
        </div>
        
        <div className="bg-gray-50 p-4 text-center">
            <button 
                onClick={onClose}
                className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 active:scale-95 transition-all"
            >
                开始体验 (Start)
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameplayGuide;
