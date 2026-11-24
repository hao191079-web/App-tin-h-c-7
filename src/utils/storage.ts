import { AppProgress, FSNode, Lesson3MissionStatus } from '../types';
import { INITIAL_FS_NODES } from '../data/lesson3Data';

const STORAGE_KEY = 'smart_ict_7_progress_v1';
const SETTINGS_KEY = 'smart_ict_7_settings_v1';

// In-memory fallback when localStorage is unavailable or blocked
let memoryFallbackProgress: string | null = null;
let memoryFallbackSettings: string | null = null;

export interface AppSettings {
  soundEnabled: boolean;
  zoomEnabled: boolean;
}

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__smart_ict7_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function evaluateLesson3Missions(
  nodes: FSNode[],
  searchedTarget: boolean
): Lesson3MissionStatus {
  const folderDuAn = nodes.find(
    (n) => n.type === 'folder' && n.name.trim() === 'DU_AN_TIN_HOC'
  );
  const folderToan = nodes.find(
    (n) => n.type === 'folder' && n.name.trim() === 'TOAN'
  );
  const folderTinHoc = nodes.find(
    (n) => n.type === 'folder' && n.name.trim() === 'TIN_HOC'
  );

  // Mission 1: DU_AN_TIN_HOC folder created
  const mission1 = Boolean(folderDuAn);

  // Mission 2: baitap1.docx renamed to baitap_toan.docx inside TOAN (or in tree with no baitap1.docx)
  const hasBaitapToan = folderToan
    ? nodes.some(
        (n) =>
          n.type === 'file' &&
          n.parentId === folderToan.id &&
          n.name.trim() === 'baitap_toan.docx'
      )
    : nodes.some((n) => n.type === 'file' && n.name.trim() === 'baitap_toan.docx');
  const stillHasOldBaitap1 = nodes.some(
    (n) => n.type === 'file' && n.name.trim() === 'baitap1.docx'
  );
  const mission2 = hasBaitapToan && !stillHasOldBaitap1;

  // Mission 3: hinh_anh.png copied to DU_AN_TIN_HOC (exists in DU_AN_TIN_HOC AND still in TIN_HOC)
  const inDuAnImg = folderDuAn
    ? nodes.some(
        (n) =>
          n.type === 'file' &&
          n.parentId === folderDuAn.id &&
          n.name.trim() === 'hinh_anh.png'
      )
    : false;
  const stillInTinHocImg = folderTinHoc
    ? nodes.some(
        (n) =>
          n.type === 'file' &&
          n.parentId === folderTinHoc.id &&
          n.name.trim() === 'hinh_anh.png'
      )
    : false;
  const mission3 = inDuAnImg && stillInTinHocImg;

  // Mission 4: baithuyettrinh.pptx moved into DU_AN_TIN_HOC (exists in DU_AN_TIN_HOC AND removed from TIN_HOC)
  const inDuAnPptx = folderDuAn
    ? nodes.some(
        (n) =>
          n.type === 'file' &&
          n.parentId === folderDuAn.id &&
          n.name.trim() === 'baithuyettrinh.pptx'
      )
    : false;
  const stillInTinHocPptx = folderTinHoc
    ? nodes.some(
        (n) =>
          n.type === 'file' &&
          n.parentId === folderTinHoc.id &&
          n.name.trim() === 'baithuyettrinh.pptx'
      )
    : false;
  const mission4 = inDuAnPptx && !stillInTinHocPptx;

  // Mission 5: Searched for baitap_toan.docx (and file exists)
  const mission5 = searchedTarget && hasBaitapToan;

  return {
    mission1,
    mission2,
    mission3,
    mission4,
    mission5,
  };
}

export function createInitialProgress(): AppProgress {
  const now = new Date().toISOString();
  const initialNodes = INITIAL_FS_NODES.map((n) => ({ ...n }));
  return {
    student: {
      fullName: '',
      className: '',
      startedAt: now,
      lastUpdatedAt: now,
    },
    lesson1: {
      exploredIds: [],
      dragScore: 0,
      dragCompleted: false,
      scenarioScore: 0,
      scenarioAnswers: {},
      completed: false,
    },
    lesson2: {
      exploredIds: [],
      sortScore: 0,
      sortCompleted: false,
      scenarioScore: 0,
      scenarioAnswers: {},
      completed: false,
    },
    lesson3: {
      nodes: initialNodes,
      searchedTarget: false,
      missions: evaluateLesson3Missions(initialNodes, false),
      completed: false,
    },
    arena: {
      completed: false,
      score: 0,
      correctCount: 0,
      totalQuestions: 15,
      timeSpentSeconds: 0,
      completedAt: '',
      answers: {},
    },
  };
}

export function loadProgress(): { progress: AppProgress; storageWarning: boolean } {
  const fallback = createInitialProgress();
  try {
    const raw = isLocalStorageAvailable()
      ? window.localStorage.getItem(STORAGE_KEY)
      : memoryFallbackProgress;

    if (!raw) {
      return { progress: fallback, storageWarning: !isLocalStorageAvailable() };
    }

    const parsed = JSON.parse(raw) as Partial<AppProgress>;
    const nodes =
      Array.isArray(parsed.lesson3?.nodes) && parsed.lesson3!.nodes.length > 0
        ? parsed.lesson3!.nodes
        : fallback.lesson3.nodes;
    const searchedTarget = Boolean(parsed.lesson3?.searchedTarget);
    const missions = evaluateLesson3Missions(nodes, searchedTarget);

    const merged: AppProgress = {
      student: {
        ...fallback.student,
        ...(parsed.student || {}),
      },
      lesson1: {
        ...fallback.lesson1,
        ...(parsed.lesson1 || {}),
      },
      lesson2: {
        ...fallback.lesson2,
        ...(parsed.lesson2 || {}),
      },
      lesson3: {
        nodes,
        searchedTarget,
        missions,
        completed:
          missions.mission1 &&
          missions.mission2 &&
          missions.mission3 &&
          missions.mission4 &&
          missions.mission5,
      },
      arena: {
        ...fallback.arena,
        ...(parsed.arena || {}),
      },
    };

    return { progress: merged, storageWarning: !isLocalStorageAvailable() };
  } catch {
    return { progress: fallback, storageWarning: !isLocalStorageAvailable() };
  }
}

export function saveProgress(progress: AppProgress): boolean {
  try {
    const payload = JSON.stringify({
      ...progress,
      student: {
        ...progress.student,
        lastUpdatedAt: new Date().toISOString(),
      },
    });
    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(STORAGE_KEY, payload);
      return true;
    } else {
      memoryFallbackProgress = payload;
      return false;
    }
  } catch {
    memoryFallbackProgress = JSON.stringify(progress);
    return false;
  }
}

export function loadSettings(): AppSettings {
  const defaults: AppSettings = { soundEnabled: false, zoomEnabled: false };
  try {
    const raw = isLocalStorageAvailable()
      ? window.localStorage.getItem(SETTINGS_KEY)
      : memoryFallbackSettings;
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      soundEnabled: Boolean(parsed.soundEnabled),
      zoomEnabled: Boolean(parsed.zoomEnabled),
    };
  } catch {
    return defaults;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    const payload = JSON.stringify(settings);
    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(SETTINGS_KEY, payload);
    } else {
      memoryFallbackSettings = payload;
    }
  } catch {
    memoryFallbackSettings = JSON.stringify(settings);
  }
}

export function validateStudentName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: 'Vui lòng nhập họ và tên của em trước khi bắt đầu.' };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: 'Họ và tên cần có ít nhất 2 ký tự.' };
  }
  if (trimmed.length > 60) {
    return { valid: false, error: 'Họ và tên không vượt quá 60 ký tự.' };
  }
  return { valid: true };
}

export function validateFileSystemName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: 'Tên không được để trống.' };
  }
  if (/[\\/:*?"<>|]/.test(trimmed)) {
    return {
      valid: false,
      error: 'Tên không được chứa các kí tự đặc biệt: \\ / : * ? " < > |',
    };
  }
  if (trimmed.length > 50) {
    return { valid: false, error: 'Tên không vượt quá 50 ký tự.' };
  }
  return { valid: true };
}
