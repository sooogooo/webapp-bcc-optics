
import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { CameraMode } from '../types.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ScanLine } from 'lucide-react';

interface TLRViewfinderProps {
  cameraMode: CameraMode;
}

export interface TLRViewfinderHandle {
  capture: () => string | null;
}

const TLRViewfinder = forwardRef<TLRViewfinderHandle, TLRViewfinderProps>(({ cameraMode }, ref) => {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFocusing, setIsFocusing] = useState(false);

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (webcamRef.current) {
        return webcamRef.current.getScreenshot();
      }
      return null;
    }
  }));

  const videoConstraints = {
    facingMode: cameraMode,
    aspectRatio: 1,
    width: { ideal: 1080 },
    height: { ideal: 1080 }
  };

  // Simulate light interaction
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
        setMousePos({ 
            x: (e.clientX / window.innerWidth) * 100, 
            y: (e.clientY / window.innerHeight) * 100 
        });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleFocus = () => {
    if (isFocusing) return;
    setIsFocusing(true);
    // Simulate focus hunt: Blur -> Sharp
    setTimeout(() => setIsFocusing(false), 800);
  };

  return (
    <div 
      className="relative w-28 h-28 sm:w-32 sm:h-32 bg-[#1a1a1a] rounded-[22px] border-[3px] border-[#333] shadow-[0_8px_20px_rgba(0,0,0,0.6)] overflow-hidden group ring-1 ring-white/10 cursor-pointer"
      onClick={handleFocus}
    >
      {/* Lens Housing Bevel */}
      <div className="absolute inset-0 rounded-[18px] border border-white/5 pointer-events-none z-30 shadow-[inset_0_0_15px_rgba(0,0,0,0.9)]"></div>
      
      {/* Main View */}
      <div className="w-full h-full relative flex items-center justify-center bg-black overflow-hidden rounded-[19px]">
         {!error ? (
           <div className={`w-full h-full transition-all duration-300 ${isFocusing ? 'blur-[2px] scale-105' : 'blur-0 scale-100'}`}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMediaError={() => setError(true)}
                className="w-full h-full object-cover" 
                mirrored={cameraMode === CameraMode.User}
              />
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center text-neutral-500">
             <span className="text-[8px] tracking-widest">LENS CLOSED</span>
           </div>
         )}
         
         {/* Ground Glass Texture (Matte Screen) */}
         <div className="absolute inset-0 pointer-events-none opacity-15 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')] z-10 mix-blend-overlay"></div>

         {/* Focus Reticle Overlay */}
         <AnimatePresence>
            {isFocusing && (
                <motion.div 
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
                >
                    <div className="w-16 h-16 border border-white/80 rounded-sm flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                        <div className="w-1 h-3 bg-white/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="w-3 h-1 bg-white/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <span className="absolute mt-20 text-[9px] font-mono text-white/90 tracking-widest bg-black/50 px-1 rounded">AF-S</span>
                </motion.div>
            )}
         </AnimatePresence>

         {/* Dynamic Lens Flare Simulation */}
         <div 
            className="absolute inset-0 pointer-events-none z-20 opacity-30 mix-blend-screen"
            style={{
                background: `
                    radial-gradient(circle at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(255,220,180,0.2) 0%, transparent 40%),
                    radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(120,180,255,0.15) 0%, transparent 50%)
                `
            }}
         ></div>

         {/* Static Grid Lines (Rule of Thirds) */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.15] z-10">
            <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white shadow-[0_1px_1px_black]"></div>
            <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-white shadow-[0_1px_1px_black]"></div>
            <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-white shadow-[0_1px_1px_black]"></div>
            <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-white shadow-[0_1px_1px_black]"></div>
         </div>
      </div>
    </div>
  );
});

export default TLRViewfinder;
