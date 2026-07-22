import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Check, Home, Trees } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Layout from '@/components/Layout';
import TimerDisplay from '@/components/TimerDisplay';

type Mode = 'indoor' | 'outdoor';

interface StepGuide {
  text: string;
  icon: typeof Home;
  duration: number;
}

const INDOOR_GUIDE: StepGuide[] = [
  { text: '站立，双脚与肩同宽\n感受双脚与大地的接触', icon: Home, duration: 0 },
  { text: '开始缓慢行走\n注意力放在脚底', icon: Home, duration: 60 },
  { text: '感受每一步\n脚抬起、移动、落下的过程', icon: Home, duration: 60 },
  { text: '觉察呼吸与步伐的配合\n让节奏自然流动', icon: Home, duration: 60 },
];

const OUTDOOR_GUIDE: StepGuide[] = [
  { text: '找一个安静的地方\n开始慢步行走', icon: Trees, duration: 0 },
  { text: '感受脚下地面的质感\n是草地、石板还是沙土', icon: Trees, duration: 120 },
  { text: '留意周围的自然声音\n风声、鸟鸣、树叶沙沙', icon: Trees, duration: 120 },
  { text: '让呼吸与步伐自然同步\n享受与自然的连接', icon: Trees, duration: 60 },
];

export default function WalkingPage() {
  const addPracticeRecord = useAppStore((s) => s.addPracticeRecord);
  const [mode, setMode] = useState<Mode>('indoor');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const totalDuration = mode === 'indoor' ? 180 : 300;

  const start = () => {
    setTimeLeft(totalDuration);
    setIsActive(true);
    setIsCompleted(false);
    startTimeRef.current = Date.now();
  };

  const pause = () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    setIsActive(false);
    setIsCompleted(false);
    setTimeLeft(totalDuration);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            addPracticeRecord({
              type: 'walking',
              duration: elapsed,
              completedAt: new Date().toISOString(),
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, addPracticeRecord]);

  const guideList = mode === 'indoor' ? INDOOR_GUIDE : OUTDOOR_GUIDE;

  const elapsed = totalDuration - timeLeft;
  let currentGuideIdx = 0;
  let accumulated = 0;
  for (let i = 0; i < guideList.length; i++) {
    accumulated += guideList[i].duration;
    if (elapsed >= accumulated && i < guideList.length - 1) {
      currentGuideIdx = i + 1;
    }
  }

  const currentGuide = guideList[Math.min(currentGuideIdx, guideList.length - 1)];
  const IconComp = currentGuide.icon;

  return (
    <Layout title="正念行走">
      <div className="flex flex-col items-center pt-4 pb-8">
        {/* Mode toggle */}
        <div className="flex bg-white/70 rounded-full p-1 mb-10 shadow-sm opacity-0 animate-fade-in-up"
          style={{ animationFillMode: 'forwards' }}>
          <button
            onClick={() => { setMode('indoor'); reset(); }}
            disabled={isActive}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              mode === 'indoor' ? 'bg-forest text-white shadow-md' : 'text-earth/50'
            } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Home size={16} /> 室内慢走
          </button>
          <button
            onClick={() => { setMode('outdoor'); reset(); }}
            disabled={isActive}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              mode === 'outdoor' ? 'bg-forest text-white shadow-md' : 'text-earth/50'
            } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Trees size={16} /> 户外行走
          </button>
        </div>

        {/* Timer */}
        <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          {isCompleted ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-20 h-20 rounded-full bg-forest/15 flex items-center justify-center">
                <Check size={36} className="text-forest" />
              </div>
              <p className="font-serif text-xl text-forest">行走完成</p>
              <p className="text-sm text-earth/50">你完成了 {totalDuration / 60} 分钟的正念行走</p>
            </div>
          ) : (
            <TimerDisplay seconds={timeLeft} totalSeconds={totalDuration} size={180} />
          )}
        </div>

        {/* Guide */}
        <div className={`card p-6 mb-6 w-full max-w-xs text-center transition-all duration-500 ${
          isActive ? 'border-forest/30 shadow-md shadow-forest/10' : ''
        } opacity-0 animate-fade-in-up`} style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors duration-500 ${
            isActive ? 'bg-forest/10' : 'bg-warm/20'
          }`}>
            <IconComp size={22} className={isActive ? 'text-forest' : 'text-earth/40'} />
          </div>
          <div className={`whitespace-pre-line text-sm leading-relaxed ${
            isActive ? 'text-earth/75 font-medium pulse-soft' : 'text-earth/35'
          }`}>
            {isActive ? currentGuide.text : '选择模式后点击开始，\n跟随引导进行正念行走'}
          </div>
          {isActive && (
            <div className="mt-4 h-1 bg-warm/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-forest rounded-full transition-all duration-500"
                style={{ width: `${((totalDuration - timeLeft) / totalDuration) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          {!isCompleted ? (
            <>
              <button
                onClick={isActive ? pause : start}
                className="w-16 h-16 rounded-full bg-forest text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                {isActive ? <Pause size={26} /> : <Play size={26} className="ml-1" />}
              </button>
              <button
                onClick={reset}
                disabled={!isActive && timeLeft === totalDuration}
                className="w-12 h-12 rounded-full bg-white/80 text-earth/50 flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
              >
                <RotateCcw size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={reset}
              className="px-8 py-3 rounded-full bg-forest text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              再来一次
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
