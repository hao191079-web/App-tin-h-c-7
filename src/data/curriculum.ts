import { CurriculumModuleMeta } from '../types';

/**
 * Kiến trúc mô-đun học liệu SMART ICT 7.
 * V1 triển khai Bài 1, Bài 2, Bài 3.
 * Sẵn sàng mở rộng Bài 4–16 trong các phiên bản tiếp theo mà không làm thay đổi cấu trúc hiện tại.
 */
export const CURRICULUM_MODULES: CurriculumModuleMeta[] = [
  {
    id: 'lesson1',
    order: 1,
    title: 'Bài 1: Thiết bị vào – ra',
    shortTitle: 'Bài 1',
    subtitle: 'Phòng khám phá thiết bị vào – ra',
    sectionKey: 'lesson1',
    availableInV1: true,
    objectives: [
      'Nhận biết và gọi tên đúng các thiết bị vào – ra phổ biến của máy tính.',
      'Phân loại được thiết bị vào, thiết bị ra và thiết bị vừa vào vừa ra.',
      'Giải thích được chức năng và lấy được ví dụ sử dụng trong thực tế.',
    ],
  },
  {
    id: 'lesson2',
    order: 2,
    title: 'Bài 2: Phần mềm máy tính',
    shortTitle: 'Bài 2',
    subtitle: 'Phòng thí nghiệm phần mềm',
    sectionKey: 'lesson2',
    availableInV1: true,
    objectives: [
      'Hiểu được khái niệm phần mềm máy tính.',
      'Phân biệt được phần mềm hệ thống và phần mềm ứng dụng.',
      'Nêu được vai trò và ví dụ cụ thể cho từng loại phần mềm.',
    ],
  },
  {
    id: 'lesson3',
    order: 3,
    title: 'Bài 3: Quản lí dữ liệu trong máy tính',
    shortTitle: 'Bài 3',
    subtitle: 'Nhà kho dữ liệu thông minh',
    sectionKey: 'lesson3',
    availableInV1: true,
    objectives: [
      'Nhận biết được tệp, thư mục và cấu trúc cây thư mục trên máy tính.',
      'Thực hành thành thạo các thao tác: tạo mới, đổi tên, sao chép, di chuyển, xóa và tìm kiếm tệp.',
      'Tổ chức dữ liệu học tập khoa học, hợp lí.',
    ],
  },
  {
    id: 'lesson4',
    order: 4,
    title: 'Bài 4: Mạng xã hội và một số kênh trao đổi thông tin trên Internet',
    shortTitle: 'Bài 4',
    subtitle: 'Lộ trình mở rộng V2',
    availableInV1: false,
    plannedVersion: 'V2',
    objectives: [],
  },
  {
    id: 'lesson5',
    order: 5,
    title: 'Bài 5: Ứng xử trên mạng',
    shortTitle: 'Bài 5',
    subtitle: 'Lộ trình mở rộng V2',
    availableInV1: false,
    plannedVersion: 'V2',
    objectives: [],
  },
  {
    id: 'lesson6-10',
    order: 6,
    title: 'Bài 6–10: Phần mềm bảng tính',
    shortTitle: 'Bài 6–10',
    subtitle: 'Lộ trình mở rộng V2',
    availableInV1: false,
    plannedVersion: 'V2',
    objectives: [],
  },
  {
    id: 'lesson11-13',
    order: 11,
    title: 'Bài 11–13: Phần mềm trình chiếu',
    shortTitle: 'Bài 11–13',
    subtitle: 'Lộ trình mở rộng V2',
    availableInV1: false,
    plannedVersion: 'V2',
    objectives: [],
  },
  {
    id: 'lesson14-16',
    order: 14,
    title: 'Bài 14–16: Thuật toán',
    shortTitle: 'Bài 14–16',
    subtitle: 'Lộ trình mở rộng V2',
    availableInV1: false,
    plannedVersion: 'V2',
    objectives: [],
  },
];
