import React from 'react';
import {
  Monitor,
  Cpu,
  FolderKanban,
  Trophy,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { AppProgress, AppSection } from '../types';
import { CURRICULUM_MODULES } from '../data/curriculum';
import { RoboAssistant } from './RoboAssistant';

interface LessonSelectViewProps {
  progress: AppProgress;
  onNavigate: (section: AppSection) => void;
}

export const LessonSelectView: React.FC<LessonSelectViewProps> = ({
  progress,
  onNavigate,
}) => {
  const v1Lessons = CURRICULUM_MODULES.filter((m) => m.availableInV1);
  const futureLessons = CURRICULUM_MODULES.filter((m) => !m.availableInV1);

  const completedCount = [
    progress.lesson1.completed,
    progress.lesson2.completed,
    progress.lesson3.completed,
    progress.arena.completed,
  ].filter(Boolean).length;

  const getLessonStatus = (id: string) => {
    if (id === 'lesson1') return progress.lesson1.completed;
    if (id === 'lesson2') return progress.lesson2.completed;
    if (id === 'lesson3') return progress.lesson3.completed;
    return false;
  };

  const getLessonIcon = (id: string) => {
    if (id === 'lesson1') return Monitor;
    if (id === 'lesson2') return Cpu;
    return FolderKanban;
  };

  const getLessonStatsText = (id: string) => {
    if (id === 'lesson1') {
      return `Khám phá ${progress.lesson1.exploredIds.length}/10 thiết bị · Trò chơi ${progress.lesson1.dragScore}/100 đ · Tình huống ${progress.lesson1.scenarioScore}/50 đ`;
    }
    if (id === 'lesson2') {
      return `Khám phá ${progress.lesson2.exploredIds.length}/8 phần mềm · Phân loại ${progress.lesson2.sortScore}/80 đ · Tình huống ${progress.lesson2.scenarioScore}/50 đ`;
    }
    const missionDone = Object.values(progress.lesson3.missions).filter(Boolean).length;
    return `Hoàn thành ${missionDone}/5 nhiệm vụ thực hành (${missionDone * 20}%)`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-soft-enter">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-sm font-medium text-sky-700">
            Xin chào, {progress.student.fullName || 'Nhà khám phá'}
            {progress.student.className ? ` · Lớp ${progress.student.className}` : ''}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Trung tâm chọn bài học Tin học 7
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Em có thể tự do chọn bất kì bài học nào để khám phá, thực hành và ôn luyện lại nhiều lần.
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <p className="text-xs text-slate-500">Tiến độ hoàn thành</p>
            <p className="font-display font-bold text-lg text-sky-700 tabular-nums">
              {completedCount} / 4 khu vực
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Xem hồ sơ</span>
          </button>
        </div>
      </div>

      <RoboAssistant
        compact
        mood="guide"
        message="Tất cả các phòng thí nghiệm đều đang mở cửa! Em hãy chọn một bài học bên dưới để bắt đầu, hoặc vào Đấu trường kiến thức để thử sức với 15 câu hỏi tổng hợp nhé."
      />

      {/* 3 Core Lessons Grid */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-slate-900">
          Các bài học chính thức (Phiên bản V1)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {v1Lessons.map((lesson) => {
            const Icon = getLessonIcon(lesson.id);
            const completed = getLessonStatus(lesson.id);
            return (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-sky-300 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        completed ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      {completed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Hoàn thành</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>Chưa hoàn thành</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-sky-700">{lesson.subtitle}</p>
                    <h3 className="font-display text-xl font-bold text-slate-900 mt-1">
                      {lesson.title}
                    </h3>
                  </div>

                  <ul className="space-y-2 text-sm text-slate-600">
                    {lesson.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-sky-600 font-bold mt-0.5">·</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 space-y-3">
                  <p className="text-xs text-slate-500 tabular-nums">
                    {getLessonStatsText(lesson.id)}
                  </p>
                  <button
                    type="button"
                    onClick={() => lesson.sectionKey && onNavigate(lesson.sectionKey)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors cursor-pointer"
                  >
                    <span>{completed ? 'Học lại bài này' : 'Vào phòng học'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assessment & Profile Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-700">Kiểm tra tổng hợp</p>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Đấu trường kiến thức
                  </h3>
                </div>
              </div>
              <span
                className={`text-xs font-semibold ${
                  progress.arena.completed ? 'text-emerald-700' : 'text-slate-500'
                }`}
              >
                {progress.arena.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              15 câu hỏi trắc nghiệm bao phủ cả 3 bài học trong thời gian 10 phút. Chấm điểm tự động và giải thích từng câu.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500 tabular-nums">
              {progress.arena.completed
                ? `Kết quả gần nhất: ${progress.arena.correctCount}/15 câu (${progress.arena.score} điểm)`
                : 'Chưa làm bài kiểm tra'}
            </span>
            <button
              type="button"
              onClick={() => onNavigate('arena')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{progress.arena.completed ? 'Làm lại' : 'Thi đấu ngay'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-indigo-700">Báo cáo học tập</p>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Hồ sơ nhà khám phá
                </h3>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Tổng hợp điểm số cả 3 bài học, số nhiệm vụ thực hành hoàn thành, xếp loại học lực và in kết quả khổ A4.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500">Sẵn sàng xem và xuất báo cáo</span>
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Mở hồ sơ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Future Expansion Roadmap (Architecture awareness without V1 clutter) */}
      <section className="bg-slate-100/70 rounded-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-slate-800 font-display font-bold text-base mb-2">
          <Layers className="w-5 h-5 text-slate-600" />
          <h2>Định hướng mở rộng hệ sinh thái SMART ICT 7 (Các phiên bản tiếp theo)</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mb-4">
          Cấu trúc học liệu được thiết kế dạng mô-đun để sẵn sàng bổ sung các chuyên đề tiếp theo trong SGK Tin học 7:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {futureLessons.map((mod) => (
            <div
              key={mod.id}
              className="bg-white/80 rounded-xl border border-slate-200/80 px-3.5 py-3 text-xs text-slate-600"
            >
              <p className="font-semibold text-slate-800">{mod.shortTitle}</p>
              <p className="mt-0.5 line-clamp-2">{mod.title.replace(`${mod.shortTitle}: `, '')}</p>
              <p className="mt-1.5 text-[11px] text-slate-400">Dự kiến tích hợp {mod.plannedVersion}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
