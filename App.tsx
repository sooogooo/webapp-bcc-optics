
import React, { useState, useRef, useEffect } from 'react';
import RetroCamera from './components/RetroCamera.tsx';
import TLRViewfinder, { TLRViewfinderHandle } from './components/TLRViewfinder.tsx';
import Polaroid from './components/Polaroid.tsx';
import SlideViewer from './components/SlideViewer.tsx';
import SettingsModal from './components/SettingsModal.tsx';
import TemplateModal from './components/TemplateModal.tsx';
import PhotoEditor from './components/PhotoEditor.tsx';
import GameplayGuide from './components/GameplayGuide.tsx';
import { Photo, FilterType, CameraMode, AppSettings, TemplateType } from './types.ts';
import { Settings, Image as ImageIcon, LayoutTemplate, Share2, Trash2, Info, Download, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { GoogleGenAI } from "@google/genai";

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

const RICH_GOLDEN_SENTENCES = `生活不是等待风暴过去，而是学会在雨中跳舞。
Keep calm and carry on.
今日份的快乐。
捕捉美好瞬间。
时间会证明一切。
Stay hungry, stay foolish.
星辰大海，永不止步。
Small moments, big memories.
万物皆有裂痕，那是光照进来的地方。
心若向阳，无谓悲伤。
热爱可抵岁月漫长。
追风赶月莫停留，平芜尽处是春山。
生活明朗，万物可爱。
保持热爱，奔赴山海。
来日方长，何惧车遥马慢。
满目山河空念远，落花风雨更伤春。
人生如逆旅，我亦是行人。
且将新火试新茶，诗酒趁年华。
愿你出走半生，归来仍是少年。
岁月静好，现世安稳。
一期一会，世当珍惜。
你若安好，便是晴天。
听风吟，看雨落。
花开花落，云卷云舒。
简单的生活，最美好。
眼里有光，心中有爱。
做一个温柔的人。
不负韶华，不负自己。
未来可期。
每一次快门，都是一次心动。
定格时光，留住美好。
胶片里的旧时光。
怀旧，是一种情怀。
复古，是一种态度。
时间都去哪儿了。
光阴的故事。
致青春。
匆匆那年。
那年夏天，宁静的海。
风吹麦浪。
人间烟火气，最抚凡人心。
偷得浮生半日闲。
慢生活，深呼吸。
心远地自偏。
采菊东篱下，悠然见南山。
行到水穷处，坐看云起时。
清风徐来，水波不兴。
山川异域，风月同天。
但愿人长久，千里共婵娟。
海内存知己，天涯若比邻。
相知无远近，万里尚为邻。
莫愁前路无知己，天下谁人不识君。
劝君更尽一杯酒，西出阳关无故人。
洛阳亲友如相问，一片冰心在玉壶。
长风破浪会有时，直挂云帆济沧海。
会当凌绝顶，一览众山小。
大漠孤烟直，长河落日圆。
落霞与孤鹜齐飞，秋水共长天一色。
春江花月夜。
海上生明月，天涯共此时。
今夜月色真美。
风也温柔，你也温柔。
你是人间四月天。
斯人若彩虹，遇上方知有。
所爱隔山海，山海皆可平。
愿得一人心，白首不相离。
执子之手，与子偕老。
陪伴是最长情的告白。
因为爱情。
稳住，我们能赢。
奥力给！
打工人，打工魂。
凡尔赛文学。
爷青回。
破防了。
绝绝子。
yyds。
真香。
我太难了。
小朋友，你是否有很多问号？
黑人问号脸。
吃瓜群众。
虽然但是。
这就很尴尬了。
Duck不必。
耗子尾汁。
年轻人不讲武德。
我看不懂，但我大受震撼。
小丑竟是我自己。
伤害性不大，侮辱性极强。
夺笋啊。
那没事了。
就这？
你在教我做事？
我不要你觉得，我要我觉得。
格局打开。
拿来吧你。
沉浸式体验。
氛围感拉满。
这种事，我见得多了。
人类的悲欢并不相通。
我只觉得他们吵闹。
在此刻，我只愿做一枚安静的美男子。
确认过眼神。
燃烧我的卡路里。
不如跳舞。
世界那么大，我想去看看。
生活不止眼前的苟且，还有诗和远方。
你的负担将变成礼物，你受的苦将照亮你的路。
所有失去的，都会以另一种方式归来。
与其感慨路难行，不如马上出发。
人生没有白走的路，每一步都算数。
不要假装努力，结果不会陪你演戏。
自律给我自由。
越努力，越幸运。
你必须非常努力，才能看起来毫不费力。
既然选择了远方，便只顾风雨兼程。
种一棵树最好的时间是十年前，其次是现在。
不积跬步，无以至千里。
天道酬勤。
即使没有人为你鼓掌，也要优雅的谢幕。
靠山山会倒，靠人人会跑，只有自己最可靠。
求人不如求己。
没有伞的孩子，必须努力奔跑。
只有拼出来的美丽，没有等出来的辉煌。
将来的你，一定会感谢现在拼命的自己。
世上无难事，只要肯登攀。
只要功夫深，铁杵磨成针。
宝剑锋从磨砺出，梅花香自苦寒来。
吃得苦中苦，方为人上人。
我们要悄悄努力，然后惊艳所有人。
梦想还是要有的，万一实现了呢。
不忘初心，方得始终。
心之所向，素履以往。
路漫漫其修远兮，吾将上下而求索。
我命由我不由天。
乘风破浪。
披荆斩棘。
勇往直前。
永不放弃。
坚持就是胜利。
相信自己，你就是最棒的。
你是最胖的（划掉）。
今日宜：开心。
今日忌：不开心。
又是元气满满的一天。
早安，打工人。
晚安，玛卡巴卡。
干饭人，干饭魂，干饭都是人上人。
没有困难的工作，只有勇敢的打工人。
加油，读书人。
知识改变命运。
书中自有黄金屋。
书中自有颜如玉。
腹有诗书气自华。
好看的皮囊千篇一律，有趣的灵魂万里挑一。`;

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modals
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>(CameraMode.User);
  
  // Settings
  const [appSettings, setAppSettings] = useState<AppSettings>({
    allowResize: true,
    allowRotation: true,
    showDateStamp: true,
    activeFilters: ['normal', 'bw', 'vintage'], 
    enableSounds: true,
    iconStyle: 'classic',
    defaultTemplate: 'classic',
    goldenSentences: RICH_GOLDEN_SENTENCES,
    aiPersonality: 'standard',
    aiLength: 'short',
    theme: 'neutral',
    fontSize: 'medium'
  });

  const viewfinderRef = useRef<TLRViewfinderHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      const hasSeenGuide = localStorage.getItem('bcc_has_seen_guide');
      if (!hasSeenGuide) {
          setIsGuideOpen(true);
          localStorage.setItem('bcc_has_seen_guide', 'true');
      }
  }, []);

  // AI Face Detection for Smart Crop
  const analyzePhotoForCrop = async (photoId: string, dataUrl: string) => {
    if (!process.env.API_KEY) return;
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = dataUrl.split(',')[1];

      // Prompt to find face center
      const prompt = `Detect the main face in this image. Return a JSON object strictly in this format: { "found": boolean, "x": number, "y": number }. 
      "found" is true if a face is clearly visible. 
      "x" and "y" are the percentage coordinates (0-100) of the center of the face relative to top-left (x is horizontal, y is vertical). 
      If no face is found, set found to false.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
            { text: prompt }
          ]
        }
      });

      const text = response.text?.replace(/```json|```/g, '').trim();
      if (text) {
        const result = JSON.parse(text);
        
        setPhotos(prev => prev.map(p => {
          if (p.id !== photoId) return p;
          
          if (result.found) {
             // Face found
             // Check if face is already roughly centered (within 10% tolerance)
             const isCentered = Math.abs(result.x - 50) < 10 && Math.abs(result.y - 50) < 10;
             
             if (isCentered) {
                 // Face is centered, preserve original aspect ratio
                 return {
                   ...p,
                   fit: 'contain',
                   focusPoint: { x: 50, y: 50 }
                 };
             } else {
                 // Face is off-center, crop to square (cover) and center the face
                 return {
                   ...p,
                   fit: 'cover',
                   focusPoint: { x: result.x, y: result.y }
                 };
             }
          } else {
             // No face detected: Preserve original ratio (contain)
             return {
               ...p,
               fit: 'contain',
               focusPoint: { x: 50, y: 50 }
             };
          }
        }));
      }
    } catch (e) {
      console.error("Smart crop failed:", e);
    }
  };

  const createPhoto = (dataUrl: string) => {
    // Try to pick a random caption initially
    const sentences = appSettings.goldenSentences.split('\n').filter(s => s.trim());
    const randomCaption = sentences.length > 0 ? sentences[Math.floor(Math.random() * sentences.length)] : "";

    const newId = Date.now().toString();
    const newPhoto: Photo = {
      id: newId,
      dataUrl: dataUrl,
      caption: randomCaption, 
      x: randomRange(-20, 20),
      y: randomRange(-100, -50), 
      rotation: appSettings.allowRotation ? randomRange(-5, 5) : 0,
      scale: appSettings.allowResize ? randomRange(0.95, 1.05) : 1,
      timestamp: Date.now(),
      zIndex: maxZIndex + 1,
      filter: appSettings.activeFilters[0] || 'normal',
      template: appSettings.defaultTemplate,
      fit: 'cover', // Start with cover, AI will adjust to contain/cover based on content
      focusPoint: { x: 50, y: 50 }
    };

    setMaxZIndex(prev => prev + 1);
    setPhotos(prev => [...prev, newPhoto]);

    // Trigger AI Analysis
    analyzePhotoForCrop(newId, dataUrl);
  };

  const handleShutterPress = () => {
    const rawImageSrc = viewfinderRef.current?.capture();
    if (rawImageSrc) {
       createPhoto(rawImageSrc);
    } else {
       fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) createPhoto(ev.target.result as string);
        };
        reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveCollage = async () => {
      const canvasArea = document.getElementById('canvas-area');
      if (!canvasArea || photos.length === 0) {
          alert("暂无照片可保存 (No photos to save)!");
          return;
      }

      setIsSaving(true);

      try {
          // Target 4K resolution (approx 3840px on the longest side)
          const TARGET_MAX_DIMENSION = 3840;
          const { offsetWidth, offsetHeight } = canvasArea;
          const currentMaxDim = Math.max(offsetWidth, offsetHeight);
          
          // Calculate scale needed to reach target dimension
          const scale = TARGET_MAX_DIMENSION / currentMaxDim;

          const canvas = await html2canvas(canvasArea, {
              scale: scale,
              backgroundColor: null, 
              useCORS: true,
              logging: false,
              allowTaint: true,
          });

          const link = document.createElement('a');
          link.download = `BCC_Collage_${Date.now()}.png`;
          link.href = canvas.toDataURL('image/png', 1.0);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
      } catch (error) {
          console.error("Save failed:", error);
          alert("保存失败，请重试 (Failed to save image).");
      } finally {
          setIsSaving(false);
      }
  };
  
  const RenderIcon = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <div className="flex flex-col items-center gap-1 text-neutral-500 hover:text-rose-500 transition-colors group cursor-pointer">
        <Icon size={22} strokeWidth={1.5} className="group-hover:-translate-y-1 transition-transform"/>
        <span className="text-[9px] font-bold tracking-wider uppercase">{label}</span>
    </div>
  );

  return (
    <div className="relative w-full h-screen bg-[#e8e6e1] overflow-hidden flex flex-col font-sans select-none">
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />

      {/* -- HEADER -- */}
      <header className="absolute top-0 left-0 right-0 h-16 bg-white/60 backdrop-blur-md border-b border-white/40 z-30 flex justify-between items-center px-4 shadow-sm">
         <div className="flex items-center gap-3">
             <img src="https://docs.bccsw.cn/logo.png" alt="BCC Logo" className="w-8 h-8 object-contain" />
             <div className="flex flex-col">
                 <span className="text-xs font-bold tracking-[0.2em] text-neutral-800">BCC OPTICS</span>
                 <span className="text-[8px] text-neutral-500 tracking-wide">TIME MACHINE</span>
             </div>
         </div>
         <div className="flex gap-2">
            <button onClick={() => setIsGuideOpen(true)} className="p-2 text-neutral-400 hover:text-rose-500">
                <HelpCircle size={20} />
            </button>
            <button onClick={() => setIsAboutOpen(true)} className="p-2 text-neutral-400 hover:text-rose-500">
                <Info size={20} />
            </button>
         </div>
      </header>

      {/* -- CANVAS -- */}
      <div className="flex-1 relative w-full h-full overflow-hidden" 
           id="canvas-area"
           style={{ backgroundImage: 'radial-gradient(#b0a89e 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
         <AnimatePresence>
            {photos.map(photo => (
              <Polaroid 
                key={photo.id} 
                photo={photo} 
                showDateStamp={appSettings.showDateStamp}
                availableFilters={appSettings.activeFilters}
                fontSize={appSettings.fontSize}
                goldenSentences={appSettings.goldenSentences}
                allowResize={appSettings.allowResize}
                onUpdateCaption={(id, val) => setPhotos(p => p.map(x => x.id === id ? {...x, caption: val} : x))}
                onDelete={(id) => setPhotos(p => p.filter(x => x.id !== id))}
                onBringToFront={(id) => { setMaxZIndex(z => z + 1); setPhotos(p => p.map(x => x.id === id ? {...x, zIndex: maxZIndex + 1} : x)) }}
                onEdit={(p) => setEditingPhoto(p)}
                onUpdateScale={(id, scale) => setPhotos(p => p.map(x => x.id === id ? {...x, scale} : x))}
                onUpdatePhoto={(updated) => setPhotos(p => p.map(x => x.id === updated.id ? updated : x))}
              />
            ))}
         </AnimatePresence>
         
         {isSaving && (
            <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center animate-pulse">
                    <Download className="mb-2 text-rose-500" size={24} />
                    <span className="text-sm font-bold text-rose-500">SAVING 4K COLLAGE...</span>
                    <span className="text-[10px] text-gray-400">Processing High Resolution Export</span>
                </div>
            </div>
         )}
      </div>

      {/* -- CAMERA -- */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <RetroCamera 
            onPressShutter={handleShutterPress}
            onSwitchCamera={() => setCameraMode(m => m === CameraMode.User ? CameraMode.Environment : CameraMode.User)}
            enableSounds={appSettings.enableSounds} 
        />
      </div>

      {/* -- FOOTER -- */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#fcfcfc] border-t border-white shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-50 flex items-start justify-between px-6 pt-4">
          <div className="flex gap-8 pl-4">
              <button onClick={() => setIsSettingsOpen(true)}><RenderIcon icon={Settings} label="设置" /></button>
              <button onClick={() => setIsGalleryOpen(true)}><RenderIcon icon={ImageIcon} label="图库" /></button>
          </div>
          
          <div className="relative -top-10"><TLRViewfinder ref={viewfinderRef} cameraMode={cameraMode} /></div>

          <div className="flex gap-8 pr-4">
              <button onClick={() => setIsTemplateModalOpen(true)}><RenderIcon icon={LayoutTemplate} label="模板" /></button>
              <button onClick={handleSaveCollage} disabled={isSaving}>
                  <RenderIcon icon={Share2} label="分享" />
              </button>
          </div>
      </div>

      {/* -- MODALS -- */}
      <AnimatePresence>
        {isSettingsOpen && (
           <SettingsModal 
              settings={appSettings} 
              onUpdateSettings={setAppSettings} 
              onClose={() => setIsSettingsOpen(false)} 
           />
        )}
        {isGalleryOpen && (
           <SlideViewer photos={photos} initialIndex={0} onClose={() => setIsGalleryOpen(false)} />
        )}
        {isTemplateModalOpen && (
            <TemplateModal 
                currentTemplate={appSettings.defaultTemplate}
                onSelectTemplate={(t) => { setAppSettings(s => ({...s, defaultTemplate: t})); setIsTemplateModalOpen(false); }}
                onClose={() => setIsTemplateModalOpen(false)}
            />
        )}
        {editingPhoto && (
            <PhotoEditor 
                photo={editingPhoto}
                settings={appSettings}
                onSave={(updated) => {
                    setPhotos(p => p.map(x => x.id === updated.id ? updated : x));
                    setEditingPhoto(null);
                }}
                onClose={() => setEditingPhoto(null)}
            />
        )}
        {isGuideOpen && (
            <GameplayGuide onClose={() => setIsGuideOpen(false)} />
        )}
        {isAboutOpen && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setIsAboutOpen(false)}
            >
                <motion.div 
                    initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                    className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                         <img src="https://docs.bccsw.cn/logo.png" alt="BCC Logo" className="w-16 h-16 object-contain" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-800 mb-1">BCC OPTICS</h2>
                    <p className="text-xs text-rose-500 tracking-widest uppercase mb-6">Time Machine v2.4</p>
                    
                    <div className="text-left space-y-3 text-xs text-neutral-600 bg-gray-50 p-4 rounded-xl mb-6">
                        <p className="font-bold text-neutral-900">重庆联合丽格第五医疗美容医院</p>
                        <p>地址：重庆市渝中区临江支路28号</p>
                        <p>Email: bccsw@cqlhlg.work</p>
                        <p>Tel: 023-68726872</p>
                    </div>

                    <div className="flex justify-center mb-6">
                        <img src="https://docs.bccsw.cn/consultant.png" alt="QR" className="w-32 h-32 object-contain border p-1 rounded-lg" />
                    </div>

                    <div className="text-[10px] text-neutral-400 flex flex-col gap-1 pb-4 border-t border-gray-100 pt-4">
                        <a href="https://beian.miit.gov.cn/" target="_blank" className="hover:text-rose-500 transition-colors">渝ICP备15004871号</a>
                        <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=50010302001456" target="_blank" className="hover:text-rose-500 transition-colors">渝公网安备 50010302001456号</a>
                    </div>
                    
                    <button onClick={() => setIsAboutOpen(false)} className="w-full py-3 bg-neutral-900 text-white rounded-xl font-bold text-sm">Close</button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
