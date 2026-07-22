interface MoodChartProps {
  data: { date: string; level: number | null }[];
  height?: number;
}

export default function MoodChart({ data, height = 120 }: MoodChartProps) {
  const validData = data.filter((d) => d.level !== null);
  if (validData.length === 0) {
    return (
      <div className="flex items-center justify-center text-earth/30 text-sm" style={{ height }}>
        暂无心情数据
      </div>
    );
  }

  const paddingX = 20;
  const paddingY = 16;
  const svgWidth = 400;
  const svgHeight = height;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  const points = validData.map((d, i) => ({
    x: paddingX + (i / Math.max(validData.length - 1, 1)) * chartW,
    y: paddingY + chartH - ((d.level! - 1) / 4) * chartH,
    label: d.date,
    level: d.level!,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Gradient fill path
  const fillPath = `M ${points[0].x} ${svgHeight - paddingY} L ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} L ${points[points.length - 1].x} ${svgHeight - paddingY} Z`;

  const moodColors: Record<number, string> = {
    1: '#D4A574',
    2: '#C8A882',
    3: '#9BB5A3',
    4: '#6B9F7A',
    5: '#4A7C59',
  };

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ height }}>
      {/* Grid lines */}
      {[1, 2, 3, 4, 5].map((level) => {
        const y = paddingY + chartH - ((level - 1) / 4) * chartH;
        return (
          <line
            key={level}
            x1={paddingX}
            y1={y}
            x2={svgWidth - paddingX}
            y2={y}
            stroke="#E8D5B7"
            strokeWidth="0.5"
            strokeDasharray="3 3"
          />
        );
      })}

      {/* Fill area */}
      <defs>
        <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A7C59" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4A7C59" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill="url(#moodGradient)" />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="#4A7C59"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-500"
      />

      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke={moodColors[p.level]} strokeWidth="2" />
          <text
            x={p.x}
            y={svgHeight - 4}
            textAnchor="middle"
            className="text-[9px] fill-earth/40"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
