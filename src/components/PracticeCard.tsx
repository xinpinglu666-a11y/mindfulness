import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface PracticeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: string;
  count?: number;
  delay?: number;
}

export default function PracticeCard({ title, description, icon: Icon, to, color, count, delay = 0 }: PracticeCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="card w-full text-left p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] group opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={22} style={{ color }} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-base text-earth/85">{title}</h3>
          {count !== undefined && count > 0 && (
            <span className="text-xs text-forest/60 bg-forest/8 px-2 py-0.5 rounded-full">
              今日 {count} 次
            </span>
          )}
        </div>
        <p className="text-sm text-earth/45 mt-0.5">{description}</p>
      </div>
      <div
        className="w-1 h-10 rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: color }}
      />
    </button>
  );
}
