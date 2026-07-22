import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Check, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Layout from '@/components/Layout';

interface StretchPose {
  name: string;
  description: string;
  breathingTip: string;
  duration: number;
  emoji: string;
}

const POSES: StretchPose[] = [
  {
    name: '颈部放松',
    description: '缓慢地将头向左侧倾斜，感受右侧颈部的拉伸感。保持呼吸平稳，肩膀下沉放松。然后换右侧。',
    breathingTip: '吸气时保持，呼气时加深拉伸',
    duration: 45,
    emoji: '🧘',
  },
  {
    name: '肩部绕环',
    description: '双肩同时向前缓缓绕圈，幅度由小到大。然后反向绕环。感受肩胛骨的活动。',
    breathingTip: '吸气时抬肩，呼气时沉肩',
    duration: 45,
    emoji: '💪',
  },
  {
    name: '侧腰伸展',
    description: '右手向上伸展，身体向左侧弯曲。感受右侧腰部的拉伸。保持髋部稳定，不要前倾。',
    breathingTip: '吸气时延展，呼气时加深侧弯',
    duration: 40,
    emoji: '🌿',
  },
  {
    name: '全身舒展',
    description: '双手交叉举过头顶，掌心朝上。全身向上延展，从指尖到脚尖。感受全身的拉伸和唤醒。',
    breathingTip: '深深吸气延展，缓缓呼气放松',
    duration: 50,
    emoji: '✨',
  },
];

export default function StretchingPage() {
  const addPracticeRecord = useAppStore((s) => s.addPracticeRecord);
  const [currentPose, setCurrentPose] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [poseTimeLeft, setPoseTimeLeft] = useState(POSES[0].duration);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      setCurrentPose(0);
      setPoseTimeLeft(POSES[0].duration);
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
    setCurrentPose(0);
    setPoseTimeLeft(POSES[0].duration);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setPoseTimeLeft((prev) => {
          if (prev <= 1) {
            setCurrentPose((p) => {
              if (p >= POSES.length - 1) {
                setIsActive(false);
                setIsCompleted(true);
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                addPracticeRecord({
                  type: 'stretching',
                  duration: elapsed,
                  completedAt: new Date().toISOString(),
                });
                return p;
              }
              const next = p + 1;
              setPoseTimeLeft(POSES[next].duration);
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

  const pose = POSES[currentPose];
  const progress = pose.duration > 0 ? ((pose.duration - poseTimeLeft) / pose.duration) * 100 : 0;

  return (
    <Layout title="正念伸展">
      <div className="flex flex-col items-center pt-4 pb-8">
        {/* Pose indicator dots */}
        <div className="flex gap-2 mb-8 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          {POSES.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i < currentPose ? 'bg-forest/30' : i === currentPose ? 'bg-forest shadow-sm' : 'bg-warm/30'
              }`}
            />
          ))}
        </div>

        {/* Pose card */}
        <div className="card p-6 mb-6 w-full max-w-sm text-center transition-all duration-500 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          {isCompleted ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-20 h-20 rounded-full bg-forest/15 flex items-center justify-center">
                <Check size={36} className="text-forest" />
              </div>
              <p className="font-serif text-xl text-forest">伸展完成</p>
              <p className="text-sm text-earth/50">身体得到了温柔的唤醒</p>
            </div>
          ) : (
            <>
              <div className="text-5xl mb-4">{pose.emoji}</div>
              <h3 className="font-serif text-xl text-earth/80 mb-3">{pose.name}</h3>
              <p className="text-sm text-earth/50 leading-relaxed mb-4">
                {pose.description}
              </p>
              {isActive && (
                <div className="space-y-3">
                  <div className="h-2 bg-warm/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-forest rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-forest/60 italic">
                    💨 {pose.breathingTip}
                  </p>
                  <p className="text-xs text-earth/40">
                    保持 {poseTimeLeft}秒
                  </p>
                </div>
              )}
              {!isActive && !isPaused && (
                <div className="text-xs text-earth/35 mt-2 space-y-1">
                  <p>共 {POSES.length} 个动作，预计 {Math.round(POSES.reduce((s, p) => s + p.duration, 0) / 60)} 分钟</p>
                  <p>找一个安静的空间，点击开始跟随引导</p>
                </div>
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
                  onClick={() => setPoseTimeLeft(1)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/80 text-forest text-sm font-medium shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
                >
                  下一个 <ArrowRight size={16} />
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
      </div>
    </Layout>
  );
}
