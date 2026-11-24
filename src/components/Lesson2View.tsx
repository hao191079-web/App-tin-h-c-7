import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Cpu,
  AppWindow,
  Gamepad2,
  HelpCircle,
} from 'lucide-react';
import { AppProgress, SoftwareCategory, SoftwareItem } from '../types';
import {
  LESSON2_DEFINITION,
  LESSON2_SCENARIOS,
  LESSON2_SOFTWARE_ITEMS,
} from '../data/lesson2Data';
import { SoftwareIllustration } from './DeviceIllustration';
import { RoboAssistant, RoboMood } from './RoboAssistant';
import { playTone } from '../utils/sound';

interface Lesson2ViewProps {
  progress: AppProgress['lesson2'];
  soundEnabled: boolean;
  onUpdate: (next: AppProgress['lesson2']) => void;
  onGoNextLesson: () => void;
}

type TabKey = 'explore' | 'sort' | 'scenario';

export const Lesson2View: React.FC<Lesson2ViewProps> = ({
  progress,
  soundEnabled,
  onUpdate,
  onGoNextLesson,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('explore');
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareItem | null>(
    LESSON2_SOFTWARE_ITEMS[0]
  );

  // Sorting game state
  const [placedMap, setPlacedMap] = useState<Record<string, SoftwareCategory>>(() =>
    progress.sortCompleted
      ? Object.fromEntries(LESSON2_SOFTWARE_ITEMS.map((s) => [s.id, s.category]))
      : {}
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [sortScore, setSortScore] = useState<number>(
    progress.sortCompleted ? 80 : 0
  );
  const [roboMsg, setRoboMsg] = useState<string>(
    'Chào mừng em đến với Phòng thí nghiệm phần mềm! Hãy tìm hiểu sự khác nhau giữa phần mềm hệ thống và phần mềm ứng dụng nhé.'
  );
  const [roboMood, setRoboMood] = useState<RoboMood>('guide');

  // Scenarios
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, number>>(
    progress.scenarioAnswers || {}
  );

  const systemItems = useMemo(
    () => LESSON2_SOFTWARE_ITEMS.filter((s) => s.category === 'system'),
    []
  );
  const appItems = useMemo(
    () => LESSON2_SOFTWARE_ITEMS.filter((s) => s.category === 'application'),
    []
  );
  const unplacedItems = useMemo(
    () => LESSON2_SOFTWARE_ITEMS.filter((s) => !placedMap[s.id]),
    [placedMap]
  );

  const syncProgress = (
    exploredIds: string[],
    nextSortScore: number,
    nextSortDone: boolean,
    nextScenarioScore: number,
    nextScenarioAnswers: Record<string, number>
  ) => {
    const scenariosDone = Object.keys(nextScenarioAnswers).length >= LESSON2_SCENARIOS.length;
    const isCompleted =
      exploredIds.length >= 4 && (nextSortDone || nextSortScore >= 60) && scenariosDone;
    onUpdate({
      exploredIds,
      sortScore: Math.max(progress.sortScore, nextSortScore),
      sortCompleted: progress.sortCompleted || nextSortDone,
      scenarioScore: Math.max(progress.scenarioScore, nextScenarioScore),
      scenarioAnswers: nextScenarioAnswers,
      completed: progress.completed || isCompleted,
    });
  };

  const handleInspectSoftware = (item: SoftwareItem) => {
    setSelectedSoftware(item);
    playTone('click', soundEnabled);
    const updatedExplored = progress.exploredIds.includes(item.id)
      ? progress.exploredIds
      : [...progress.exploredIds, item.id];
    setRoboMood('guide');
    setRoboMsg(`${item.name} là ${item.categoryLabel.toLowerCase()}. ${item.roleDesc}`);
    syncProgress(
      updatedExplored,
      sortScore,
      progress.sortCompleted,
      progress.scenarioScore,
      scenarioAnswers
    );
  };

  const handlePlaceSoftware = (id: string, targetCategory: SoftwareCategory) => {
    const item = LESSON2_SOFTWARE_ITEMS.find((s) => s.id === id);
    if (!item || placedMap[id]) return;

    if (item.category === targetCategory) {
      const nextPlaced = { ...placedMap, [id]: targetCategory };
      const nextScore = Object.keys(nextPlaced).length * 10;
      const allDone = Object.keys(nextPlaced).length === LESSON2_SOFTWARE_ITEMS.length;
      setPlacedMap(nextPlaced);
      setSortScore(nextScore);
      setSelectedCardId(null);
      setDraggingId(null);
      setRoboMood('success');
      playTone(allDone ? 'complete' : 'success', soundEnabled);
      setRoboMsg(
        allDone
          ? `Xuất sắc! Em đã phân loại chính xác toàn bộ ${LESSON2_SOFTWARE_ITEMS.length} phần mềm và đạt ${nextScore}/80 điểm!`
          : `Đúng rồi! ${item.name} thuộc nhóm ${item.categoryLabel.toLowerCase()}. (+10 điểm)`
      );
      syncProgress(
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
        `Chưa chính xác rồi! Em hãy nhớ: Hệ điều hành (Windows, Linux, Android) thuộc Phần mềm hệ thống; còn Word, Excel, PowerPoint, Chrome, Paint là Phần mềm ứng dụng. ${item.name}: ${item.roleDesc}`
      );
    }
  };

  const handleResetSortGame = () => {
    setPlacedMap({});
    setSelectedCardId(null);
    setDraggingId(null);
    setSortScore(0);
    setRoboMood('guide');
    setRoboMsg('Đã đặt lại trò chơi phân loại phần mềm. Em hãy thử lại nhé!');
  };

  const handleAnswerScenario = (qId: string, optIdx: number) => {
    if (scenarioAnswers[qId] !== undefined) return;
    const question = LESSON2_SCENARIOS.find((q) => q.id === qId);
    if (!question) return;

    const nextAnswers = { ...scenarioAnswers, [qId]: optIdx };
    const correctCount = LESSON2_SCENARIOS.filter(
      (q) => nextAnswers[q.id] === q.correctIndex
    ).length;
    const nextScenarioScore = correctCount * 10;

    setScenarioAnswers(nextAnswers);
    const isCorrect = optIdx === question.correctIndex;
    playTone(isCorrect ? 'success' : 'error', soundEnabled);
    setRoboMood(isCorrect ? 'success' : 'encourage');
    setRoboMsg(
      isCorrect
        ? `Chính xác! ${question.explanation}`
        : `Chưa đúng. ${question.explanation}`
    );

    syncProgress(
      progress.exploredIds,
      sortScore,
      progress.sortCompleted,
      nextScenarioScore,
      nextAnswers
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-soft-enter">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-indigo-700">
              Bài 2 · SGK Tin học 7 Kết nối tri thức
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
              GIẢI MÃ THẾ GIỚI PHẦN MỀM
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm tabular-nums">
            <span className="text-slate-600">
              Khám phá: <strong>{progress.exploredIds.length}/8</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600">
              Phân loại: <strong>{progress.sortScore}/80 đ</strong>
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

        <div className="rounded-xl bg-indigo-50/70 border border-indigo-100 p-4 text-sm text-indigo-950">
          <span className="font-bold">Khái niệm trọng tâm: </span>
          {LESSON2_DEFINITION}
        </div>
      </div>

      <RoboAssistant
        message={roboMsg}
        mood={roboMood}
        compact
        hintText="Không nhầm lẫn hệ điều hành với phần mềm ứng dụng: Windows, Linux, Android là phần mềm hệ thống; Word, Excel, PowerPoint, Google Chrome, Paint là phần mềm ứng dụng."
      />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => {
            setActiveTab('explore');
            setRoboMood('guide');
            setRoboMsg('Hãy nhấn vào từng biểu tượng phần mềm thuộc hai nhóm để tìm hiểu vai trò của chúng!');
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'explore'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Hoạt động 1: Khám phá phần mềm</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('sort');
            setRoboMood('guide');
            setRoboMsg('Trò chơi Phần mềm nào thuộc về đâu? Hãy phân loại 8 phần mềm vào đúng nhóm nhé!');
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'sort'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Hoạt động 2: Phần mềm nào thuộc về đâu?</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('scenario');
            setRoboMood('guide');
            setRoboMsg('Cùng vận dụng kiến thức để trả lời 5 tình huống về phần mềm máy tính!');
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'scenario'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Hoạt động 3: Tình huống</span>
        </button>
      </div>

      {/* ACTIVITY 1: EXPLORE TWO GROUPS */}
      {activeTab === 'explore' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-5">
            {/* Group A: System Software */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-900">
                    A. PHẦN MỀM HỆ THỐNG
                  </h2>
                  <p className="text-sm text-slate-600">
                    Vai trò: Quản lí, điều khiển hoạt động của máy tính hoặc thiết bị và tạo môi trường để các phần mềm ứng dụng hoạt động.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {systemItems.map((item) => {
                  const isSelected = selectedSoftware?.id === item.id;
                  const isExplored = progress.exploredIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleInspectSoftware(item)}
                      className={`relative flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200'
                          : 'border-slate-200 hover:border-sky-300 bg-slate-50/50 hover:bg-white'
                      }`}
                    >
                      <SoftwareIllustration softwareId={item.id} className="w-11 h-11 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-sky-700">Hệ điều hành</p>
                      </div>
                      {isExplored && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute top-2 right-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group B: Application Software */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                  <AppWindow className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-900">
                    B. PHẦN MỀM ỨNG DỤNG
                  </h2>
                  <p className="text-sm text-slate-600">
                    Vai trò: Hỗ trợ người dùng thực hiện những công việc cụ thể (soạn văn bản, tính toán, trình chiếu, duyệt web, vẽ tranh...).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {appItems.map((item) => {
                  const isSelected = selectedSoftware?.id === item.id;
                  const isExplored = progress.exploredIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleInspectSoftware(item)}
                      className={`relative flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                          : 'border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-white'
                      }`}
                    >
                      <SoftwareIllustration softwareId={item.id} className="w-11 h-11 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-indigo-700">Ứng dụng</p>
                      </div>
                      {isExplored && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute top-2 right-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detail Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            {selectedSoftware && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <SoftwareIllustration
                    softwareId={selectedSoftware.id}
                    className="w-16 h-16 shrink-0"
                  />
                  <div>
                    <p
                      className={`text-xs font-bold ${
                        selectedSoftware.category === 'system'
                          ? 'text-sky-700'
                          : 'text-indigo-700'
                      }`}
                    >
                      {selectedSoftware.categoryLabel}
                    </p>
                    <h3 className="font-display text-2xl font-bold text-slate-900">
                      {selectedSoftware.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900 mb-0.5">Vai trò và chức năng</p>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedSoftware.roleDesc}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-0.5">Ví dụ sử dụng</p>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedSoftware.exampleUse}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ACTIVITY 2: SOFTWARE SORTING GAME */}
      {activeTab === 'sort' && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Trò chơi: PHẦN MỀM NÀO THUỘC VỀ ĐÂU?
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Kéo biểu tượng phần mềm vào đúng nhóm (hoặc chạm chọn thẻ rồi chạm vào khung nhóm). Mỗi câu đúng +10 điểm.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right tabular-nums">
                <p className="text-xs text-slate-500">Điểm hiện tại</p>
                <p className="font-display text-xl font-bold text-indigo-700">
                  {sortScore} / 80
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetSortGame}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại</span>
              </button>
            </div>
          </div>

          {/* Unplaced Items */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-600">
              Biểu tượng phần mềm ({unplacedItems.length} thẻ còn lại)
            </p>
            {unplacedItems.length > 0 ? (
              <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 min-h-[96px]">
                {unplacedItems.map((item) => {
                  const isSelected = selectedCardId === item.id;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggingId(item.id);
                        e.dataTransfer.setData('text/plain', item.id);
                      }}
                      onDragEnd={() => setDraggingId(null)}
                      onClick={() =>
                        setSelectedCardId((prev) => (prev === item.id ? null : item.id))
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedCardId((prev) =>
                            prev === item.id ? null : item.id
                          );
                        }
                      }}
                      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border select-none cursor-grab active:cursor-grabbing transition-all ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-sm'
                          : draggingId === item.id
                            ? 'opacity-50 border-indigo-400'
                            : 'border-slate-200 hover:border-indigo-300 shadow-2xs'
                      }`}
                    >
                      <SoftwareIllustration softwareId={item.id} className="w-9 h-9 shrink-0" />
                      <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <p className="font-display font-bold text-emerald-800 text-lg">
                  Tuyệt vời! Em đã phân loại chính xác toàn bộ phần mềm (80/80 điểm)
                </p>
              </div>
            )}
          </div>

          {/* 2 Drop Zones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(
              [
                {
                  key: 'system' as SoftwareCategory,
                  title: 'PHẦN MỀM HỆ THỐNG',
                  desc: 'Quản lí, điều khiển hoạt động máy tính và tạo môi trường cho phần mềm khác chạy.',
                  zoneCls: 'border-sky-300 bg-sky-50/60',
                  titleCls: 'text-sky-800',
                },
                {
                  key: 'application' as SoftwareCategory,
                  title: 'PHẦN MỀM ỨNG DỤNG',
                  desc: 'Hỗ trợ người dùng thực hiện các công việc cụ thể hằng ngày.',
                  zoneCls: 'border-indigo-300 bg-indigo-50/60',
                  titleCls: 'text-indigo-800',
                },
              ]
            ).map((zone) => {
              const itemsHere = LESSON2_SOFTWARE_ITEMS.filter(
                (s) => placedMap[s.id] === zone.key
              );
              return (
                <div
                  key={zone.key}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData('text/plain') || draggingId;
                    if (id) handlePlaceSoftware(id, zone.key);
                  }}
                  onClick={() => {
                    if (selectedCardId) handlePlaceSoftware(selectedCardId, zone.key);
                  }}
                  className={`rounded-2xl border-2 border-dashed p-5 min-h-[220px] flex flex-col transition-colors ${
                    zone.zoneCls
                  } ${selectedCardId ? 'cursor-pointer hover:ring-2 hover:ring-indigo-300' : ''}`}
                >
                  <div className="mb-3">
                    <h3 className={`font-display font-bold text-lg ${zone.titleCls}`}>
                      {zone.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">{zone.desc}</p>
                  </div>

                  <div className="flex-1 flex flex-wrap content-start gap-2.5">
                    {itemsHere.map((sw) => (
                      <div
                        key={sw.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-950 text-xs font-semibold shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <SoftwareIllustration softwareId={sw.id} className="w-6 h-6 shrink-0" />
                        <span>{sw.name}</span>
                      </div>
                    ))}
                    {itemsHere.length === 0 && (
                      <p className="text-xs text-slate-400 m-auto py-8 text-center">
                        {selectedCardId
                          ? 'Bấm vào đây để đặt phần mềm đang chọn'
                          : 'Kéo thả phần mềm vào đây'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ACTIVITY 3: SCENARIOS */}
      {activeTab === 'scenario' && (
        <section className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Tình huống vận dụng (5 câu)
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Chọn câu trả lời đúng và đọc giải thích chi tiết từ Robo.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-indigo-700 tabular-nums">
                Đã trả lời: {Object.keys(scenarioAnswers).length}/5 · Điểm:{' '}
                {LESSON2_SCENARIOS.filter((q) => scenarioAnswers[q.id] === q.correctIndex).length *
                  10}
                /50
              </span>
              <button
                type="button"
                onClick={() => setScenarioAnswers({})}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {LESSON2_SCENARIOS.map((q, idx) => {
              const chosen = scenarioAnswers[q.id];
              const isAnswered = chosen !== undefined;
              const isCorrect = chosen === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <p className="font-display font-bold text-slate-900 text-base sm:text-lg">
                    Câu {idx + 1}: {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const letters = ['A', 'B', 'C', 'D'];
                      const isThisChosen = chosen === optIdx;
                      const isThisCorrect = optIdx === q.correctIndex;

                      let btnStyle =
                        'border-slate-200 bg-slate-50/70 hover:bg-indigo-50 hover:border-indigo-300 text-slate-800';
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
              <span>Chuyển sang Bài 3: Quản lí dữ liệu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
