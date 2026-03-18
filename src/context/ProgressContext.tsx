import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProgressState {
  xp: number;
  streak: number;
  completedLessons: string[];
  lastActiveDate: string | null;
}

interface ProgressContextType extends ProgressState {
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  hasCompleted: (lessonId: string) => boolean;
}

const defaultState: ProgressState = {
  xp: 0,
  streak: 0,
  completedLessons: [],
  lastActiveDate: null,
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => {
    const saved = localStorage.getItem('devmentor_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('devmentor_progress', JSON.stringify(progress));
  }, [progress]);

  // Update streak on load
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (progress.lastActiveDate !== today) {
      const lastActive = progress.lastActiveDate ? new Date(progress.lastActiveDate) : null;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = progress.streak;
      if (progress.lastActiveDate === yesterdayStr) {
        newStreak += 1;
      } else if (progress.lastActiveDate !== today) {
        newStreak = 1; // Reset streak if missed a day
      }

      setProgress(prev => ({
        ...prev,
        streak: newStreak,
        lastActiveDate: today
      }));
    }
  }, []);

  const addXp = (amount: number) => {
    setProgress(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const completeLesson = (lessonId: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        xp: prev.xp + 50 // 50 XP per lesson
      };
    });
  };

  const hasCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  return (
    <ProgressContext.Provider value={{ ...progress, addXp, completeLesson, hasCompleted }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
