import { FSNode } from '../types';

export const ROOT_FOLDER_ID = 'folder-hoc-tap';

export const INITIAL_FS_NODES: FSNode[] = [
  {
    id: 'folder-hoc-tap',
    name: 'HOC_TAP',
    type: 'folder',
    parentId: null,
    modifiedLabel: 'Hôm nay',
  },
  {
    id: 'folder-toan',
    name: 'TOAN',
    type: 'folder',
    parentId: 'folder-hoc-tap',
    modifiedLabel: 'Hôm nay',
  },
  {
    id: 'folder-tin-hoc',
    name: 'TIN_HOC',
    type: 'folder',
    parentId: 'folder-hoc-tap',
    modifiedLabel: 'Hôm nay',
  },
  {
    id: 'folder-van',
    name: 'VAN',
    type: 'folder',
    parentId: 'folder-hoc-tap',
    modifiedLabel: 'Hôm nay',
  },
  {
    id: 'file-baitap1',
    name: 'baitap1.docx',
    type: 'file',
    parentId: 'folder-toan',
    fileKind: 'docx',
    sizeLabel: '24 KB',
    modifiedLabel: '10:15',
    previewContent:
      'Bài tập Toán lớp 7: Ôn tập số hữu tỉ và lũy thừa của một số hữu tỉ.',
  },
  {
    id: 'file-baitap2',
    name: 'baitap2.docx',
    type: 'file',
    parentId: 'folder-toan',
    fileKind: 'docx',
    sizeLabel: '18 KB',
    modifiedLabel: '10:20',
    previewContent:
      'Bài tập hình học: Hai đường thẳng song song và tính chất góc tạo bởi đường thẳng cắt hai đường thẳng.',
  },
  {
    id: 'file-baithuyettrinh',
    name: 'baithuyettrinh.pptx',
    type: 'file',
    parentId: 'folder-tin-hoc',
    fileKind: 'pptx',
    sizeLabel: '1.4 MB',
    modifiedLabel: '09:40',
    previewContent:
      'Bài thuyết trình Tin học 7: Thiết bị vào – ra và phần mềm máy tính.',
  },
  {
    id: 'file-hinhanh',
    name: 'hinh_anh.png',
    type: 'file',
    parentId: 'folder-tin-hoc',
    fileKind: 'png',
    sizeLabel: '320 KB',
    modifiedLabel: '09:45',
    previewContent:
      'Hình ảnh minh họa phòng máy tính trường THCS cho dự án Tin học.',
  },
  {
    id: 'file-baiviet',
    name: 'baiviet.docx',
    type: 'file',
    parentId: 'folder-van',
    fileKind: 'docx',
    sizeLabel: '31 KB',
    modifiedLabel: '08:50',
    previewContent:
      'Bài viết Ngữ văn 7: Cảm nghĩ về mái trường và thầy cô.',
  },
];

export interface Lesson3MissionMeta {
  key: 'mission1' | 'mission2' | 'mission3' | 'mission4' | 'mission5';
  number: number;
  title: string;
  hint: string;
}

export const LESSON3_MISSIONS: Lesson3MissionMeta[] = [
  {
    key: 'mission1',
    number: 1,
    title: 'Tạo thư mục mới có tên DU_AN_TIN_HOC',
    hint: 'Mở thư mục HOC_TAP, bấm "Thư mục mới" và đặt tên chính xác là DU_AN_TIN_HOC.',
  },
  {
    key: 'mission2',
    number: 2,
    title: 'Đổi tên tệp baitap1.docx thành baitap_toan.docx',
    hint: 'Mở thư mục TOAN, chọn tệp baitap1.docx rồi bấm "Đổi tên" thành baitap_toan.docx.',
  },
  {
    key: 'mission3',
    number: 3,
    title: 'Sao chép tệp hinh_anh.png vào thư mục DU_AN_TIN_HOC',
    hint: 'Mở thư mục TIN_HOC, chọn hinh_anh.png, bấm "Sao chép" rồi mở DU_AN_TIN_HOC và bấm "Dán" (tệp gốc vẫn giữ ở TIN_HOC).',
  },
  {
    key: 'mission4',
    number: 4,
    title: 'Di chuyển tệp baithuyettrinh.pptx vào thư mục DU_AN_TIN_HOC',
    hint: 'Mở thư mục TIN_HOC, chọn baithuyettrinh.pptx, bấm "Di chuyển" đến thư mục DU_AN_TIN_HOC (tệp sẽ chuyển khỏi TIN_HOC).',
  },
  {
    key: 'mission5',
    number: 5,
    title: 'Tìm kiếm tệp baitap_toan.docx',
    hint: 'Nhập "baitap_toan.docx" vào ô Tìm kiếm tệp ở thanh công cụ phía trên để kiểm tra kết quả.',
  },
];
