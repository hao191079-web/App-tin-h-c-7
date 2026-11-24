import React, { useState } from 'react';
import {
  Play,
  BookOpen,
  ArrowRight,
  Monitor,
  Cpu,
  FolderKanban,
  Trophy,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AppProgress, AppSection } from '../types';
import { RoboAssistant } from './RoboAssistant';
import { validateStudentName } from '../utils/storage';

interface HomeViewProps {
  progress: AppProgress;
  storageWarning: boolean;
  onStartExplore: (fullName: string, className: string) => void;
  onContinue: () => void;
  onQuickNavigate: (section: AppSection) => void;
}

const HERO_LAB_IMAGE = '/src/assets/images/hero_computer_lab_1795423673585.jpg';

export const HomeView: React.FC<HomeViewProps> = ({
  progress,
  storageWarning,
  onStartExplore,
  onContinue,
  onQuickNavigate,
}) => {
  const [fullName, setFullName] = useState(progress.student.fullName);
  const [className, setClassName] = useState(progress.student.className);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);

  const hasExistingProfile = Boolean(progress.student.fullName.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateStudentName(fullName);
    if (!check.valid) {
      setErrorMsg(check.error || 'Vui lòng kiểm tra lại họ tên.');
      return;
    }
    setErrorMsg(null);
    onStartExplore(fullName.trim(), className.trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-soft-enter">
      {storageWarning && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-3 text-sm text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            Trình duyệt đang hạn chế bộ nhớ lưu trữ cục bộ. Tiến trình vẫn hoạt động trong phiên học hiện tại nhưng có thể không giữ lại khi đóng trình duyệt.
          </span>
        </div>
      )}

      {/* Main Split Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Title, Student Form, CTAs */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-sky-700">
              <span>Hệ sinh thái học liệu số SMART ICT 7</span>
              <span aria-hidden="true">·</span>
              <span>Tin học 7 – Kết nối tri thức với cuộc sống</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
                MÁY TÍNH THÔNG MINH
              </h1>
              <p className="text-lg sm:text-xl font-semibold text-sky-700">
                KHÁM PHÁ THẾ GIỚI THIẾT BỊ
              </p>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                Phòng thí nghiệm số tương tác giúp học sinh lớp 7 khám phá thiết bị vào – ra, phân biệt phần mềm máy tính và thực hành quản lí tệp, thư mục ngay trên trình duyệt.
              </p>
            </div>

            {/* Robo Welcome Speech */}
            <RoboAssistant
              mood="welcome"
              compact
              message="Xin chào các nhà khám phá! Mình là Robo, người bạn đồng hành của các bạn trong phòng thí nghiệm Tin học 7. Hôm nay chúng ta sẽ cùng khám phá thế giới máy tính nhé!"
            />

            {/* Student Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="student-name"
                    className="block text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Họ và tên học sinh <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="student-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Ví dụ: Nguyễn Minh Anh"
                    className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                      errorMsg
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-sky-500 focus:ring-sky-200'
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="student-class"
                    className="block text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Lớp <span className="text-slate-400 font-normal">(không bắt buộc)</span>
                  </label>
                  <input
                    id="student-class"
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Ví dụ: 7A1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-slate-50/70 focus:bg-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-colors"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-sm text-rose-600 font-medium" role="alert">
                  {errorMsg}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm sm:text-base shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>BẮT ĐẦU KHÁM PHÁ</span>
                </button>

                {hasExistingProfile && (
                  <button
                    type="button"
                    onClick={onContinue}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>TIẾP TỤC HỌC</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowGuide(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>HƯỚNG DẪN SỬ DỤNG</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Modern Computer Lab Visual */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
          <div className="relative flex-1 min-h-[260px] lg:min-h-0 bg-gradient-to-br from-sky-50 via-cyan-50 to-indigo-50">
            {!heroImgError ? (
              <img
                src={HERO_LAB_IMAGE}
                alt="Phòng máy tính thông minh hiện đại dành cho học sinh lớp 7"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <Monitor className="w-16 h-16 text-sky-600 mb-3" />
                <p className="font-display font-bold text-slate-800 text-lg">
                  Phòng thí nghiệm Tin học 7
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Mô phỏng trực quan thiết bị vào – ra, phần mềm và hệ thống tệp
                </p>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent p-5 text-white">
              <p className="text-xs font-medium text-sky-200">
                Phòng thí nghiệm thực hành trực quan
              </p>
              <p className="font-display text-lg font-bold leading-snug mt-0.5">
                Học qua tương tác · Trò chơi · Thực hành quản lí dữ liệu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Quick Overview Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => onQuickNavigate('lesson1')}
          className="text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <Monitor className="w-6 h-6 text-sky-600" />
            <span
              className={`text-xs font-semibold ${
                progress.lesson1.completed ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {progress.lesson1.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
            </span>
          </div>
          <h2 className="font-display font-bold text-slate-900 group-hover:text-sky-700">
            Bài 1: Thiết bị vào – ra
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Khám phá 10 thiết bị máy tính, chơi phân loại nhanh và giải 5 tình huống.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onQuickNavigate('lesson2')}
          className="text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <Cpu className="w-6 h-6 text-indigo-600" />
            <span
              className={`text-xs font-semibold ${
                progress.lesson2.completed ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {progress.lesson2.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
            </span>
          </div>
          <h2 className="font-display font-bold text-slate-900 group-hover:text-sky-700">
            Bài 2: Phần mềm máy tính
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Phân biệt phần mềm hệ thống với phần mềm ứng dụng qua mô hình trực quan.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onQuickNavigate('lesson3')}
          className="text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <FolderKanban className="w-6 h-6 text-cyan-600" />
            <span
              className={`text-xs font-semibold ${
                progress.lesson3.completed ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {progress.lesson3.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
            </span>
          </div>
          <h2 className="font-display font-bold text-slate-900 group-hover:text-sky-700">
            Bài 3: Quản lí dữ liệu
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Thực hành tạo thư mục, đổi tên, sao chép, di chuyển, xóa và tìm kiếm tệp.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onQuickNavigate('arena')}
          className="text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <Trophy className="w-6 h-6 text-amber-600" />
            <span
              className={`text-xs font-semibold ${
                progress.arena.completed ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {progress.arena.completed
                ? `${progress.arena.score}/150 điểm`
                : 'Chưa hoàn thành'}
            </span>
          </div>
          <h2 className="font-display font-bold text-slate-900 group-hover:text-sky-700">
            Đấu trường kiến thức
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            15 câu hỏi trắc nghiệm tổng hợp trong 10 phút với giải thích chi tiết.
          </p>
        </button>
      </section>

      {/* Hướng dẫn sử dụng Modal */}
      {showGuide && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-modal-title"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2
                  id="guide-modal-title"
                  className="font-display text-xl font-bold text-slate-900"
                >
                  Hướng dẫn sử dụng SMART ICT 7
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Dành cho học sinh lớp 7 và trình chiếu trên lớp học
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                aria-label="Đóng hướng dẫn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-sm text-slate-700 leading-relaxed">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">1. Tự do khám phá 3 bài học: </span>
                  Các bài học không bị khóa. Em có thể học theo thứ tự từ Bài 1 đến Bài 3 hoặc chọn bất kì bài nào để ôn luyện lại.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">2. Kéo thả hoặc chạm để chọn: </span>
                  Trong các trò chơi phân loại, em có thể kéo thẻ bằng chuột, hoặc chạm chọn thẻ rồi chạm vào nhóm tương ứng trên máy tính bảng/điện thoại.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">3. Thực hành quản lí dữ liệu an toàn (Bài 3): </span>
                  Mọi thao tác tạo thư mục, đổi tên, sao chép, di chuyển, xóa và tìm kiếm diễn ra trên kho dữ liệu mô phỏng, hoàn toàn không ảnh hưởng đến máy tính thật.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">4. Tiện ích lớp học trên thanh công cụ: </span>
                  Có nút bật/tắt âm thanh (tắt mặc định để không gây ồn lớp học), nút phóng to chữ cho máy chiếu và chế độ toàn màn hình.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">5. Lưu tiến trình & In báo cáo A4: </span>
                  Điểm số và nhiệm vụ được lưu tự động trên trình duyệt. Vào mục Hồ sơ khám phá để xem xếp loại, xuất báo cáo hoặc in trên giấy A4.
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm cursor-pointer"
              >
                Đã hiểu, bắt đầu thôi!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
