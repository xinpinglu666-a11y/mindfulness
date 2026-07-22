import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PracticeRecord {
  id: string;
  type: 'breathing' | 'walking' | 'eating' | 'stretching';
  duration: number;
  completedAt: string;
}

export interface MoodRecord {
  id: string;
  date: string;
  level: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  note: string;
  createdAt: string;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function toLocalDate(iso: string): string {
  return iso.slice(0, 10);
}

interface AppStore {
  practiceRecords: PracticeRecord[];
  addPracticeRecord: (record: Omit<PracticeRecord, 'id'>) => void;
  getTodayPracticeCount: () => number;
  getTodayPracticeMinutes: () => number;

  moodRecords: MoodRecord[];
  addMoodRecord: (record: Omit<MoodRecord, 'id'>) => void;
  getTodayMood: () => MoodRecord | undefined;
  getMoodHistory: (days: number) => { date: string; level: number | null }[];
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      practiceRecords: [],
      addPracticeRecord: (record) => {
        const newRecord: PracticeRecord = {
          ...record,
          id: generateId(),
        };
        set((s) => ({
          practiceRecords: [newRecord, ...s.practiceRecords].slice(0, 500),
        }));
      },

      getTodayPracticeCount: () => {
        const today = getTodayStr();
        return get().practiceRecords.filter((r) => toLocalDate(r.completedAt) === today).length;
      },

      getTodayPracticeMinutes: () => {
        const today = getTodayStr();
        return Math.floor(
          get()
            .practiceRecords.filter((r) => toLocalDate(r.completedAt) === today)
            .reduce((sum, r) => sum + r.duration, 0) / 60
        );
      },

      moodRecords: [],
      addMoodRecord: (record) => {
        const newRecord: MoodRecord = {
          ...record,
          id: generateId(),
        };
        set((s) => {
          const filtered = s.moodRecords.filter((r) => r.date !== record.date);
          return { moodRecords: [newRecord, ...filtered].slice(0, 500) };
        });
      },

      getTodayMood: () => {
        const today = getTodayStr();
        return get().moodRecords.find((r) => r.date === today);
      },

      getMoodHistory: (days) => {
        const records = get().moodRecords;
        const result: { date: string; level: number | null }[] = [];
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().slice(0, 10);
          const record = records.find((r) => r.date === dateStr);
          result.push({
            date: dateStr.slice(5),
            level: record ? record.level : null,
          });
        }
        return result;
      },
    }),
    {
      name: 'mindfulness-storage',
    }
  )
);
