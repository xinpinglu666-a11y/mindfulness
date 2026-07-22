interface TimerDisplayProps {
  seconds: number;
  totalSeconds: number;
  size?: number;
}

export default function TimerDisplay({ seconds, totalSeconds, size = 200 }: TimerDisplayProps) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = totalSeconds > 0 ? 1 - seconds / totalSeconds : 0;

  const displayTime = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8D5B7"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={seconds > 0 ? '#4A7C59' : '#E8D5B7'}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-4xl font-semibold text-forest tabular-nums tracking-wider">
          {displayTime}
        </span>
      </div>
    </div>
  );
}
