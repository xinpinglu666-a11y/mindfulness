import { useAppStore } from '@/store/useAppStore';
import { Wind, Footprints, Grape, StretchHorizontal, Sparkles } from 'lucide-react';
import PracticeCard from '@/components/PracticeCard';
import MoodChart from '@/components/MoodChart';
import CircularProgress from '@/components/CircularProgress';
import Layout from '@/components/Layout';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return '夜深了';
  if (h < 9) return '早上好';
  if (h < 12) return '上午好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
}

function formatDate(): string {
  const now = new Date();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${weekDays[now.getDay()]}`;
}

export default function HomePage() {
  const getTodayPracticeCount = useAppStore((s) => s.getTodayPracticeCount);
  const getTodayPracticeMinutes = useAppStore((s) => s.getTodayPracticeMinutes);
  const getMoodHistory = useAppStore((s) => s.getMoodHistory);
  const practiceRecords = useAppStore((s) => s.practiceRecords);

  const todayCount = getTodayPracticeCount();
  const todayMinutes = getTodayPracticeMinutes();
  const goal = 30; // 每天建议30分钟
  const moodData = getMoodHistory(7);

  // Count today's practice by type
  const todayRecords = practiceRecords.filter((r) => {
    const d = r.completedAt.slice(0, 10);
    return d === new Date().toISOString().slice(0, 10);
  });
  const typeCounts: Record<string, number> = {};
  todayRecords.forEach((r) => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  });

  const practices = [
    { title: '正念呼吸', description: '跟随呼吸节奏，安住当下', icon: Wind, to: '/breathing', color: '#7B9EA8', count: typeCounts.breathing },
    { title: '正念行走', description: '一步一步，感受大地的支撑', icon: Footprints, to: '/walking', color: '#C8A882', count: typeCounts.walking },
    { title: '正念进食', description: '用五感细细品味一颗葡萄干', icon: Grape, to: '/eating', color: '#8B7E74', count: typeCounts.eating },
    { title: '正念伸展', description: '轻柔地唤醒身体的每一处', icon: StretchHorizontal, to: '/stretching', color: '#4A7C59', count: typeCounts.stretching },
    { title: '心情打卡', description: '记录此刻的心情状态', icon: Sparkles, to: '/mood', color: '#D4A574' },
  ];

  return (
    <Layout showBack={false}>
      {/* Greeting */}
      <div className="pt-8 pb-4">
        <p className="text-sm text-earth/40">{formatDate()}</p>
        <h1 className="font-serif text-3xl text-earth/85 mt-1">
          {getGreeting()}
          <span className="inline-block ml-2">🧘</span>
        </h1>
        <p className="text-earth/45 text-sm mt-1">每一天，都是正念的新开始</p>
      </div>

      {/* Today's Progress */}
      <div className="card p-6 mb-6 flex items-center gap-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <CircularProgress progress={Math.min(todayMinutes / goal, 1)} size={100} strokeWidth={5}>
          <div className="text-center">
            <span className="text-2xl font-serif font-semibold text-forest">{todayMinutes}</span>
            <span className="text-xs text-earth/40 block -mt-0.5">/ {goal} 分钟</span>
          </div>
        </CircularProgress>
        <div>
          <h3 className="font-serif text-base text-earth/75">今日练习</h3>
          <p className="text-earth/45 text-sm mt-1">
            已完成 <span className="font-medium text-earth/70">{todayCount}</span> 次练习
          </p>
          <p className="text-earth/35 text-xs mt-0.5">每日建议练习 30 分钟</p>
        </div>
      </div>

      {/* Practice Cards */}
      <div className="space-y-3 mb-6">
        {practices.map((p, i) => (
          <PracticeCard
            key={p.to}
            title={p.title}
            description={p.description}
            icon={p.icon}
            to={p.to}
            color={p.color}
            count={p.count}
            delay={200 + i * 80}
          />
        ))}
      </div>

      {/* Mood Chart */}
      <div className="card p-5 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
        <h3 className="font-serif text-base text-earth/75 mb-3">近7天心情趋势</h3>
        <MoodChart data={moodData} height={100} />
      </div>
    </Layout>
  );
}
