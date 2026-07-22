import { useState, useEffect, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Play, Pause, RotateCcw, Check, Eye, Hand, Wind, Apple, Heart } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Layout from '@/components/Layout';
import StepProgress from '@/components/StepProgress';

interface EatingStep {
  title: string;
  description: string;
  icon: LucideIcon;
  duration: number;
  emoji: string;
}

const STEPS: EatingStep[] = [
  {
    title: '观察',
    description: '将葡萄干放在手心，仔细地观察它的形状、颜色、纹理和光泽。就像第一次见到葡萄干一样，带着好奇心去探索它的每一处细节。',
    icon: Eye,
    duration: 60,
    emoji: '👁️',
  },
  {
    title: '触摸',
    description: '用手指轻轻触摸葡萄干，感受它的质地——是光滑还是粗糙，是柔软还是坚硬。闭上眼睛，只用触觉去认识它。',
    icon: Hand,
    duration: 45,
    emoji: '🖐️',
  },
  {
    title: '闻',
    description: '将葡萄干放在鼻尖，深深地吸一口气。感受它的香气，注意是否有甜味、果味或者其他细微的气息。',
    icon: Wind,
    duration: 30,
    emoji: '👃',
  },
  {
    title: '品尝',
    description: '将葡萄干轻轻放入口中，先不要咀嚼，让它在舌尖停留片刻。然后慢慢地开始咀嚼，注意味道如何在口中扩散，感受甜味的变化。',
    icon: Apple,
    duration: 90,
    emoji: '🍇',
  },
  {
    title: '回味',
    description: '吞下后，闭上眼睛感受口中的余味。觉察身体的感觉，以及此刻内心的感受。你可以再取一颗，用全新的心态重新开始。',
    icon: Heart,
    duration: 30,
    emoji: '💜',
  },
];

export default function EatingPage() {
  const addPracticeRecord = useAppStore((s) => s.addPracticeRecord);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [stepTimeLeft, setStepTimeLeft] = useState(STEPS[0].duration);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      setCurrentStep(0);
      setStepTimeLeft(STEPS[0].duration);
      startTimeRef.current = Date.now();
    }
    setIsActive(true);
    setIsCompleted(false);
  };

  const pause = () => {
    setIsActive(false);
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(false);
    setCurrentStep(0);
    setStepTimeLeft(STEPS[0].duration);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setStepTimeLeft((prev) => {
          if (prev <= 1) {
            setCurrentStep((s) => {
              if (s >= STEPS.length - 1) {
                setIsActive(false);
                setIsCompleted(true);
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                addPracticeRecord({
                  type: 'eating',
                  duration: elapsed,
                  completedAt: new Date().toISOString(),
                });
                return s;
              }
              const next = s + 1;
              setStepTimeLeft(STEPS[next].duration);
              return next;
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

  const step = STEPS[currentStep];
  const IconComp = step.icon;

  const totalDuration = STEPS.reduce((sum, s) => sum + s.duration, 0);

  return (
    <Layout title="正念进食">
      <div className="flex flex-col items-center pt-4 pb-8">
        {/* Step progress */}
        <div className="w-full mb-8 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          <StepProgress
            steps={STEPS.map((s) => s.title)}
            currentStep={currentStep}
          />
        </div>

        {/* Step card */}
        <div className="card p-6 mb-6 w-full max-w-sm text-center transition-all duration-500 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          {isCompleted ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-20 h-20 rounded-full bg-forest/15 flex items-center justify-center">
                <Check size={36} className="text-forest" />
              </div>
              <p className="font-serif text-xl text-forest">正念进食完成</p>
              <p className="text-sm text-earth/50">你用正念的方式品尝了葡萄干</p>
            </div>
          ) : (
            <>
              <div className="text-5xl mb-4">{step.emoji}</div>
              <div className="w-12 h-12 mx-auto rounded-xl bg-forest/10 flex items-center justify-center mb-3">
                <IconComp size={22} className="text-forest" />
              </div>
              <h3 className="font-serif text-lg text-earth/80 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-earth/50 leading-relaxed mb-4">
                {step.description}
              </p>
              {isActive && (
                <div className="space-y-2">
                  <div className="h-1.5 bg-warm/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-forest rounded-full transition-all duration-500"
                      style={{ width: `${((step.duration - stepTimeLeft) / step.duration) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-earth/40">
                    本步剩余 {stepTimeLeft}秒 · 点击下方按钮可随时进入下一步
                  </p>
                </div>
              )}
              {!isActive && !isPaused && (
                <p className="text-xs text-earth/35 mt-2">
                  请准备一颗葡萄干，点击开始进入引导
                </p>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          {!isCompleted ? (
            <>
              <button
                onClick={isActive ? pause : start}
                className="w-16 h-16 rounded-full bg-forest text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                {isActive ? <Pause size={26} /> : <Play size={26} className="ml-1" />}
              </button>
              {isActive && (
                <button
                  onClick={() => {
                    setStepTimeLeft(1);
                  }}
                  className="px-5 py-2.5 rounded-full bg-white/80 text-forest text-sm font-medium shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
                >
                  下一步
                </button>
              )}
              <button
                onClick={reset}
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

        {/* Total time */}
        {!isCompleted && !isActive && (
          <p className="mt-6 text-xs text-earth/30 opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
            预计总时长约 {Math.round(totalDuration / 60)} 分钟
          </p>
        )}
      </div>
    </Layout>
  );
}
