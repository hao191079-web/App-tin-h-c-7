/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AppProgress, AppSection, ArenaResult } from './types';
import {
  loadProgress,
  loadSettings,
  saveProgress,
  saveSettings,
} from './utils/storage';
import { HeaderNav } from './components/HeaderNav';
import { HomeView } from './components/HomeView';
import { LessonSelectView } from './components/LessonSelectView';
import { Lesson1View } from './components/Lesson1View';
import { Lesson2View } from './components/Lesson2View';
import { Lesson3View } from './components/Lesson3View';
import { ArenaView } from './components/ArenaView';
import { ProfileView } from './components/ProfileView';
import { playTone } from './utils/sound';

export default function App() {
  const [initialLoad] = useState(() => loadProgress());
  const [progress, setProgress] = useState<AppProgress>(initialLoad.progress);
  const [storageWarning] = useState<boolean>(initialLoad.storageWarning);
  const [settings, setSettings] = useState(() => loadSettings());

  const [history, setHistory] = useState<AppSection[]>(['home']);
  const currentSection = history[history.length - 1];

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync zoom class on html element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.zoomEnabled) {
      root.classList.add('classroom-zoom');
    } else {
      root.classList.remove('classroom-zoom');
    }
    saveSettings(settings);
  }, [settings]);

  // Listen for browser fullscreen state changes
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Persist progress whenever it updates
  const updateProgress = (updater: (prev: AppProgress) => AppProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveProgress(next);
      return next;
    });
  };

  const navigateTo = (target: AppSection) => {
    setHistory((prev) => {
      if (prev[prev.length - 1] === target) return prev;
      return [...prev, target];
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExplore = (fullName: string, className: string) => {
    playTone('click', settings.soundEnabled);
    updateProgress((prev) => ({
      ...prev,
      student: {
        ...prev.student,
        fullName,
        className,
        startedAt: prev.student.startedAt || new Date().toISOString(),
      },
    }));
    navigateTo('lessons');
  };

  const handleContinue = () => {
    playTone('click', settings.soundEnabled);
    navigateTo('lessons');
  };

  const handleToggleSound = () => {
    setSettings((prev) => {
      const nextEnabled = !prev.soundEnabled;
      if (nextEnabled) {
        playTone('click', true);
      }
      return { ...prev, soundEnabled: nextEnabled };
    });
  };

  const handleToggleZoom = () => {
    setSettings((prev) => ({ ...prev, zoomEnabled: !prev.zoomEnabled }));
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleArenaComplete = (result: ArenaResult) => {
    updateProgress((prev) => ({
      ...prev,
      arena: result,
    }));
  };

  const handleRetakeArena = () => {
    updateProgress((prev) => ({
      ...prev,
      arena: {
        ...prev.arena,
        completed: false,
      },
    }));
    navigateTo('arena');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <HeaderNav
        currentSection={currentSection}
        canGoBack={history.length > 1}
        onBack={goBack}
        onNavigate={navigateTo}
        progress={progress}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        zoomEnabled={settings.zoomEnabled}
        onToggleZoom={handleToggleZoom}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      <main className="flex-1">
        {currentSection === 'home' && (
          <HomeView
            progress={progress}
            storageWarning={storageWarning}
            onStartExplore={handleStartExplore}
            onContinue={handleContinue}
            onQuickNavigate={navigateTo}
          />
        )}

        {currentSection === 'lessons' && (
          <LessonSelectView progress={progress} onNavigate={navigateTo} />
        )}

        {currentSection === 'lesson1' && (
          <Lesson1View
            progress={progress.lesson1}
            soundEnabled={settings.soundEnabled}
            onUpdate={(nextL1) =>
              updateProgress((prev) => ({ ...prev, lesson1: nextL1 }))
            }
            onGoNextLesson={() => navigateTo('lesson2')}
          />
        )}

        {currentSection === 'lesson2' && (
          <Lesson2View
            progress={progress.lesson2}
            soundEnabled={settings.soundEnabled}
            onUpdate={(nextL2) =>
              updateProgress((prev) => ({ ...prev, lesson2: nextL2 }))
            }
            onGoNextLesson={() => navigateTo('lesson3')}
          />
        )}

        {currentSection === 'lesson3' && (
          <Lesson3View
            progress={progress.lesson3}
            soundEnabled={settings.soundEnabled}
            onUpdate={(nextL3) =>
              updateProgress((prev) => ({ ...prev, lesson3: nextL3 }))
            }
            onGoArena={() => navigateTo('arena')}
          />
        )}

        {currentSection === 'arena' && (
          <ArenaView
            arenaProgress={progress.arena}
            soundEnabled={settings.soundEnabled}
            onComplete={handleArenaComplete}
            onGoProfile={() => navigateTo('profile')}
          />
        )}

        {currentSection === 'profile' && (
          <ProfileView
            progress={progress}
            onRetakeArena={handleRetakeArena}
            onGoHome={() => navigateTo('home')}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            SMART ICT 7 · Máy tính thông minh – Khám phá thế giới thiết bị
          </span>
          <span>Bám sát SGK Tin học 7 – Bộ Kết nối tri thức với cuộc sống</span>
        </div>
      </footer>
    </div>
  );
}
