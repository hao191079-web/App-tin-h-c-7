import React, { useEffect, useState } from 'react';
import {
  Clock,
  Trophy,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  Play,
} from 'lucide-react';
import { ArenaResult } from '../types';
import { ARENA_QUESTIONS } from '../data/arenaQuizData';
import { RoboAssistant, RoboMood } from './RoboAssistant';
import { playTone } from '../utils/sound';

interface ArenaViewProps {
  arenaProgress: ArenaResult;
  soundEnabled: boolean;
  onComplete: (result: ArenaResult) => void;
  onGoProfile: () => void;
}

const TOTAL_SECONDS = 10 * 60; // 10 phút

export const ArenaView: React.FC<ArenaViewProps> = ({
  arenaProgress,
  soundEnabled,
  onComplete,
  onGoProfile,
}) => {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'review'>(
    arenaProgress.completed ? 'review' : 'ready'
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>(
    arenaProgress.completed ? arenaProgress.answers : {}
  );
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_SECONDS);

  const currentQuestion = ARENA_QUESTIONS[currentIndex];
  const currentSelected = currentQuestion ? answers[currentQuestion.id] : undefined;

  const finalizeQuiz = (finalAnswers: Record<string, number>, timeRemaining: number) => {
    const correctCount = ARENA_QUESTIONS.filter(
      (q) => finalAnswers[q.id] === q.correctIndex
    ).length;
    const score = correctCount * 10;
    const timeSpentSeconds = Math.max(1, TOTAL_SECONDS - timeRemaining);

    const result: ArenaResult = {
      completed: true,
      score,
      correctCount,
      totalQuestions: ARENA_QUESTIONS.length,
      timeSpentSeconds,
      completedAt: new Date().toISOString(),
      answers: finalAnswers,
    };

    playTone('complete', soundEnabled);
    onComplete(result);
    setPhase('review');
  };

  // Countdown timer during 'playing' phase
  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  // Auto-submit cleanly when timer reaches 0
  useEffect(() => {
    if (phase === 'playing' && secondsLeft === 0) {
      finalizeQuiz(answers, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft]);

  const handleStartQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSecondsLeft(TOTAL_SECONDS);
    setPhase('playing');
    playTone('click', soundEnabled);
  };

  const handleSelectOption = (optionIdx: number) => {
    if (!currentQuestion || answers[currentQuestion.id] !== undefined) return;
    const nextAnswers = { ...answers, [currentQuestion.id]: optionIdx };
    setAnswers(nextAnswers);
    const isCorrect = optionIdx === currentQuestion.correctIndex;
    playTone(isCorrect ? 'success' : 'error', soundEnabled);
  };

  const handleNextQuestion = () => {
    if (currentIndex < ARENA_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finalizeQuiz(answers, secondsLeft);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getLessonTag = (lessonId: string) => {
    if (lessonId === 'lesson1') return 'Bài 1: Thiết bị vào – ra';
    if (lessonId === 'lesson2') return 'Bài 2: Phần mềm máy tính';
    return 'Bài 3: Quản lí dữ liệu';
  };

  // Determine Robo mood and message
  let roboMood: RoboMood = 'guide';
  let roboMessage =
    'Chào mừng em đến với Đấu trường kiến thức! Em sẽ vượt qua 15 câu hỏi thuộc cả 3 bài học trong 10 phút. Cố gắng lên nhé!';

  if (phase === 'playing' && currentQuestion) {
    if (currentSelected !== undefined) {
      const ok = currentSelected === currentQuestion.correctIndex;
      roboMood = ok ? 'success' : 'encourage';
      roboMessage = ok
        ? `Chính xác! (+10 điểm) ${currentQuestion.explanation}`
        : `Chưa đúng rồi. ${currentQuestion.explanation}`;
    } else {
      roboMessage = `Câu ${currentIndex + 1}/15 (${getLessonTag(currentQuestion.lessonId)}): Em hãy đọc kĩ đề và chọn 1 đáp án đúng nhất nhé!`;
    }
  } else if (phase === 'review') {
    const cCount = ARENA_QUESTIONS.filter(
      (q) => (answers[q.id] ?? arenaProgress.answers[q.id]) === q.correctIndex
    ).length;
    roboMood = cCount >= 12 ? 'success' : 'guide';
    roboMessage = `Em đã hoàn thành bài kiểm tra với ${cCount}/15 câu đúng (${cCount * 10} điểm)! Em có thể xem lại giải thích từng câu bên dưới hoặc mở Hồ sơ nhà khám phá.`;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-soft-enter">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-amber-700">
            Đấu trường kiến thức · Tổng hợp 3 bài học
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
            THỬ THÁCH NHÀ KHÁM PHÁ TIN HỌC
          </h1>
        </div>

        {phase === 'playing' && (
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-mono-num text-lg font-bold shrink-0 ${
              secondsLeft <= 60
                ? 'border-rose-300 bg-rose-50 text-rose-700'
                : 'border-sky-200 bg-sky-50 text-sky-800'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>{formatTime(secondsLeft)}</span>
          </div>
        )}
      </div>

      <RoboAssistant message={roboMessage} mood={roboMood} compact />

      {/* READY SCREEN */}
      {phase === 'ready' && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Sẵn sàng chinh phục 15 câu hỏi?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bài kiểm tra gồm 15 câu trắc nghiệm (5 câu Bài 1, 5 câu Bài 2, 5 câu Bài 3). Thời gian làm bài là 10 phút. Mỗi câu chỉ chọn 1 đáp án và có giải thích ngay sau khi chọn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left text-sm">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs text-slate-500">Số lượng câu hỏi</p>
              <p className="font-display font-bold text-slate-900 text-lg mt-0.5 tabular-nums">
                15 câu (150 điểm)
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs text-slate-500">Thời gian làm bài</p>
              <p className="font-display font-bold text-slate-900 text-lg mt-0.5 tabular-nums">
                10 phút (tự nộp khi hết giờ)
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs text-slate-500">Cấu trúc đề</p>
              <p className="font-display font-bold text-slate-900 text-lg mt-0.5 tabular-nums">
                5 · 5 · 5 (3 bài học)
              </p>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleStartQuiz}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-sm cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>BẮT ĐẦU LÀM BÀI</span>
            </button>
          </div>
        </section>
      )}

      {/* PLAYING SCREEN */}
      {phase === 'playing' && currentQuestion && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Progress header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 tabular-nums">
              <span>
                Câu số {currentIndex + 1} / {ARENA_QUESTIONS.length}
              </span>
              <span className="text-sky-700">{getLessonTag(currentQuestion.lessonId)}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / ARENA_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {currentQuestion.question}
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((opt, idx) => {
                const letters = ['A', 'B', 'C', 'D'];
                const isAnswered = currentSelected !== undefined;
                const isChosen = currentSelected === idx;
                const isCorrect = idx === currentQuestion.correctIndex;

                let cls =
                  'border-slate-200 bg-slate-50/60 hover:bg-sky-50 hover:border-sky-300 text-slate-800';
                if (isAnswered) {
                  if (isCorrect) {
                    cls =
                      'border-emerald-400 bg-emerald-50 text-emerald-950 font-semibold';
                  } else if (isChosen) {
                    cls = 'border-rose-300 bg-rose-50 text-rose-900';
                  } else {
                    cls = 'border-slate-200 bg-slate-50/40 text-slate-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm sm:text-base transition-colors flex items-start gap-3 ${
                      isAnswered ? 'cursor-default' : 'cursor-pointer'
                    } ${cls}`}
                  >
                    <span className="font-bold shrink-0">{letters[idx]}.</span>
                    <span className="flex-1">{opt}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && isChosen && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation & Next Button */}
          {currentSelected !== undefined && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div
                className={`rounded-xl p-4 text-sm border ${
                  currentSelected === currentQuestion.correctIndex
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <p className="font-bold mb-1">
                  {currentSelected === currentQuestion.correctIndex
                    ? 'Đáp án chính xác! (+10 điểm)'
                    : 'Giải thích đáp án đúng:'}
                </p>
                <p>{currentQuestion.explanation}</p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm sm:text-base cursor-pointer"
                >
                  <span>
                    {currentIndex < ARENA_QUESTIONS.length - 1
                      ? 'Câu tiếp theo'
                      : 'Hoàn thành và xem kết quả'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* REVIEW SCREEN */}
      {phase === 'review' && (
        <section className="space-y-6">
          {/* Score Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-emerald-700">
                Kết quả bài kiểm tra tổng hợp
              </p>
              <h2 className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
                {arenaProgress.score} / 150 điểm
              </h2>
              <p className="text-sm text-slate-600 tabular-nums">
                Số câu đúng: <strong>{arenaProgress.correctCount}/15 câu</strong> · Thời gian làm bài:{' '}
                <strong>{formatTime(arenaProgress.timeSpentSeconds)}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleStartQuiz}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại bài kiểm tra</span>
              </button>
              <button
                type="button"
                onClick={onGoProfile}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Xem Hồ sơ nhà khám phá</span>
              </button>
            </div>
          </div>

          {/* Review All 15 Questions */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-lg text-slate-900">
              Xem lại chi tiết 15 câu hỏi
            </h3>
            {ARENA_QUESTIONS.map((q, idx) => {
              const userAns = arenaProgress.answers[q.id];
              const isCorrect = userAns === q.correctIndex;
              const letters = ['A', 'B', 'C', 'D'];
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">
                      Câu {idx + 1}: {q.question}
                    </p>
                    <span
                      className={`text-xs font-bold shrink-0 ${
                        isCorrect ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isCorrect ? 'Đúng (+10đ)' : userAns === undefined ? 'Chưa trả lời' : 'Sai'}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700 space-y-1">
                    {userAns !== undefined && !isCorrect && (
                      <p className="text-rose-700">
                        Em đã chọn: {letters[userAns]}. {q.options[userAns]}
                      </p>
                    )}
                    <p className="text-emerald-700 font-medium">
                      Đáp án đúng: {letters[q.correctIndex]}. {q.options[q.correctIndex]}
                    </p>
                    <p className="text-slate-600 pt-1">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
