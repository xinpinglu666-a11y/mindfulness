import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Layout from '@/components/Layout';
import BreathingCircle from '@/components/BreathingCircle';
import TimerDisplay from '@/components/TimerDisplay';

type Phase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

const DURATIONS = [60, 180, 300, 600]; // 1, 3, 5, 10 分钟

export default function BreathingPage() {
  const addPracticeRecord = useAppStore((s) => s.addPracticeRecord);
  const [selectedDuration, setSelectedDuration] = useState(180);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    setTimeLeft(selectedDuration);
    setIsActive(true);
    setIsCompleted(false);
    startTimeRef.current = Date.now();
  }, [selectedDuration]);

  const pause = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setIsCompleted(false);
    setTimeLeft(selectedDuration);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [selectedDuration]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            addPracticeRecord({
              type: 'breathing',
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

  const handleDurationChange = (d: number) => {
    if (isActive) return;
    setSelectedDuration(d);
    setTimeLeft(d);
  };

  return (
    <Layout title="正念呼吸">
      <div className="flex flex-col items-center pt-4 pb-8">
        {/* Duration selector */}
        <div className="flex gap-2 mb-10 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => handleDurationChange(d)}
              disabled={isActive}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedDuration === d
                  ? 'bg-forest text-white shadow-md'
                  : 'bg-white/70 text-earth/50 hover:bg-white/90 active:scale-95'
              } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {d / 60} 分钟
            </button>
          ))}
        </div>

        {/* Breathing Circle or Timer */}
        <div className="mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          {isActive || (!isCompleted && timeLeft > 0) ? (
            isActive ? (
              <BreathingCircle isActive={isActive} />
            ) : (
              <TimerDisplay seconds={timeLeft} totalSeconds={selectedDuration} size={200} />
            )
          ) : isCompleted ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-20 h-20 rounded-full bg-forest/15 flex items-center justify-center">
                <Check size={36} className="text-forest" />
              </div>
              <p className="font-serif text-xl text-forest">练习完成</p>
              <p className="text-sm text-earth/50">恭喜你完成了 {selectedDuration / 60} 分钟的正念呼吸</p>
            </div>
          ) : null}
        </div>

        {/* Timer display combined */}
        {isActive && (
          <div className="mb-4 font-serif text-lg text-earth/50 tabular-nums opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        )}

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
                disabled={isActive && timeLeft === selectedDuration}
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

        {/* Guide text */}
        <div className="mt-10 text-center max-w-xs opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <p className="text-sm text-earth/40 leading-relaxed">
            找一个舒适的坐姿，轻轻闭上双眼，将注意力放在呼吸上。跟随圆圈的引导，自然地进行深呼吸。
          </p>
        </div>
      </div>
    </Layout>
  );
}
