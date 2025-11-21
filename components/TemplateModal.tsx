
import React from 'react';
import { motion } from 'framer-motion';
import { X, LayoutTemplate, Check } from 'lucide-react';
import { TemplateType } from '../types.ts';

interface TemplateModalProps {
  currentTemplate: TemplateType;
  onSelectTemplate: (t: TemplateType) => void;
  onClose: () => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ currentTemplate, onSelectTemplate, onClose }) => {
  const templates: { id: TemplateType; label: string; desc: string }[] = [
    { id: 'classic', label: '经典拍立得 (Classic)', desc: '怀旧的底部留白风格' },
    { id: 'cinema', label: '电影宽幅 (Cinema)', desc: '黑色上下遮幅，电影感' },
    { id: 'minimal', label: '极简白框 (Minimal)', desc: '均匀的白色边框' },
    { id: 'stamp', label: '邮票齿孔 (Stamp)', desc: '边缘带有锯齿效果' },
    { id: 'film', label: '胶卷底片 (Negative)', desc: '透明胶片与齿孔' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden mb-4 sm:mb-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-800">
            <LayoutTemplate size={20} />
            <span className="font-bold">选择相纸模板 (TEMPLATE)</span>
          </div>
          <button onClick={onClose} className="bg-gray-100 p-1 rounded-full hover:bg-gray-200">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTemplate(t.id)}
              className={`w-full flex items-center p-3 rounded-xl border transition-all ${
                currentTemplate === t.id
                  ? 'border-black bg-black text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-start flex-1">
                <span className="font-bold text-sm">{t.label}</span>
                <span className={`text-xs ${currentTemplate === t.id ? 'text-gray-400' : 'text-gray-400'}`}>
                  {t.desc}
                </span>
              </div>
              {currentTemplate === t.id && <Check size={18} />}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TemplateModal;
