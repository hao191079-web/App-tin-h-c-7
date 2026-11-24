import React, { useEffect, useState } from 'react';
import { Lightbulb, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export type RoboMood = 'welcome' | 'guide' | 'success' | 'encourage' | 'hint';

interface RoboAssistantProps {
  message: string;
  mood?: RoboMood;
  hintText?: string;
  compact?: boolean;
  className?: string;
}

const ROBO_IMAGE_PATH = '/src/assets/images/robo_mascot_1795423673346.jpg';

export const RoboAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; mood?: RoboMood }> = ({
  size = 'md',
  mood = 'welcome',
}) => {
  const [imgError, setImgError] = useState(false);

  const dims =
    size === 'sm'
      ? 'w-14 h-14'
      : size === 'lg'
        ? 'w-32 h-32 sm:w-40 sm:h-40'
        : 'w-20 h-20 sm:w-24 sm:h-24';

  const screenColor =
    mood === 'success'
      ? '#10B981'
      : mood === 'encourage'
        ? '#F59E0B'
        : '#06B6D4';

  if (imgError) {
    // Crisp SVG fallback maintaining exact white & blue Robo design with chest screen
    return (
      <div
        className={`${dims} rounded-2xl bg-gradient-to-b from-sky-50 to-blue-100 border border-sky-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm`}
        aria-label="Nhân vật Robo"
      >
        <svg viewBox="0 0 120 120" className="w-full h-full p-1.5">
          {/* Antennas */}
          <line x1="34" y1="22" x2="26" y2="10" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          <circle cx="26" cy="9" r="4" fill="#38BDF8" />
          <line x1="86" y1="22" x2="94" y2="10" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          <circle cx="94" cy="9" r="4" fill="#38BDF8" />
          {/* Head */}
          <rect x="24" y="18" width="72" height="46" rx="20" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
          {/* Visor */}
          <rect x="33" y="27" width="54" height="26" rx="12" fill="#0F172A" />
          {/* Big glowing eyes */}
          <ellipse cx="47" cy="39" rx="7" ry="6.5" fill="#22D3EE" />
          <ellipse cx="73" cy="39" rx="7" ry="6.5" fill="#22D3EE" />
          <path d="M52 57 Q60 62 68 57" stroke="#0284C7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Body */}
          <rect x="34" y="68" width="52" height="40" rx="14" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
          <path d="M36 74 Q60 80 84 74 L84 86 Q60 92 36 86 Z" fill="#38BDF8" opacity="0.85" />
          {/* Chest mini screen */}
          <rect x="46" y="75" width="28" height="18" rx="4" fill="#0F172A" stroke="#BAE6FD" strokeWidth="1.5" />
          <circle cx="60" cy="84" r="4" fill={screenColor} />
          {/* Arms */}
          <rect x="16" y="70" width="14" height="24" rx="7" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
          <rect x="90" y="70" width="14" height="24" rx="7" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`${dims} rounded-2xl bg-white border border-sky-200/80 overflow-hidden shrink-0 shadow-sm relative`}
    >
      <img
        src={ROBO_IMAGE_PATH}
        alt="Robot Robo – người bạn đồng hành Tin học 7"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export const RoboAssistant: React.FC<RoboAssistantProps> = ({
  message,
  mood = 'guide',
  hintText,
  compact = false,
  className = '',
}) => {
  const [displayed, setDisplayed] = useState(message);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setShowHint(false);
    // Respect reduced motion & keep immediate legibility (fast typewriter)
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || message.length < 15) {
      setDisplayed(message);
      return;
    }

    let index = 0;
    setDisplayed('');
    const step = Math.max(2, Math.ceil(message.length / 26));
    const timer = window.setInterval(() => {
      index += step;
      if (index >= message.length) {
        setDisplayed(message);
        window.clearInterval(timer);
      } else {
        setDisplayed(message.slice(0, index));
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [message]);

  const borderStyle =
    mood === 'success'
      ? 'border-emerald-200 bg-emerald-50/70'
      : mood === 'encourage'
        ? 'border-amber-200 bg-amber-50/70'
        : 'border-sky-200 bg-white';

  const MoodIcon =
    mood === 'success'
      ? CheckCircle2
      : mood === 'encourage'
        ? AlertCircle
        : Sparkles;

  const iconColor =
    mood === 'success'
      ? 'text-emerald-600'
      : mood === 'encourage'
        ? 'text-amber-600'
        : 'text-sky-600';

  return (
    <div
      className={`rounded-2xl border ${borderStyle} ${compact ? 'p-3.5 sm:p-4' : 'p-4 sm:p-5'} shadow-sm transition-colors ${className}`}
    >
      <div className="flex items-start gap-3.5 sm:gap-4">
        <RoboAvatar size={compact ? 'sm' : 'md'} mood={mood} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-700">
              <MoodIcon className={`w-4 h-4 shrink-0 ${iconColor}`} />
              <span>Robo · Bạn đồng hành ICT 7</span>
            </div>
            {hintText && (
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Ẩn gợi ý' : 'Gợi ý của Robo'}</span>
              </button>
            )}
          </div>
          <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
            {displayed || message}
          </p>
          {showHint && hintText && (
            <div className="mt-2.5 pt-2.5 border-t border-sky-100 text-xs sm:text-sm text-indigo-900 bg-indigo-50/60 rounded-lg p-2.5">
              <span className="font-semibold">Gợi ý: </span>
              {hintText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
