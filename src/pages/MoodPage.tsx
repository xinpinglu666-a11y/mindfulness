import { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Layout from '@/components/Layout';
import EmotionPicker from '@/components/EmotionPicker';
import MoodChart from '@/components/MoodChart';

const MOOD_TAGS = ['平静', '开心', '感恩', '专注', '疲惫', '焦虑', '压力', '放松', '激动', '迷茫', '充实', '期待'];

export default function MoodPage() {
  const addMoodRecord = useAppStore((s) => s.addMoodRecord);
  const getTodayMood = useAppStore((s) => s.getTodayMood);
  const getMoodHistory = useAppStore((s) => s.getMoodHistory);

  const todayMood = getTodayMood();
  const moodHistory7 = getMoodHistory(7);
  const moodHistory30 = getMoodHistory(30);

  const [level, setLevel] = useState<number | null>(todayMood?.level ?? null);
  const [tags, setTags] = useState<string[]>(todayMood?.tags ?? []);
  const [note, setNote] = useState(todayMood?.note ?? '');
  const [saved, setSaved] = useState(!!todayMood);
  const [chartDays, setChartDays] = useState<7 | 30>(7);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (level === null) return;
    addMoodRecord({
      date: new Date().toISOString().slice(0, 10),
      level: level as 1 | 2 | 3 | 4 | 5,
      tags,
      note,
      createdAt: new Date().toISOString(),
    });
    setSaved(true);
  };

  const levelLabels: Record<number, string> = {
    1: '不太好',
    2: '一般',
    3: '还好',
    4: '不错',
    5: '很好',
  };

  return (
    <Layout title="心情打卡">
      <div className="flex flex-col items-center pt-4 pb-8">
        {/* Current state */}
        {saved && todayMood && (
          <div className="card p-5 w-full max-w-sm mb-6 text-center opacity-0 animate-fade-in-up"
            style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Check size={18} className="text-forest" />
              <span className="text-sm text-forest font-medium">今日已打卡</span>
            </div>
            <p className="text-2xl font-serif text-earth/80 mt-1">
              {levelLabels[todayMood.level]}
            </p>
            {todayMood.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {todayMood.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-forest/10 text-forest/70">
                    {t}
                  </span>
                ))}
              </div>
            )}
            {todayMood.note && (
              <p className="text-sm text-earth/45 mt-2 italic">{todayMood.note}</p>
            )}
          </div>
        )}

        {/* Emotion Picker */}
        <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <EmotionPicker value={level} onChange={(v) => { setLevel(v); setSaved(false); }} />
          {level !== null && (
            <p className="text-center text-sm text-earth/50 mt-2">
              当前心情：{levelLabels[level]}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="w-full max-w-sm mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <p className="text-xs text-earth/40 mb-2">选择标签（可选）</p>
          <div className="flex flex-wrap gap-2">
            {MOOD_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => { toggleTag(tag); setSaved(false); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 ${
                  tags.includes(tag)
                    ? 'bg-forest text-white shadow-sm'
                    : 'bg-white/70 text-earth/50 hover:bg-white/90'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="w-full max-w-sm mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <p className="text-xs text-earth/40 mb-2">心情日记（可选）</p>
          <textarea
            value={note}
            onChange={(e) => { setNote(e.target.value); setSaved(false); }}
            placeholder="记录今天的想法或感受..."
            maxLength={200}
            rows={3}
            className="w-full bg-white/70 rounded-xl p-3 text-sm text-earth/70 placeholder:text-earth/30 border border-warm/20 focus:outline-none focus:border-forest/30 resize-none transition-colors duration-200"
          />
          <p className="text-xs text-earth/30 text-right mt-1">{note.length}/200</p>
        </div>

        {/* Save Button */}
        {!saved && (
          <button
            onClick={handleSave}
            disabled={level === null}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium shadow-lg transition-all duration-200 active:scale-95 opacity-0 animate-fade-in-up ${
              level !== null
                ? 'bg-forest text-white hover:shadow-xl hover:scale-105'
                : 'bg-warm/30 text-earth/30 cursor-not-allowed'
            }`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <Save size={18} /> 保存心情
          </button>
        )}

        {/* Mood Chart */}
        <div className="card p-5 w-full max-w-sm mt-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-sm text-earth/75">心情趋势</h3>
            <div className="flex gap-1 bg-warm/20 rounded-full p-0.5">
              <button
                onClick={() => setChartDays(7)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  chartDays === 7 ? 'bg-white text-earth/70 shadow-sm' : 'text-earth/40'
                }`}
              >
                7天
              </button>
              <button
                onClick={() => setChartDays(30)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  chartDays === 30 ? 'bg-white text-earth/70 shadow-sm' : 'text-earth/40'
                }`}
              >
                30天
              </button>
            </div>
          </div>
          <MoodChart
            data={chartDays === 7 ? moodHistory7 : moodHistory30}
            height={120}
          />
        </div>
      </div>
    </Layout>
  );
}
