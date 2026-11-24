import React from 'react';

interface DeviceIllustrationProps {
  deviceId: string;
  className?: string;
}

export const DeviceIllustration: React.FC<DeviceIllustrationProps> = ({
  deviceId,
  className = 'w-16 h-16',
}) => {
  switch (deviceId) {
    case 'keyboard':
      return (
        <svg viewBox="0 0 96 96" className={className} fill="none" aria-hidden="true">
          <rect x="8" y="28" width="80" height="42" rx="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="14" y="34" width="68" height="30" rx="4" fill="#FFFFFF" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={`r1-${i}`} x={17 + i * 9} y="37" width="7" height="6" rx="1.5" fill="#0EA5E9" opacity="0.85" />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={`r2-${i}`} x={20 + i * 9.5} y="46" width="7.5" height="6" rx="1.5" fill="#38BDF8" />
          ))}
          <rect x="28" y="55" width="40" height="6" rx="2" fill="#0284C7" />
        </svg>
      );

    case 'mouse':
      return (
        <svg viewBox="0 0 96 96" className={className} fill="none" aria-hidden="true">
          <path d="M48 10 C48 16, 48 20, 48 24" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="28" y="24" width="40" height="58" rx="20" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M28 46 H68" stroke="#BAE6FD" strokeWidth="2" />
          <path d="M48 24 V46" stroke="#BAE6FD" strokeWidth="2" />
          <rect x="45" y="30" width="6" height="12" rx="3" fill="#0EA5E9" />
          <path d="M34 58 C36 68, 42 74, 48 74" stroke="#E0F2FE" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'monitor':
      return (
        <svg viewBox="0 0 96 96" className={className} fill="none" aria-hidden="true">
          <rect x="10" y="16" width="76" height="50" rx="6" fill="#0F172A" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="16" y="22" width="64" height="38" rx="3" fill="#E0F2FE" />
          <rect x="22" y="28" width="28" height="16" rx="2" fill="#38BDF8" />
          <rect x="54" y="28" width="20" height="8" rx="2" fill="#818CF8" />
          <rect x="54" y="40" width="20" height="14" rx="2" fill="#BAE6FD" />
          <rect x="42" y="66" width="12" height="10" fill="#94A3B8" />
          <rect x="30" y="76" width="36" height="5" rx="2.5" fill="#0284C7" />
        </svg>
      );

    case 'printer':
      return (
        <svg viewBox="0 0 96 96" className={className} fill="none" aria-hidden="true">
          <rect x="26" y="14" width="44" height="20" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
          <rect x="14" y="30" width="68" height="34" rx="7" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
          <circle cx="70" cy="40" r="3" fill="#10B981" />
          <rect x="24" y="52" width="48" height="26" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
          <line x1="32" y1="60" x2="64" y2="60" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="32" y1="67" x2="56" y2="67" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'speaker':
      return (
        <svg viewBox="0 0 96 96" className={className} fill="none" aria-hidden="true">
          <rect x="20" y="14" width="38" height="68" rx="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
          <circle cx="39" cy="32" r="8" fill="#0284C7" />
          <circle cx="39" cy="58" r="13" fill="#0F172A" stroke="#0284C7" strokeWidth="2" />
          <circle cx="39" cy="58" r="5" fill="#38BDF8" />
          <path d="M66 36 C72 42, 72 54, 66 60" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
          <path d="M74 28 C83 38, 83 58, 74 68" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'microphone':
      return (
        <svg viewBox="0 0 96 96" className={className} fill="none" aria-hidden="true">
          <rect x="36" y="14" width="24" height="40" rx="12" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
          <line x1="40" y1="26" x2="56" y2="26" stroke="#E0F2FE" strokeWidth="2" />
          <line x1="40" y1="34" x2="56" y2="34" stroke="#E0F2FE" strokeWidth="2" />
          <path d="M28 42 C28 56, 68 56, 68 42" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          <line x1="48" y1="54" x2="48" y2="76" stroke="#0284C7" strokeWidth="3" />
          <rect x="32" y="76" width="32" height="6" rx="3" fill="#0284C7" />
        </svg>
      );

    case 'webcam':
      return (
        <svg viewBox="0 0 96 96" className={className} fill="none" aria-hidden="true">
          <circle cx="48" cy="40" r="24" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <circle cx="48" cy="40" r="14" fill="#0F172A" />
          <circle cx="48" cy="40" r="7" fill="#0EA5E9" />
          <circle cx="45" cy="37" r="2.5" fill="#E0F2FE" />
          <circle cx="63" cy="28" r="2.5" fill="#10B981" />
          <path d="M36 64 L28 78 H68 L60 64" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );

    case 'scanner':
      return (
        <svg viewBox="0 0 96 96" className={className} fill="none" aria-hidden="true">
          <path d="M16 42 L74 22 L82 32 L24 52 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="14" y="48" width="68" height="24" rx="5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="22" y="54" width="52" height="5" rx="2" fill="#22D3EE" />
          <circle cx="70" cy="64" r="3" fill="#0284C7" />
        </svg>
      );

    case 'touchscreen':
      return (
        <svg viewBox="0 0 96 96" className={className} fill="none" aria-hidden="true">
          <rect x="16" y="16" width="64" height="56" rx="8" fill="#0F172A" stroke="#7C3AED" strokeWidth="2.5" />
          <rect x="22" y="22" width="52" height="44" rx="4" fill="#EDE9FE" />
          <circle cx="46" cy="44" r="12" stroke="#7C3AED" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="46" cy="44" r="6" fill="#06B6D4" opacity="0.5" />
          {/* Touch hand indicator */}
          <path d="M46 44 L46 76 M46 44 L58 58" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
          <circle cx="46" cy="44" r="4" fill="#0284C7" />
        </svg>
      );

    case 'headset':
      return (
        <svg viewBox="0 0 96 96" className={className} fill="none" aria-hidden="true">
          <path d="M22 50 C22 24, 74 24, 74 50" stroke="#0284C7" strokeWidth="4.5" strokeLinecap="round" />
          <rect x="14" y="44" width="14" height="26" rx="7" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="68" y="44" width="14" height="26" rx="7" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
          {/* Boom mic */}
          <path d="M21 68 C24 80, 38 82, 50 78" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <rect x="48" y="74" width="10" height="7" rx="3.5" fill="#7C3AED" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 96 96" className={className} fill="none" aria-hidden="true">
          <rect x="16" y="16" width="64" height="64" rx="12" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
        </svg>
      );
  }
};

export const SoftwareIllustration: React.FC<{ softwareId: string; className?: string }> = ({
  softwareId,
  className = 'w-14 h-14',
}) => {
  switch (softwareId) {
    case 'windows':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <rect x="6" y="6" width="52" height="52" rx="12" fill="#E0F2FE" />
          <path d="M16 20 L30 18 V30 H16 V20 Z" fill="#0284C7" />
          <path d="M33 17.5 L48 15 V30 H33 V17.5 Z" fill="#0EA5E9" />
          <path d="M16 33 H30 V45 L16 43 V33 Z" fill="#0EA5E9" />
          <path d="M33 33 H48 V48 L33 45.5 V33 Z" fill="#0284C7" />
        </svg>
      );
    case 'linux':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <rect x="6" y="6" width="52" height="52" rx="12" fill="#CCFBF1" />
          <ellipse cx="32" cy="36" rx="13" ry="15" fill="#0F172A" />
          <ellipse cx="32" cy="38" rx="8.5" ry="10.5" fill="#FFFFFF" />
          <circle cx="32" cy="21" r="9" fill="#0F172A" />
          <circle cx="29" cy="19" r="2" fill="#FFFFFF" />
          <circle cx="35" cy="19" r="2" fill="#FFFFFF" />
          <polygon points="29,23 35,23 32,27" fill="#F59E0B" />
          <ellipse cx="25" cy="49" rx="5" ry="2.5" fill="#F59E0B" />
          <ellipse cx="39" cy="49" rx="5" ry="2.5" fill="#F59E0B" />
        </svg>
      );
    case 'android':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <rect x="6" y="6" width="52" height="52" rx="12" fill="#DCFCE7" />
          <line x1="25" y1="16" x2="22" y2="11" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="39" y1="16" x2="42" y2="11" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M20 27 C20 19, 44 19, 44 27 Z" fill="#22C55E" />
          <circle cx="27" cy="23" r="1.8" fill="#FFFFFF" />
          <circle cx="37" cy="23" r="1.8" fill="#FFFFFF" />
          <rect x="20" y="29" width="24" height="18" rx="4" fill="#22C55E" />
          <rect x="14" y="29" width="4.5" height="14" rx="2.2" fill="#16A34A" />
          <rect x="45.5" y="29" width="4.5" height="14" rx="2.2" fill="#16A34A" />
        </svg>
      );
    case 'word':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <rect x="6" y="6" width="52" height="52" rx="12" fill="#DBEAFE" />
          <rect x="18" y="14" width="30" height="36" rx="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
          <line x1="28" y1="23" x2="42" y2="23" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="28" y1="31" x2="42" y2="31" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="28" y1="39" x2="40" y2="39" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="12" y="21" width="18" height="22" rx="4" fill="#2563EB" />
          <path d="M16 26 L18.5 38 L21 29 L23.5 38 L26 26" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'excel':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <rect x="6" y="6" width="52" height="52" rx="12" fill="#DCFCE7" />
          <rect x="18" y="14" width="30" height="36" rx="4" fill="#FFFFFF" stroke="#15803D" strokeWidth="2" />
          <line x1="33" y1="15" x2="33" y2="49" stroke="#86EFAC" strokeWidth="1.5" />
          <line x1="19" y1="26" x2="47" y2="26" stroke="#86EFAC" strokeWidth="1.5" />
          <line x1="19" y1="38" x2="47" y2="38" stroke="#86EFAC" strokeWidth="1.5" />
          <rect x="12" y="21" width="18" height="22" rx="4" fill="#15803D" />
          <path d="M17 26 L25 38 M25 26 L17 38" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'powerpoint':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <rect x="6" y="6" width="52" height="52" rx="12" fill="#FFEDD5" />
          <rect x="18" y="15" width="30" height="34" rx="4" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2" />
          <circle cx="36" cy="30" r="7" fill="#FB923C" />
          <path d="M36 23 V30 H43" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="12" y="21" width="18" height="22" rx="4" fill="#EA580C" />
          <path d="M17 38 V26 H22 C24.5 26, 24.5 32, 22 32 H17" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'chrome':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <rect x="6" y="6" width="52" height="52" rx="12" fill="#E0F2FE" />
          <circle cx="32" cy="32" r="17" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
          <path d="M17 24 A17 17 0 0 1 47 24 L37 32 H26 Z" fill="#EF4444" />
          <path d="M47 24 A17 17 0 0 1 32 49 L32 32 Z" fill="#FACC15" />
          <path d="M32 49 A17 17 0 0 1 17 24 L32 32 Z" fill="#22C55E" />
          <circle cx="32" cy="32" r="7.5" fill="#FFFFFF" />
          <circle cx="32" cy="32" r="5.5" fill="#0284C7" />
        </svg>
      );
    case 'paint':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <rect x="6" y="6" width="52" height="52" rx="12" fill="#EDE9FE" />
          <path d="M32 14 C20 14, 14 23, 14 33 C14 43, 22 49, 32 49 C37 49, 40 46, 40 43 C40 40, 38 39, 41 38 C47 36, 50 32, 50 26 C50 18, 42 14, 32 14 Z" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="2" />
          <circle cx="24" cy="27" r="3" fill="#EF4444" />
          <circle cx="33" cy="22" r="3" fill="#F59E0B" />
          <circle cx="41" cy="27" r="3" fill="#0EA5E9" />
          <circle cx="25" cy="38" r="3" fill="#22C55E" />
        </svg>
      );
    default:
      return null;
  }
};
