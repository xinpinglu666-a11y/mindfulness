import { Smile, Frown, Meh, Heart, Star } from 'lucide-react';

interface EmotionPickerProps {
  value: number | null;
  onChange: (level: number) => void;
  size?: 'sm' | 'md';
}

const emotions = [
  { level: 1, label: '不好', icon: Frown, color: '#C8A882', desc: '不太开心' },
  { level: 2, label: '一般', icon: Meh, color: '#C8A882', desc: '还行吧' },
  { level: 3, label: '还好', icon: Smile, color: '#4A7C59', desc: '还可以' },
  { level: 4, label: '不错', icon: Heart, color: '#4A7C59', desc: '挺开心' },
  { level: 5, label: '很好', icon: Star, color: '#4A7C59', desc: '特别棒' },
];

export default function EmotionPicker({ value, onChange, size = 'md' }: EmotionPickerProps) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      {emotions.map((emo) => {
        const isSelected = value === emo.level;
        const IconComponent = emo.icon;
        const iconSize = size === 'sm' ? 28 : 36;
        const containerSize = size === 'sm' ? 'w-12 h-12' : 'w-16 h-16';

        return (
          <button
            key={emo.level}
            onClick={() => onChange(emo.level)}
            className={`${containerSize} rounded-full flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none ${
              isSelected
                ? 'bg-forest shadow-lg scale-110'
                : 'bg-white/80 shadow-sm hover:shadow-md'
            }`}
            aria-label={emo.label}
            title={emo.desc}
          >
            <IconComponent
              size={iconSize}
              strokeWidth={1.5}
              className={isSelected ? 'text-white' : 'text-earth/40'}
            />
            {size === 'md' && (
              <span className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-white/90' : 'text-earth/40'}`}>
                {emo.desc}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
