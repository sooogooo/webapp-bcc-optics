
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Settings as SettingsIcon, Check, Volume2, VolumeX, Sparkles, Palette, Type, MessageSquare } from 'lucide-react';
import { AppSettings, FilterType, IconStyle, AIPersonality, AILength } from '../types.ts';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onUpdateSettings, onClose }) => {
  const [tab, setTab] = useState<'general' | 'ai' | 'visual'>('general');

  const availableFilters: { id: FilterType; label: string; color: string }[] = [
    { id: 'normal', label: '原色 (Standard)', color: 'bg-gray-400' },
    { id: 'vivid', label: '鲜艳 (Vivid)', color: 'bg-red-500' },
    { id: 'bw', label: '黑白 (Mono)', color: 'bg-black' },
    { id: 'vintage', label: '复古 (Vintage)', color: 'bg-amber-600' },
    { id: 'warm', label: '暖调 (Warm)', color: 'bg-orange-400' },
    { id: 'cool', label: '冷调 (Cool)', color: 'bg-blue-400' },
    { id: 'drama', label: '剧场 (Drama)', color: 'bg-purple-900' },
    { id: 'cyber', label: '赛博 (Cyber)', color: 'bg-cyan-400' },
    { id: 'beauty_face', label: '医美捏脸 (Reshape)', color: 'bg-rose-200' },
    { id: 'makeup', label: '化妆扮靓 (Makeup)', color: 'bg-pink-400' },
    { id: 'micro_sculpt', label: '微整注射 (Sculpt)', color: 'bg-rose-500' },
    { id: 'kodak', label: '柯达金 (Kodak)', color: 'bg-yellow-500' },
    { id: 'fuji', label: '富士风 (Fuji)', color: 'bg-emerald-500' },
    { id: 'agfa', label: '爱克发 (Agfa)', color: 'bg-red-700' },
  ];

  const toggleSetting = (key: keyof AppSettings) => {
    if (typeof settings[key] === 'boolean') {
        onUpdateSettings({ ...settings, [key]: !settings[key] });
    }
  };

  const toggleFilter = (filterId: FilterType) => {
    let newFilters = [...settings.activeFilters];
    if (newFilters.includes(filterId)) {
        if (newFilters.length > 1) {
            newFilters = newFilters.filter(f => f !== filterId);
        }
    } else {
        if (newFilters.length < 3) {
            newFilters.push(filterId);
        } else {
            newFilters.shift(); // Remove first to keep strictly 3
            newFilters.push(filterId);
        }
    }
    onUpdateSettings({ ...settings, activeFilters: newFilters });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#fcfcfc] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh] max-h-[700px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-2 text-neutral-800">
             <SettingsIcon size={20} className="text-rose-400" />
             <span className="font-bold tracking-wide">设置 (SETTINGS)</span>
           </div>
           <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
             <X size={18} className="text-gray-500" />
           </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-white/50">
            <button 
                onClick={() => setTab('general')} 
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${tab === 'general' ? 'text-rose-500 border-b-2 border-rose-500 bg-rose-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
            >
                通用
            </button>
            <button 
                onClick={() => setTab('visual')} 
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${tab === 'visual' ? 'text-rose-500 border-b-2 border-rose-500 bg-rose-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
            >
                视觉 & 滤镜
            </button>
            <button 
                onClick={() => setTab('ai')} 
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${tab === 'ai' ? 'text-rose-500 border-b-2 border-rose-500 bg-rose-50/50' : 'text-gray-400 hover:bg-gray-50'}`}
            >
                AI 智能
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 bg-[#fcfcfc]">
            
            {/* GENERAL TAB */}
            {tab === 'general' && (
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-gray-100 rounded-lg"><Volume2 size={18} className="text-gray-600"/></div>
                         <div>
                             <p className="text-sm font-bold text-gray-800">相机音效</p>
                             <p className="text-[10px] text-gray-400">快门与卷片机械声</p>
                         </div>
                      </div>
                      <button onClick={() => toggleSetting('enableSounds')} className={`w-11 h-6 rounded-full transition-colors ${settings.enableSounds ? 'bg-rose-400' : 'bg-gray-200'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${settings.enableSounds ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                      </button>
                   </div>

                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-gray-100 rounded-lg"><Check size={18} className="text-gray-600"/></div>
                         <div>
                             <p className="text-sm font-bold text-gray-800">自动保存</p>
                             <p className="text-[10px] text-gray-400">拍摄后存入本地缓存</p>
                         </div>
                      </div>
                      {/* Dummy Switch */}
                      <div className="w-11 h-6 rounded-full bg-rose-400 opacity-50 cursor-not-allowed flex items-center justify-end px-0.5"><div className="w-5 h-5 bg-white rounded-full shadow-sm"></div></div>
                   </div>
                </div>
            )}

            {/* VISUAL TAB */}
            {tab === 'visual' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <label className="text-xs font-bold text-gray-400 tracking-widest uppercase flex items-center gap-1">
                                <Palette size={12}/> 预设滤镜 (Active Filters)
                            </label>
                            <span className="text-[10px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                                {settings.activeFilters.length}/3
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {availableFilters.map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => toggleFilter(f.id)}
                                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                                        settings.activeFilters.includes(f.id)
                                        ? 'bg-white border-rose-300 shadow-sm ring-1 ring-rose-100'
                                        : 'bg-gray-50 border-transparent opacity-60'
                                    }`}
                                >
                                    <div className={`w-3 h-3 rounded-full ${f.color}`}></div>
                                    <span className="text-xs text-gray-700 font-medium">{f.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Size */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3 flex items-center gap-1">
                            <Type size={12}/> UI 字号
                        </label>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            {['small', 'medium', 'large'].map((s) => (
                                <button 
                                    key={s}
                                    onClick={() => onUpdateSettings({...settings, fontSize: s as any})}
                                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${settings.fontSize === s ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}
                                >
                                    {s === 'small' ? '小' : s === 'medium' ? '中' : '大'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* AI TAB */}
            {tab === 'ai' && (
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3 flex items-center gap-1">
                            <Sparkles size={12}/> AI 性格 (Personality)
                        </label>
                        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                            {[
                                {id: 'standard', label: '标准日常'},
                                {id: 'humorous', label: '轻松幽默'},
                                {id: 'scientific', label: '科学严谨'}
                            ].map((p) => (
                                <button 
                                    key={p.id}
                                    onClick={() => onUpdateSettings({...settings, aiPersonality: p.id as any})}
                                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${settings.aiPersonality === p.id ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                     <div>
                        <label className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3 flex items-center gap-1">
                            <Type size={12}/> 输出长度 (Length)
                        </label>
                        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                            {[
                                {id: 'short', label: '简约 (Short)'},
                                {id: 'standard', label: '标准 (Std)'},
                                {id: 'detailed', label: '详细 (Long)'}
                            ].map((l) => (
                                <button 
                                    key={l.id}
                                    onClick={() => onUpdateSettings({...settings, aiLength: l.id as any})}
                                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${settings.aiLength === l.id ? 'bg-white text-rose-500 shadow-sm' : 'text-gray-400'}`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3 flex items-center gap-1">
                            <MessageSquare size={12}/> 金句库 (Golden Sentences)
                        </label>
                        <textarea
                            value={settings.goldenSentences}
                            onChange={(e) => onUpdateSettings({...settings, goldenSentences: e.target.value})}
                            placeholder="在此输入金句，每行一句。AI将从中挑选..."
                            className="w-full h-32 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 focus:border-rose-300 focus:ring-1 focus:ring-rose-200 outline-none resize-none"
                        />
                        <p className="text-[9px] text-gray-400 mt-1 text-right">用于AI自动配文，每行一句</p>
                    </div>
                </div>
            )}
        </div>

        <div className="bg-gray-50 p-3 text-center text-[10px] text-gray-400 border-t border-gray-100">
            BCC OPTICS LABS • DESIGNED FOR ELEGANCE
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsModal;
