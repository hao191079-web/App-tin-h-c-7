export type AppSection =
  | 'home'
  | 'lessons'
  | 'lesson1'
  | 'lesson2'
  | 'lesson3'
  | 'arena'
  | 'profile';

export type DeviceCategory = 'input' | 'output' | 'both';

export interface HardwareDevice {
  id: string;
  name: string;
  category: DeviceCategory;
  categoryLabel: string;
  shortDesc: string;
  functionDesc: string;
  realWorldExample: string;
  specialNote?: string;
  labPosition: { x: number; y: number };
}

export interface QuizQuestion {
  id: string;
  lessonId: 'lesson1' | 'lesson2' | 'lesson3';
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export type SoftwareCategory = 'system' | 'application';

export interface SoftwareItem {
  id: string;
  name: string;
  category: SoftwareCategory;
  categoryLabel: string;
  roleDesc: string;
  exampleUse: string;
  accentColor: string;
}

export type FSNodeType = 'folder' | 'file';

export type FileKind = 'docx' | 'pptx' | 'png' | 'txt' | 'other';

export interface FSNode {
  id: string;
  name: string;
  type: FSNodeType;
  parentId: string | null;
  fileKind?: FileKind;
  sizeLabel?: string;
  modifiedLabel?: string;
  previewContent?: string;
}

export interface Lesson3MissionStatus {
  mission1: boolean; // Tạo thư mục DU_AN_TIN_HOC
  mission2: boolean; // Đổi tên baitap1.docx -> baitap_toan.docx
  mission3: boolean; // Sao chép hinh_anh.png vào DU_AN_TIN_HOC
  mission4: boolean; // Di chuyển baithuyettrinh.pptx vào DU_AN_TIN_HOC
  mission5: boolean; // Tìm kiếm baitap_toan.docx
}

export interface StudentProfile {
  fullName: string;
  className: string;
  startedAt: string;
  lastUpdatedAt: string;
}

export interface ArenaResult {
  completed: boolean;
  score: number; // max 150
  correctCount: number; // out of 15
  totalQuestions: number; // 15
  timeSpentSeconds: number;
  completedAt: string;
  answers: Record<string, number>;
}

export interface AppProgress {
  student: StudentProfile;
  lesson1: {
    exploredIds: string[];
    dragScore: number; // max 100
    dragCompleted: boolean;
    scenarioScore: number; // max 50
    scenarioAnswers: Record<string, number>;
    completed: boolean;
  };
  lesson2: {
    exploredIds: string[];
    sortScore: number; // max 80
    sortCompleted: boolean;
    scenarioScore: number; // max 50
    scenarioAnswers: Record<string, number>;
    completed: boolean;
  };
  lesson3: {
    nodes: FSNode[];
    searchedTarget: boolean;
    missions: Lesson3MissionStatus;
    completed: boolean;
  };
  arena: ArenaResult;
}

export interface CurriculumModuleMeta {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  sectionKey?: AppSection;
  availableInV1: boolean;
  plannedVersion?: string;
  objectives: string[];
}
