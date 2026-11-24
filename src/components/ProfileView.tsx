import React from 'react';
import {
  Printer,
  Download,
  RotateCcw,
  Home,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { AppProgress } from '../types';
import { RoboAssistant } from './RoboAssistant';

interface ProfileViewProps {
  progress: AppProgress;
  onRetakeArena: () => void;
  onGoHome: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  progress,
  onRetakeArena,
  onGoHome,
}) => {
  const lesson1GameTotal =
    progress.lesson1.dragScore + progress.lesson1.scenarioScore; // max 150
  const lesson2GameTotal =
    progress.lesson2.sortScore + progress.lesson2.scenarioScore; // max 130
  const lesson3MissionsDone = Object.values(progress.lesson3.missions).filter(
    Boolean
  ).length; // max 5
  const arenaScore = progress.arena.score; // max 150
  const arenaCorrect = progress.arena.correctCount; // max 15

  // Overall completion & mastery percentage across all 4 modules
  const l1Pct = Math.min(1, lesson1GameTotal / 150);
  const l2Pct = Math.min(1, lesson2GameTotal / 130);
  const l3Pct = Math.min(1, lesson3MissionsDone / 5);
  const arenaPct = Math.min(1, arenaScore / 150);
  const completionRate = Math.round(((l1Pct + l2Pct + l3Pct + arenaPct) / 4) * 100);

  const getRankInfo = (rate: number) => {
    if (rate >= 90) {
      return {
        title: 'NHÀ KHÁM PHÁ XUẤT SẮC',
        colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        message:
          'Tuyệt vời! Em đã nắm vững kiến thức về thiết bị vào – ra, phần mềm máy tính và thực hành thành thạo các thao tác quản lí dữ liệu. Robo rất tự hào về em!',
      };
    }
    if (rate >= 80) {
      return {
        title: 'NHÀ KHÁM PHÁ TÀI NĂNG',
        colorClass: 'text-sky-700 bg-sky-50 border-sky-200',
        message:
          'Rất tốt! Em có nền tảng Tin học 7 vững vàng. Chỉ cần rà soát lại một vài chi tiết nhỏ nữa là em sẽ đạt danh hiệu Xuất sắc!',
      };
    }
    if (rate >= 65) {
      return {
        title: 'NHÀ KHÁM PHÁ TRIỂN VỌNG',
        colorClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
        message:
          'Khởi đầu rất đáng khen! Em hãy hoàn thành thêm các nhiệm vụ thực hành hoặc làm lại Đấu trường kiến thức để nâng cao điểm số nhé.',
      };
    }
    return {
      title: 'TIẾP TỤC LUYỆN TẬP',
      colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
      message:
        'Hành trình khám phá chỉ mới bắt đầu! Em hãy quay lại từng phòng học cùng Robo, hoàn thành đủ các hoạt động và thử sức lại với Đấu trường kiến thức nhé.',
    };
  };

  const rank = getRankInfo(completionRate);

  const completedTimeLabel = progress.arena.completedAt
    ? new Date(progress.arena.completedAt).toLocaleString('vi-VN')
    : new Date(progress.student.lastUpdatedAt).toLocaleString('vi-VN');

  const handlePrint = () => {
    window.print();
  };

  const handleExportReport = () => {
    const studentName = progress.student.fullName || 'Học sinh';
    const studentClass = progress.student.className || 'Chưa cập nhật';
    const htmlContent = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Báo cáo học tập SMART ICT 7 - ${studentName}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #0f172a; max-width: 780px; margin: 32px auto; padding: 24px; line-height: 1.6; }
    h1 { color: #0369a1; margin-bottom: 4px; font-size: 24px; }
    .sub { color: #475569; font-size: 14px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
    th { background: #f1f5f9; }
    .rank { border: 2px solid #0284c7; background: #f0f9ff; padding: 16px; border-radius: 8px; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>BÁO CÁO KẾT QUẢ HỌC TẬP SMART ICT 7</h1>
  <div class="sub">Chủ đề: Máy tính thông minh – Khám phá thế giới thiết bị (Tin học 7 – Kết nối tri thức)</div>
  <p><strong>Họ và tên:</strong> ${studentName}<br/>
  <strong>Lớp:</strong> ${studentClass}<br/>
  <strong>Thời gian hoàn thành:</strong> ${completedTimeLabel}</p>
  <table>
    <tr><th>Hạng mục đánh giá</th><th>Kết quả</th></tr>
    <tr><td>Điểm trò chơi Bài 1 (Thiết bị vào – ra)</td><td>${lesson1GameTotal} / 150 điểm</td></tr>
    <tr><td>Điểm trò chơi Bài 2 (Phần mềm máy tính)</td><td>${lesson2GameTotal} / 130 điểm</td></tr>
    <tr><td>Số nhiệm vụ hoàn thành Bài 3 (Quản lí dữ liệu)</td><td>${lesson3MissionsDone} / 5 nhiệm vụ</td></tr>
    <tr><td>Điểm bài kiểm tra tổng hợp (Đấu trường)</td><td>${arenaScore} / 150 điểm</td></tr>
    <tr><td>Tổng số câu đúng bài kiểm tra</td><td>${arenaCorrect} / 15 câu</td></tr>
    <tr><td>Tỉ lệ hoàn thành tổng thể</td><td>${completionRate}%</td></tr>
  </table>
  <div class="rank">
    <strong>Xếp loại: ${rank.title}</strong>
    <p>${rank.message}</p>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bao_cao_SMART_ICT7_${studentName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-soft-enter">
      <div className="no-print">
        <RoboAssistant message={rank.message} mood="success" compact />
      </div>

      {/* Printable A4 Sheet */}
      <section className="print-sheet bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        {/* Certificate / Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <p className="text-xs font-bold text-sky-700">
              HỆ SINH THÁI HỌC LIỆU SỐ SMART ICT 7
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              HỒ SƠ NHÀ KHÁM PHÁ
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Báo cáo kết quả học tập Tin học 7 – Kết nối tri thức với cuộc sống
            </p>
          </div>
          <div className="flex items-center gap-2 text-sky-700 shrink-0">
            <Award className="w-8 h-8" />
          </div>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm">
          <div>
            <p className="text-xs text-slate-500">Họ và tên học sinh</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">
              {progress.student.fullName || 'Nhà khám phá'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Lớp</p>
            <p className="font-bold text-slate-900 text-base mt-0.5">
              {progress.student.className || 'Chưa nhập'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Thời gian hoàn thành / cập nhật</p>
            <p className="font-semibold text-slate-800 mt-0.5 tabular-nums">
              {completedTimeLabel}
            </p>
          </div>
        </div>

        {/* Detailed Score Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 p-4 space-y-1">
            <p className="text-xs text-slate-500">Điểm trò chơi Bài 1</p>
            <p className="font-display text-2xl font-bold text-sky-700 tabular-nums">
              {lesson1GameTotal} / 150
            </p>
            <p className="text-xs text-slate-500 tabular-nums">
              Phân loại: {progress.lesson1.dragScore}/100 · Tình huống: {progress.lesson1.scenarioScore}/50
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 space-y-1">
            <p className="text-xs text-slate-500">Điểm trò chơi Bài 2</p>
            <p className="font-display text-2xl font-bold text-indigo-700 tabular-nums">
              {lesson2GameTotal} / 130
            </p>
            <p className="text-xs text-slate-500 tabular-nums">
              Phân loại: {progress.lesson2.sortScore}/80 · Tình huống: {progress.lesson2.scenarioScore}/50
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 space-y-1">
            <p className="text-xs text-slate-500">Nhiệm vụ thực hành Bài 3</p>
            <p className="font-display text-2xl font-bold text-cyan-700 tabular-nums">
              {lesson3MissionsDone} / 5 nhiệm vụ
            </p>
            <p className="text-xs text-slate-500 tabular-nums">
              Tiến độ thực hành: {lesson3MissionsDone * 20}%
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 space-y-1">
            <p className="text-xs text-slate-500">Điểm bài kiểm tra tổng hợp</p>
            <p className="font-display text-2xl font-bold text-amber-700 tabular-nums">
              {arenaScore} / 150
            </p>
            <p className="text-xs text-slate-500">
              {progress.arena.completed ? 'Đã hoàn thành bài kiểm tra' : 'Chưa làm bài kiểm tra'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 space-y-1">
            <p className="text-xs text-slate-500">Tổng số câu đúng (Đấu trường)</p>
            <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
              {arenaCorrect} / 15 câu
            </p>
            <p className="text-xs text-slate-500 tabular-nums">
              Chính xác: {Math.round((arenaCorrect / 15) * 100)}%
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 space-y-1">
            <p className="text-xs text-slate-500">Tỉ lệ hoàn thành chung</p>
            <p className="font-display text-2xl font-bold text-emerald-700 tabular-nums">
              {completionRate}%
            </p>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Classification Banner */}
        <div className={`rounded-2xl border p-5 sm:p-6 space-y-2 ${rank.colorClass}`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold uppercase tracking-wide">
              Xếp loại kết quả
            </p>
          </div>
          <h2 className="font-display text-2xl font-extrabold">{rank.title}</h2>
          <p className="text-sm leading-relaxed opacity-90">{rank.message}</p>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onRetakeArena}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>LÀM LẠI BÀI KIỂM TRA</span>
            </button>
            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>QUAY VỀ TRANG CHỦ</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>IN KẾT QUẢ</span>
            </button>
            <button
              type="button"
              onClick={handleExportReport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>XUẤT BÁO CÁO</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
