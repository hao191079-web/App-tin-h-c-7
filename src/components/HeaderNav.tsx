import React, { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Menu,
  X,
  Check,
} from 'lucide-react';
import { AppProgress, AppSection } from '../types';

interface HeaderNavProps {
  currentSection: AppSection;
  canGoBack: boolean;
  onBack: () => void;
  onNavigate: (section: AppSection) => void;
  progress: AppProgress;
  soundEnabled: boolean;
  onToggleSound: () => void;
  zoomEnabled: boolean;
  onToggleZoom: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentSection,
  canGoBack,
  onBack,
  onNavigate,
  progress,
  soundEnabled,
  onToggleSound,
  zoomEnabled,
  onToggleZoom,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { key: AppSection; label: string; completed?: boolean }[] = [
    { key: 'home', label: 'Trang chủ' },
    { key: 'lesson1', label: 'Bài 1', completed: progress.lesson1.completed },
    { key: 'lesson2', label: 'Bài 2', completed: progress.lesson2.completed },
    { key: 'lesson3', label: 'Bài 3', completed: progress.lesson3.completed },
    { key: 'arena', label: 'Đấu trường', completed: progress.arena.completed },
  ];

  const handleNav = (key: AppSection) => {
    setMobileMenuOpen(false);
    onNavigate(key);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 no-print">
      {/* Zone 1 - Zone 2 - Zone 3 Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (1 line) */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="text-lg font-bold tracking-tight text-sky-700 hover:text-sky-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600 rounded"
        >
          SMART ICT 7
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive =
              currentSection === item.key ||
              (currentSection === 'lessons' && item.key === 'home');
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNav(item.key)}
                className={`relative py-1.5 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-sky-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {item.completed && (
                  <Check
                    className="w-3.5 h-3.5 text-emerald-600"
                    aria-label="Đã hoàn thành"
                  />
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('profile')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentSection === 'profile'
                ? 'bg-indigo-600 text-white'
                : 'bg-sky-600 text-white hover:bg-sky-700'
            }`}
          >
            Hồ sơ khám phá
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Classroom utility toolbar (kept compact below top bar) */}
      <div className="bg-slate-50/90 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between gap-3 text-xs text-slate-600 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            {canGoBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </button>
            {progress.student.fullName && (
              <button
                type="button"
                onClick={() => handleNav('lessons')}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-sky-700 font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Chọn bài học</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                soundEnabled
                  ? 'bg-sky-50 border-sky-200 text-sky-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleZoom}
              title={zoomEnabled ? 'Thu nhỏ chữ về mặc định' : 'Phóng to nội dung (máy chiếu)'}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                zoomEnabled
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {zoomEnabled ? (
                <ZoomOut className="w-3.5 h-3.5" />
              ) : (
                <ZoomIn className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {zoomEnabled ? 'Thu gọn chữ' : 'Phóng to'}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Thoát toàn màn hình' : 'Trình chiếu toàn màn hình'}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isFullscreen
                  ? 'bg-sky-50 border-sky-200 text-sky-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentSection === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNav(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {item.completed !== undefined && (
                  <span
                    className={`text-xs ${
                      item.completed ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {item.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
                  </span>
                )}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handleNav('lessons')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-sky-700 hover:bg-sky-50 cursor-pointer"
          >
            <span>Bảng chọn bài học</span>
          </button>
        </div>
      )}
    </header>
  );
};
