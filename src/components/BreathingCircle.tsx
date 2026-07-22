import { useEffect, useState, useRef, useCallback } from 'react';

type Phase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

interface BreathingCircleProps {
  isActive: boolean;
  onPhaseChange?: (phase: Phase) => void;
}

const PHASES: { phase: Phase; label: string; duration: number; className: string }[] = [
  { phase: 'inhale', label: '吸气', duration: 4, className: 'animate-breathe-in' },
  { phase: 'holdIn', label: '屏息', duration: 2, className: 'animate-breathe-hold-in' },
  { phase: 'exhale', label: '呼气', duration: 6, className: 'animate-breathe-out' },
  { phase: 'holdOut', label: '屏息', duration: 2, className: 'animate-breathe-hold-out' },
];

export default function BreathingCircle({ isActive, onPhaseChange }: BreathingCircleProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [key, setKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advancePhase = useCallback(() => {
    setPhaseIndex((prev) => {
      const next = (prev + 1) % PHASES.length;
      setTimeout(() => advancePhase(), PHASES[next].duration * 1000);
      return prev;
    });
  }, []);

  useEffect(() => {
    if (!isActive) {
      setPhaseIndex(0);
      setKey((k) => k + 1);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    setPhaseIndex(0);
    setKey((k) => k + 1);

    const run = () => {
      const timer = setTimeout(() => {
        setPhaseIndex((prev) => {
          const next = (prev + 1) % PHASES.length;
          if (onPhaseChange) onPhaseChange(PHASES[next].phase);
          setTimeout(run, PHASES[next].duration * 1000);
          return next;
        });
      }, PHASES[0].duration * 1000);
      timerRef.current = timer;
    };

    run();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, onPhaseChange]);

  const currentPhase = PHASES[phaseIndex];

  return (
    <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
      {/* Ripple effects */}
      {isActive && (
        <>
          <div
            className="absolute rounded-full bg-forest/10 animate-ripple"
            style={{ width: 200, height: 200, animationDelay: '0s' }}
          />
          <div
            className="absolute rounded-full bg-forest/8 animate-ripple"
            style={{ width: 200, height: 200, animationDelay: '0.6s' }}
          />
          <div
            className="absolute rounded-full bg-forest/5 animate-ripple"
            style={{ width: 200, height: 200, animationDelay: '1.2s' }}
          />
        </>
      )}

      {/* Main circle */}
      <div
        key={key}
        className={`absolute rounded-full bg-gradient-to-br from-forest-light to-forest flex items-center justify-center shadow-lg transition-none ${
          isActive ? currentPhase.className : ''
        }`}
        style={{
          width: 160,
          height: 160,
          transform: isActive ? undefined : 'scale(1)',
        }}
      >
        <div className="text-center text-white select-none">
          <p className="text-3xl font-serif font-semibold tracking-wider">
            {isActive ? currentPhase.label : '开始'}
          </p>
          {isActive && (
            <p className="text-sm opacity-80 mt-1">
              {currentPhase.duration}秒
            </p>
          )}
        </div>
      </div>

      {/* Outer ring */}
      <div
        className="absolute rounded-full border-2 border-forest/20"
        style={{ width: 220, height: 220 }}
      />
    </div>
  );
}
