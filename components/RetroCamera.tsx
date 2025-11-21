
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface RetroCameraProps {
  onPressShutter: () => void;
  onSwitchCamera: () => void;
  enableSounds: boolean;
  disabled?: boolean;
}

const RetroCamera: React.FC<RetroCameraProps> = ({ onPressShutter, onSwitchCamera, enableSounds, disabled }) => {
  const [isWinding, setIsWinding] = useState(false);
  const [shutterPressed, setShutterPressed] = useState(false);

  // Sound effects
  const playSound = (type: 'shutter' | 'wind') => {
    if (!enableSounds) return;
    
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    
    if (type === 'shutter') {
        // Mechanical Shutter Curtain (Leica "Snick")
        // Low frequency thud
        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.1);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);

        // High frequency metallic click
        const click = ctx.createOscillator();
        click.type = 'square';
        click.frequency.setValueAtTime(800, t);
        click.frequency.exponentialRampToValueAtTime(100, t + 0.05);
        
        const clickGain = ctx.createGain();
        clickGain.gain.setValueAtTime(0.1, t);
        clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        
        click.connect(clickGain);
        clickGain.connect(ctx.destination);
        click.start(t);

        // White noise for mechanical friction
        const noise = ctx.createBufferSource();
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = buffer;
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(t);

    } else {
        // Winding Ratchet (Zip-click)
        // A series of short clicks
        const now = t;
        for(let i=0; i<5; i++) {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400 + (i * 50), now + (i * 0.06));
            osc.frequency.linearRampToValueAtTime(100, now + (i * 0.06) + 0.05);
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, now + (i * 0.06));
            gain.gain.linearRampToValueAtTime(0.1, now + (i * 0.06) + 0.01);
            gain.gain.linearRampToValueAtTime(0, now + (i * 0.06) + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + (i * 0.06));
            osc.stop(now + (i * 0.06) + 0.1);
        }
    }
  };

  const handleShutter = () => {
    if (disabled || isWinding) return;
    
    setShutterPressed(true);
    playSound('shutter');
    onPressShutter();

    // Simulate winding action automatic reset
    setTimeout(() => {
      setShutterPressed(false);
    }, 200);
  };

  const handleAdvanceLever = () => {
      if (isWinding) return;
      setIsWinding(true);
      playSound('wind');
      
      // Trigger switch camera logic
      onSwitchCamera();

      setTimeout(() => setIsWinding(false), 600);
  };

  return (
    <div className="relative select-none filter drop-shadow-2xl">
      
      {/* 
         LENS BARREL PROTRUSION (Facing UP / Top of screen)
      */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-[35px] z-0 flex flex-col-reverse items-center drop-shadow-xl opacity-95">
         
         {/* 1. Lens Mount Base */}
         <div className="w-[180px] h-[12px] bg-gradient-to-t from-[#d0d0d0] to-[#999] rounded-t-sm shadow-[0_-2px_5px_rgba(0,0,0,0.2)] border-x border-t border-gray-400"></div>
         
         {/* 2. Depth of Field Scale Ring */}
         <div className="w-[160px] h-[14px] bg-[#111] border-x border-gray-800 relative flex justify-center items-center overflow-hidden">
             <div className="w-full flex justify-between px-4 text-[6px] text-white font-mono opacity-80 rotate-180">
                <span>16</span><span>8</span><span className="text-red-500">|</span><span>8</span><span>16</span>
             </div>
         </div>

         {/* 3. Focus Ring with Tiger Claw Tab */}
         <div className="w-[150px] h-[22px] bg-[#1a1a1a] border-x border-y border-gray-800 relative flex items-center justify-center shadow-[inset_0_0_5px_black]">
            {/* Ribbed Texture */}
            <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#333_2px,#333_4px)]"></div>
            
            {/* Tiger Claw Tab */}
            <div className="absolute -top-1 left-[30%] w-8 h-6 bg-[#111] rounded-t-xl border border-gray-700 shadow-lg transform rotate-12 z-30 flex justify-center items-start pt-1">
                <div className="w-4 h-3 bg-[#0a0a0a] rounded-t-lg shadow-[inset_0_0_2px_white]"></div>
            </div>
            
            {/* Distance Scale */}
            <div className="relative z-10 flex gap-4 text-[7px] font-bold text-yellow-500 font-mono">
               <span>1</span>
               <span>1.2</span>
               <span>1.5</span>
               <span>2</span>
               <span>3</span>
               <span>5</span>
               <span className="text-[9px]">∞</span>
            </div>
         </div>

         {/* 4. Aperture Ring */}
         <div className="w-[135px] h-[16px] bg-[#222] border-x border-gray-700 flex items-center justify-center gap-3 shadow-[0_-2px_4px_rgba(0,0,0,0.5)] relative z-20">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white triangle-up"></div>
            <span className="text-[8px] text-white font-mono">2</span>
            <span className="text-[8px] text-gray-400 font-mono">2.8</span>
            <span className="text-[8px] text-gray-400 font-mono">4</span>
            <span className="text-[8px] text-gray-400 font-mono">5.6</span>
            <span className="text-[8px] text-gray-400 font-mono">8</span>
            <span className="text-[8px] text-gray-400 font-mono">16</span>
         </div>

         {/* 5. Front Element / Hood Mount */}
         <div className="w-[125px] h-[10px] bg-[#0a0a0a] border-t border-gray-800 flex items-center justify-center relative overflow-hidden">
             <span className="text-[5px] text-white/70 tracking-widest uppercase scale-75">Summicron-M 1:2/35</span>
             <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/5 to-transparent opacity-50"></div>
         </div>

         {/* 6. Front Glass Reflection */}
         <div className="w-[115px] h-[6px] bg-gradient-to-r from-purple-900 via-emerald-800 to-purple-900 rounded-t-full opacity-90 blur-[1px] border-t border-white/10"></div>
      </div>

      {/* 
        CAMERA BODY (Top Plate)
      */}
      <div className="relative w-[340px] h-[80px] sm:w-[420px] sm:h-[90px] bg-[#d8d8d8] rounded-[16px] border-b-[6px] border-[#999] shadow-lg z-10 flex items-center justify-between px-8 overflow-visible">
        
        {/* Brushed Metal Texture */}
        <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-[#f2f2f2] to-[#ccc] z-0"></div>
        <div className="absolute inset-0 rounded-[14px] bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-30 z-0"></div>
        
        {/* -- LEFT SIDE: Rewind Crank -- */}
        <div className="relative w-14 h-14 z-10 group cursor-pointer">
           <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-[0_2px_4px_rgba(0,0,0,0.3)] border border-gray-400/50 group-hover:brightness-105 transition-all"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-2 bg-gray-500 rounded-full shadow-inner transform -rotate-45"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-600 rounded-full border border-gray-400 shadow"></div>
        </div>

        {/* -- CENTER: Hot Shoe & Branding -- */}
        <div className="relative z-10 flex flex-col items-center translate-y-1">
           <div className="w-10 h-8 bg-[#b0b0b0] border border-[#888] shadow-inner flex items-center justify-center relative">
              <div className="w-full h-full absolute top-0 left-0 border-t-2 border-b-2 border-neutral-400/50 clip-path-polygon"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
           </div>
           <div className="mt-2 flex flex-col items-center">
              <span className="font-serif text-[10px] tracking-[0.3em] text-neutral-600 font-bold">BCC</span>
              <span className="text-[5px] text-neutral-400 tracking-widest uppercase">WETZLAR GERMANY</span>
           </div>
        </div>

        {/* -- RIGHT SIDE: Controls -- */}
        <div className="relative flex items-center gap-5 z-10 translate-x-2">
            
            {/* Shutter Speed Dial */}
            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] shadow-[0_3px_6px_rgba(0,0,0,0.4)] border-2 border-[#333] flex items-center justify-center relative">
               <div className="absolute inset-0 rounded-full border border-dashed border-[#555] opacity-50 m-1"></div>
               <div className="text-[8px] text-white font-mono font-bold text-center leading-none transform rotate-12">
                 A<br/><span className="text-red-500">4000</span>
               </div>
               <div className="absolute -left-1 w-1 h-2 bg-red-500"></div>
            </div>

            {/* Shutter Release Button - Red Soft Release with BCC */}
            <div className="relative">
               <div className="w-12 h-12 rounded-full bg-gradient-to-b from-gray-300 to-gray-400 shadow-md border border-gray-400 flex items-center justify-center">
                   <button
                     onClick={handleShutter}
                     className={`w-9 h-9 rounded-full bg-gradient-to-br from-[#e60000] to-[#990000] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_2px_3px_rgba(0,0,0,0.3)] border border-[#cc0000] active:scale-95 transition-transform flex items-center justify-center group ${shutterPressed ? 'scale-90' : ''}`}
                   >
                      <span className="text-[8px] font-bold text-white/90 font-sans tracking-tighter rotate-[-15deg] group-hover:opacity-100 transition-opacity opacity-80">bcc</span>
                   </button>
               </div>
            </div>

            {/* Advance Lever (Switch Camera Trigger) */}
            <div className="relative w-4 h-12">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-10 h-10 rounded-full bg-gray-300 shadow-sm z-0"></div>
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2 -left-2 w-20 h-6 bg-[#111] rounded-r-full shadow-lg border border-gray-600 origin-left z-10 flex items-center justify-end pr-2 cursor-pointer hover:bg-[#222]"
                  animate={isWinding ? { rotate: 35 } : { rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  onClick={handleAdvanceLever}
                >
                    <div className="w-8 h-3 bg-[#222] rounded-full mr-1 border border-gray-700"></div>
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RetroCamera;
