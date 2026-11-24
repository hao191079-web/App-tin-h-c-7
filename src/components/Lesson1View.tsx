import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Info,
  Gamepad2,
  HelpCircle,
  X,
  Hand,
} from 'lucide-react';
import { AppProgress, DeviceCategory, HardwareDevice } from '../types';
import { LESSON1_DEVICES, LESSON1_SCENARIOS } from '../data/lesson1Data';
import { DeviceIllustration } from './DeviceIllustration';
import { RoboAssistant, RoboMood } from './RoboAssistant';
import { playTone } from '../utils/sound';

interface Lesson1ViewProps {
  progress: AppProgress['lesson1'];
  soundEnabled: boolean;
  onUpdate: (next: AppProgress['lesson1']) => void;
  onGoNextLesson: () => void;
}

type TabKey = 'explore' | 'drag' | 'scenario';

const CATEGORY_INFO: Record<
  DeviceCategory,
  { title: string; subtitle: string; badgeClass: string; zoneClass: string }
> = {
  input: {
    title: 'THIẾT BỊ VÀO',
    subtitle: 'Tiếp nhận thông tin từ bên ngoài đưa vào máy tính',
    badgeClass: 'text-sky-700',
    zoneClass: 'border-sky-300 bg-sky-50/60',
  },
  output: {
    title: 'THIẾT BỊ RA',
    subtitle: 'Xuất thông tin từ máy tính ra bên ngoài cho người dùng',
    badgeClass: 'text-indigo-700',
    zoneClass: 'border-indigo-300 bg-indigo-50/60',
  },
  both: {
    title: 'THIẾT BỊ VỪA VÀO VỪA RA',
    subtitle: 'Thực hiện đồng thời cả chức năng đưa vào và xuất ra',
    badgeClass: 'text-cyan-700',
    zoneClass: 'border-cyan-300 bg-cyan-50/60',
  },
};

export const Lesson1View: React.FC<Lesson1ViewProps> = ({
  progress,
  soundEnabled,
  onUpdate,
  onGoNextLesson,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('explore');
  const [selectedDevice, setSelectedDevice] = useState<HardwareDevice | null>(null);

  // Drag & drop / tap-to-place game state
  const [placedDevices, setPlacedDevices] = useState<Record<string, DeviceCategory>>(() =>
    progress.dragCompleted
      ? Object.fromEntries(LESSON1_DEVICES.map((d) => [d.id, d.category]))
      : {}
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragScore, setDragScore] = useState<number>(
    progress.dragCompleted ? 100 : 0
  );
  const [roboMsg, setRoboMsg] = useState<string>(
    'Chào mừng em đến với Phòng khám phá thiết bị vào – ra! Hãy nhấn vào từng thiết bị trong phòng máy tính để xem chức năng chi tiết nhé.'
  );
  const [roboMood, setRoboMood] = useState<RoboMood>('guide');

  // Scenario state
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, number>>(
    progress.scenarioAnswers || {}
  );

  const unplacedDevices = useMemo(
    () => LESSON1_DEVICES.filter((d) => !placedDevices[d.id]),
    [placedDevices]
  );

  const checkCompletion = (
    exploredIds: string[],
    newDragScore: number,
    newDragCompleted: boolean,
    newScenarioScore: number,
    newScenarioAnswers: Record<string, number>
  ) => {
    const scenariosDone = Object.keys(newScenarioAnswers).length >= LESSON1_SCENARIOS.length;
    const isCompleted =
      exploredIds.length >= 6 && (newDragCompleted || newDragScore >= 60) && scenariosDone;
    onUpdate({
      exploredIds,
      dragScore: Math.max(progress.dragScore, newDragScore),
      dragCompleted: progress.dragCompleted || newDragCompleted,
      scenarioScore: Math.max(progress.scenarioScore, newScenarioScore),
      scenarioAnswers: newScenarioAnswers,
      completed: progress.completed || isCompleted,
    });
  };

  const handleInspectDevice = (device: HardwareDevice) => {
    setSelectedDevice(device);
    playTone('click', soundEnabled);
    const updatedExplored = progress.exploredIds.includes(device.id)
      ? progress.exploredIds
      : [...progress.exploredIds, device.id];
    setRoboMood('guide');
    setRoboMsg(
      `${device.name} thuộc nhóm ${device.categoryLabel}. ${device.specialNote || device.shortDesc}`
    );
    checkCompletion(
      updatedExplored,
      dragScore,
      progress.dragCompleted,
      progress.scenarioScore,
      scenarioAnswers
    );
  };

  const handlePlaceDevice = (deviceId: string, targetCategory: DeviceCategory) => {
    const device = LESSON1_DEVICES.find((d) => d.id === deviceId);
    if (!device || placedDevices[deviceId]) return;

    if (device.category === targetCategory) {
      const nextPlaced = { ...placedDevices, [deviceId]: targetCategory };
      const nextScore = Object.keys(nextPlaced).length * 10;
      const allDone = Object.keys(nextPlaced).length === LESSON1_DEVICES.length;
      setPlacedDevices(nextPlaced);
      setDragScore(nextScore);
      setSelectedCardId(null);
      setDraggingId(null);
      setRoboMood('success');
      playTone(allDone ? 'complete' : 'success', soundEnabled);
      setRoboMsg(
        allDone
          ? `Tuyệt vời! Em đã phân loại chính xác cả 10 thiết bị và đạt ${nextScore}/100 điểm!`
          : `Chính xác! ${device.name} là ${device.categoryLabel.toLowerCase()}. (+10 điểm)`
      );
      checkCompletion(
        progress.exploredIds,
        nextScore,
        allDone,
        progress.scenarioScore,
        scenarioAnswers
      );
    } else {
      setSelectedCardId(null);
      setDraggingId(null);
      setRoboMood('encourage');
      playTone('error', soundEnabled);
      setRoboMsg(
        `Chưa đúng rồi! ${device.name} không thuộc nhóm ${CATEGORY_INFO[targetCategory].title.toLowerCase()}. Gợi ý: ${device.functionDesc}`
      );
    }
  };

  const handleResetDragGame = () => {
    setPlacedDevices({});
    setSelectedCardId(null);
    setDraggingId(null);
    setDragScore(0);
    setRoboMood('guide');
    setRoboMsg('Đã làm mới trò chơi! Hãy kéo thẻ hoặc chạm chọn thẻ rồi chạm vào nhóm đúng nhé.');
  };

  const handleAnswerScenario = (questionId: string, optionIdx: number) => {
    if (scenarioAnswers[questionId] !== undefined) return;
    const question = LESSON1_SCENARIOS.find((q) => q.id === questionId);
    if (!question) return;

    const nextAnswers = { ...scenarioAnswers, [questionId]: optionIdx };
    const correctCount = LESSON1_SCENARIOS.filter(
      (q) => nextAnswers[q.id] === q.correctIndex
    ).length;
    const nextScenarioScore = correctCount * 10;

    setScenarioAnswers(nextAnswers);
    const isCorrect = optionIdx === question.correctIndex;
    playTone(isCorrect ? 'success' : 'error', soundEnabled);
    setRoboMood(isCorrect ? 'success' : 'encourage');
    setRoboMsg(
      isCorrect
        ? `Rất giỏi! ${question.explanation}`
        : `Chưa chính xác. ${question.explanation}`
    );

    checkCompletion(
      progress.exploredIds,
      dragScore,
      progress.dragCompleted,
      nextScenarioScore,
      nextAnswers
    );
  };

  const handleResetScenarios = () => {
    setScenarioAnswers({});
    setRoboMood('guide');
    setRoboMsg('Em có thể làm lại 5 tình huống thực tế để củng cố kiến thức nhé!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-soft-enter">
      {/* Header & Objectives */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-sky-700">
              Bài 1 · SGK Tin học 7 Kết nối tri thức
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
              PHÒNG KHÁM PHÁ THIẾT BỊ VÀO – RA
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm tabular-nums">
            <span className="text-slate-600">
              Thiết bị: <strong>{progress.exploredIds.length}/10</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600">
              Trò chơi: <strong>{progress.dragScore}/100 đ</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span
              className={`font-semibold ${
                progress.completed ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {progress.completed ? 'Hoàn thành' : 'Đang học'}
            </span>
          </div>
        </div>

        {/* Concise Core Knowledge Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs sm:text-sm">
          <div className="rounded-xl bg-sky-50/70 border border-sky-100 p-3.5">
            <p className="font-bold text-sky-800">Thiết bị vào</p>
            <p className="text-slate-700 mt-1">
              Tiếp nhận thông tin từ thế giới bên ngoài đưa vào máy tính (bàn phím, chuột, micro, webcam, máy quét).
            </p>
          </div>
          <div className="rounded-xl bg-indigo-50/70 border border-indigo-100 p-3.5">
            <p className="font-bold text-indigo-800">Thiết bị ra</p>
            <p className="text-slate-700 mt-1">
              Đưa thông tin từ máy tính ra bên ngoài cho người dùng (màn hình thông thường, máy in, loa).
            </p>
          </div>
          <div className="rounded-xl bg-cyan-50/70 border border-cyan-100 p-3.5">
            <p className="font-bold text-cyan-800">Thiết bị vừa vào vừa ra</p>
            <p className="text-slate-700 mt-1">
              Thực hiện cả hai chức năng vào và ra (màn hình cảm ứng, tai nghe có micro).
            </p>
          </div>
        </div>
      </div>

      {/* Robo Assistant */}
      <RoboAssistant
        message={roboMsg}
        mood={roboMood}
        compact
        hintText="Màn hình cảm ứng vừa hiển thị hình ảnh (ra) vừa nhận thao tác chạm tay (vào). Tai nghe có micro vừa phát âm thanh (ra) vừa thu giọng nói qua micro (vào)."
      />

      {/* Activity Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => {
            setActiveTab('explore');
            setRoboMood('guide');
            setRoboMsg('Hãy nhấn vào từng thiết bị trong phòng máy tính để khám phá tên gọi, chức năng và ví dụ thực tế!');
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'explore'
              ? 'bg-white text-sky-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Hoạt động 1: Khám phá thiết bị</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('drag');
            setRoboMood('guide');
            setRoboMsg('Trò chơi Ai phân loại nhanh hơn? Kéo thả thẻ thiết bị vào đúng nhóm, hoặc chạm chọn thẻ rồi chạm vào ô nhóm!');
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'drag'
              ? 'bg-white text-sky-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Hoạt động 2: Ai phân loại nhanh hơn?</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('scenario');
            setRoboMood('guide');
            setRoboMsg('Cùng giải quyết 5 tình huống sử dụng thiết bị trong thực tế nhé! Mỗi câu đúng được 10 điểm.');
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'scenario'
              ? 'bg-white text-sky-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Hoạt động 3: Thử thách tình huống</span>
        </button>
      </div>

      {/* ACTIVITY 1: EXPLORE COMPUTER LAB */}
      {activeTab === 'explore' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Computer Lab Visual Stage */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display font-bold text-lg text-slate-900">
                Phòng máy tính tương tác (10 thiết bị)
              </h2>
              <span className="text-xs text-slate-500 tabular-nums">
                Đã khám phá {progress.exploredIds.length}/10
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {LESSON1_DEVICES.map((device) => {
                const isExplored = progress.exploredIds.includes(device.id);
                const isSelected = selectedDevice?.id === device.id;
                return (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => handleInspectDevice(device)}
                    className={`relative flex flex-col items-center text-center p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200'
                        : isExplored
                          ? 'border-emerald-200 bg-emerald-50/40 hover:border-sky-300'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-sky-300'
                    }`}
                  >
                    {isExplored && (
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-600 absolute top-2 right-2"
                        aria-label="Đã khám phá"
                      />
                    )}
                    <DeviceIllustration deviceId={device.id} className="w-16 h-16 mb-2" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                      {device.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Device Detail Inspector Panel */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            {selectedDevice ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 shrink-0">
                      <DeviceIllustration
                        deviceId={selectedDevice.id}
                        className="w-16 h-16"
                      />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-bold ${
                          CATEGORY_INFO[selectedDevice.category].badgeClass
                        }`}
                      >
                        {selectedDevice.categoryLabel}
                      </p>
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        {selectedDevice.name}
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDevice(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                    aria-label="Đóng thông tin thiết bị"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900 mb-0.5">Chức năng</p>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedDevice.functionDesc}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900 mb-0.5">Nhóm thiết bị</p>
                    <p className="text-slate-700">{selectedDevice.categoryLabel}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900 mb-0.5">
                      Ví dụ sử dụng trong thực tế
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedDevice.realWorldExample}
                    </p>
                  </div>

                  {selectedDevice.specialNote && (
                    <div className="rounded-xl bg-cyan-50 border border-cyan-200 p-3 text-xs sm:text-sm text-cyan-950">
                      <span className="font-bold">Lưu ý quan trọng: </span>
                      {selectedDevice.specialNote}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <Hand className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-slate-900 text-lg">
                  Chọn một thiết bị để xem thông tin
                </h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Nhấn vào hình ảnh thiết bị ở khung bên trái để xem tên, chức năng, nhóm phân loại và ví dụ sử dụng.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ACTIVITY 2: DRAG & DROP / TAP CLASSIFICATION GAME */}
      {activeTab === 'drag' && (
        <section className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Trò chơi: AI PHÂN LOẠI NHANH HƠN?
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Kéo thẻ thiết bị thả vào nhóm phù hợp (hoặc chạm chọn thẻ rồi chạm vào nhóm bên dưới). Mỗi câu đúng +10 điểm.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right tabular-nums">
                  <p className="text-xs text-slate-500">Điểm hiện tại</p>
                  <p className="font-display text-xl font-bold text-sky-700">
                    {dragScore} / 100
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetDragGame}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại</span>
                </button>
              </div>
            </div>

            {/* Unplaced Cards Tray */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-600">
                Thẻ thiết bị cần phân loại ({unplacedDevices.length} thẻ còn lại)
                {selectedCardId && (
                  <span className="text-sky-700 ml-2">
                    — Đang chọn thẻ:{' '}
                    {LESSON1_DEVICES.find((d) => d.id === selectedCardId)?.name}. Hãy bấm vào ô nhóm bên dưới!
                  </span>
                )}
              </p>

              {unplacedDevices.length > 0 ? (
                <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 min-h-[104px]">
                  {unplacedDevices.map((device) => {
                    const isSelected = selectedCardId === device.id;
                    return (
                      <div
                        key={device.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggingId(device.id);
                          e.dataTransfer.setData('text/plain', device.id);
                        }}
                        onDragEnd={() => setDraggingId(null)}
                        onClick={() =>
                          setSelectedCardId((prev) =>
                            prev === device.id ? null : device.id
                          )
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedCardId((prev) =>
                              prev === device.id ? null : device.id
                            );
                          }
                        }}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border select-none cursor-grab active:cursor-grabbing transition-all ${
                          isSelected
                            ? 'border-sky-600 ring-2 ring-sky-200 shadow-sm'
                            : draggingId === device.id
                              ? 'opacity-50 border-sky-400'
                              : 'border-slate-200 hover:border-sky-300 shadow-xs'
                        }`}
                      >
                        <DeviceIllustration deviceId={device.id} className="w-9 h-9 shrink-0" />
                        <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                          {device.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <p className="font-display font-bold text-emerald-800 text-lg">
                    Chúc mừng! Em đã hoàn thành phân loại cả 10 thiết bị (100/100 điểm)
                  </p>
                  <p className="text-sm text-emerald-700">
                    Hãy chuyển sang Hoạt động 3: Thử thách tình huống để tiếp tục nhé.
                  </p>
                </div>
              )}
            </div>

            {/* 3 Drop Zones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['input', 'output', 'both'] as DeviceCategory[]).map((cat) => {
                const info = CATEGORY_INFO[cat];
                const itemsInZone = LESSON1_DEVICES.filter(
                  (d) => placedDevices[d.id] === cat
                );
                return (
                  <div
                    key={cat}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const id = e.dataTransfer.getData('text/plain') || draggingId;
                      if (id) handlePlaceDevice(id, cat);
                    }}
                    onClick={() => {
                      if (selectedCardId) handlePlaceDevice(selectedCardId, cat);
                    }}
                    className={`rounded-2xl border-2 border-dashed p-4 min-h-[220px] flex flex-col transition-colors ${
                      selectedCardId
                        ? `${info.zoneClass} cursor-pointer hover:ring-2 hover:ring-sky-300`
                        : info.zoneClass
                    }`}
                  >
                    <div className="mb-3">
                      <h3 className={`font-display font-bold text-base ${info.badgeClass}`}>
                        {info.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">{info.subtitle}</p>
                    </div>

                    <div className="flex-1 flex flex-wrap content-start gap-2">
                      {itemsInZone.map((dev) => (
                        <div
                          key={dev.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-semibold shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <DeviceIllustration deviceId={dev.id} className="w-6 h-6 shrink-0" />
                          <span>{dev.name}</span>
                        </div>
                      ))}
                      {itemsInZone.length === 0 && (
                        <p className="text-xs text-slate-400 m-auto text-center py-6">
                          {selectedCardId
                            ? 'Bấm vào đây để đặt thiết bị đang chọn'
                            : 'Kéo thả thẻ thiết bị vào đây'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ACTIVITY 3: 5 SCENARIO QUESTIONS */}
      {activeTab === 'scenario' && (
        <section className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Thử thách tình huống thực tế (5 câu)
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Đọc kĩ tình huống và chọn phương án đúng nhất.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-sky-700 tabular-nums">
                Đã trả lời: {Object.keys(scenarioAnswers).length}/5 · Điểm:{' '}
                {LESSON1_SCENARIOS.filter((q) => scenarioAnswers[q.id] === q.correctIndex).length *
                  10}
                /50
              </span>
              <button
                type="button"
                onClick={handleResetScenarios}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {LESSON1_SCENARIOS.map((q, idx) => {
              const chosen = scenarioAnswers[q.id];
              const isAnswered = chosen !== undefined;
              const isCorrect = chosen === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <p className="font-display font-bold text-slate-900 text-base sm:text-lg">
                    Tình huống {idx + 1}: {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const letters = ['A', 'B', 'C', 'D'];
                      const isThisChosen = chosen === optIdx;
                      const isThisCorrect = optIdx === q.correctIndex;

                      let btnStyle =
                        'border-slate-200 bg-slate-50/70 hover:bg-sky-50 hover:border-sky-300 text-slate-800';
                      if (isAnswered) {
                        if (isThisCorrect) {
                          btnStyle =
                            'border-emerald-400 bg-emerald-50 text-emerald-950 font-semibold';
                        } else if (isThisChosen) {
                          btnStyle = 'border-rose-300 bg-rose-50 text-rose-900';
                        } else {
                          btnStyle = 'border-slate-200 bg-slate-50/50 text-slate-400';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleAnswerScenario(q.id, optIdx)}
                          className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors flex items-start gap-2.5 ${
                            isAnswered ? 'cursor-default' : 'cursor-pointer'
                          } ${btnStyle}`}
                        >
                          <span className="font-bold shrink-0">{letters[optIdx]}.</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div
                      className={`rounded-xl p-3.5 text-sm border ${
                        isCorrect
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50/80 border-amber-200 text-amber-950'
                      }`}
                    >
                      <span className="font-bold">
                        {isCorrect ? 'Chính xác! ' : 'Giải thích: '}
                      </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onGoNextLesson}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm cursor-pointer"
            >
              <span>Chuyển sang Bài 2: Phần mềm máy tính</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
