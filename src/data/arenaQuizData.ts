import { QuizQuestion } from '../types';

/**
 * 15 câu hỏi Đấu trường kiến thức (5 câu Bài 1, 5 câu Bài 2, 5 câu Bài 3).
 * Bám sát nội dung SGK Tin học 7 – Kết nối tri thức với cuộc sống.
 */
export const ARENA_QUESTIONS: QuizQuestion[] = [
  // BÀI 1: THIẾT BỊ VÀO - RA (5 câu)
  {
    id: 'q1',
    lessonId: 'lesson1',
    question: 'Thiết bị nào sau đây là thiết bị vào dùng để đưa âm thanh vào máy tính?',
    options: ['Loa máy tính', 'Micro', 'Máy in', 'Màn hình thông thường'],
    correctIndex: 1,
    explanation:
      'Micro thu âm thanh từ bên ngoài và chuyển thành tín hiệu số đưa vào máy tính nên là thiết bị vào.',
  },
  {
    id: 'q2',
    lessonId: 'lesson1',
    question: 'Nhóm thiết bị nào sau đây chỉ gồm các thiết bị ra?',
    options: [
      'Màn hình thông thường, máy in, loa',
      'Bàn phím, chuột, webcam',
      'Máy quét, màn hình cảm ứng, loa',
      'Tai nghe có micro, bàn phím, máy in',
    ],
    correctIndex: 0,
    explanation:
      'Màn hình thông thường, máy in và loa đều thực hiện chức năng xuất thông tin từ máy tính ra ngoài cho người dùng.',
  },
  {
    id: 'q3',
    lessonId: 'lesson1',
    question: 'Thiết bị nào sau đây thuộc nhóm thiết bị vừa vào vừa ra?',
    options: ['Chuột máy tính', 'Máy quét (Scanner)', 'Tai nghe có micro', 'Máy in'],
    correctIndex: 2,
    explanation:
      'Tai nghe có micro kết hợp phần tai nghe (phát âm thanh ra) và phần micro (thu âm thanh vào) nên là thiết bị vừa vào vừa ra.',
  },
  {
    id: 'q4',
    lessonId: 'lesson1',
    question: 'Trong các thiết bị sau, thiết bị nào giúp chuyển hình ảnh trên giấy thành tệp dữ liệu trong máy tính?',
    options: ['Máy in', 'Máy quét (Scanner)', 'Webcam', 'Loa'],
    correctIndex: 1,
    explanation:
      'Máy quét (Scanner) chụp trang tài liệu giấy hoặc bức ảnh và đưa dữ liệu hình ảnh số vào máy tính.',
  },
  {
    id: 'q5',
    lessonId: 'lesson1',
    question: 'Khi sử dụng màn hình cảm ứng của máy tính bảng, thao tác chạm ngón tay để mở ứng dụng thể hiện chức năng nào?',
    options: [
      'Chức năng thiết bị ra',
      'Chức năng thiết bị vào',
      'Chức năng in ấn văn bản',
      'Chức năng lưu trữ dữ liệu lâu dài',
    ],
    correctIndex: 1,
    explanation:
      'Thao tác chạm ngón tay đưa lệnh điều khiển từ người dùng vào máy tính là chức năng của thiết bị vào.',
  },

  // BÀI 2: PHẦN MỀM MÁY TÍNH (5 câu)
  {
    id: 'q6',
    lessonId: 'lesson2',
    question: 'Phần mềm máy tính là gì?',
    options: [
      'Các bộ phận bằng kim loại và nhựa bên trong thân máy',
      'Chương trình máy tính giúp máy tính thực hiện những công việc nhất định',
      'Dây cáp kết nối màn hình và bàn phím',
      'Bàn làm việc đặt máy tính',
    ],
    correctIndex: 1,
    explanation:
      'Theo SGK Tin học 7, phần mềm máy tính là chương trình máy tính giúp máy tính thực hiện những công việc nhất định.',
  },
  {
    id: 'q7',
    lessonId: 'lesson2',
    question: 'Phần mềm nào dưới đây là phần mềm hệ thống (hệ điều hành)?',
    options: ['Microsoft PowerPoint', 'Google Chrome', 'Windows', 'Paint'],
    correctIndex: 2,
    explanation:
      'Windows là hệ điều hành (phần mềm hệ thống). PowerPoint, Google Chrome và Paint là các phần mềm ứng dụng.',
  },
  {
    id: 'q8',
    lessonId: 'lesson2',
    question: 'Vai trò chính của phần mềm hệ thống là gì?',
    options: [
      'Chỉ dùng để vẽ tranh và tô màu',
      'Quản lí, điều khiển hoạt động của máy tính và tạo môi trường cho phần mềm ứng dụng chạy',
      'Thay thế cho thiết bị loa và micro',
      'Chỉ dùng để tính toán bảng điểm',
    ],
    correctIndex: 1,
    explanation:
      'Phần mềm hệ thống quản lí phần cứng, điều khiển toàn bộ hoạt động của máy tính và làm nền để các phần mềm ứng dụng hoạt động.',
  },
  {
    id: 'q9',
    lessonId: 'lesson2',
    question: 'Nhóm phần mềm nào sau đây toàn là phần mềm ứng dụng?',
    options: [
      'Windows, Linux, Android',
      'Microsoft Word, Microsoft Excel, Google Chrome',
      'Linux, Paint, Microsoft Word',
      'Android, Microsoft Excel, Windows',
    ],
    correctIndex: 1,
    explanation:
      'Microsoft Word, Microsoft Excel và Google Chrome đều là các phần mềm ứng dụng phục vụ công việc cụ thể của người dùng.',
  },
  {
    id: 'q10',
    lessonId: 'lesson2',
    question: 'Trên điện thoại thông minh sử dụng hệ điều hành Android, phần mềm Android thuộc loại nào?',
    options: [
      'Phần mềm ứng dụng',
      'Thiết bị vào',
      'Phần mềm hệ thống',
      'Tệp dữ liệu văn bản',
    ],
    correctIndex: 2,
    explanation:
      'Android là hệ điều hành cho thiết bị di động, thuộc nhóm phần mềm hệ thống.',
  },

  // BÀI 3: QUẢN LÍ DỮ LIỆU TRONG MÁY TÍNH (5 câu)
  {
    id: 'q11',
    lessonId: 'lesson3',
    question: 'Để sắp xếp dữ liệu học tập gọn gàng, dễ tìm kiếm trên máy tính, em nên làm gì?',
    options: [
      'Lưu tất cả tệp vào một chỗ và đặt tên ngẫu nhiên',
      'Tạo các thư mục theo môn học hoặc chủ đề và đặt tên tệp rõ ràng, gợi nhớ',
      'Xóa hết các tệp cũ sau mỗi ngày học',
      'Không bao giờ tạo thư mục con',
    ],
    correctIndex: 1,
    explanation:
      'Phân loại dữ liệu vào các thư mục hợp lí theo môn học/chủ đề và đặt tên rõ ràng giúp quản lí khoa học và tìm kiếm nhanh chóng.',
  },
  {
    id: 'q12',
    lessonId: 'lesson3',
    question: 'Thao tác "Sao chép" (Copy) một tệp từ thư mục TIN_HOC sang thư mục DU_AN_TIN_HOC có kết quả như thế nào?',
    options: [
      'Tệp bị xóa khỏi TIN_HOC và chỉ còn ở DU_AN_TIN_HOC',
      'Tệp được tạo thêm một bản sao ở DU_AN_TIN_HOC, tệp gốc ở TIN_HOC vẫn còn nguyên',
      'Cả hai thư mục đều mất tệp đó',
      'Tên tệp tự động bị xóa phần mở rộng',
    ],
    correctIndex: 1,
    explanation:
      'Sao chép (Copy) tạo một bản sao ở vị trí mới trong khi vẫn giữ nguyên tệp gốc ở vị trí ban đầu.',
  },
  {
    id: 'q13',
    lessonId: 'lesson3',
    question: 'Sự khác nhau cơ bản giữa thao tác "Di chuyển" (Move) và "Sao chép" (Copy) tệp là gì?',
    options: [
      'Di chuyển làm tệp biến mất ở thư mục cũ và xuất hiện ở thư mục mới; Sao chép giữ lại cả hai nơi',
      'Di chuyển chỉ áp dụng cho hình ảnh, Sao chép chỉ áp dụng cho văn bản',
      'Di chuyển làm đổi tên tệp tự động',
      'Không có sự khác nhau nào',
    ],
    correctIndex: 0,
    explanation:
      'Khi di chuyển tệp, tệp sẽ được chuyển sang thư mục đích và không còn nằm ở thư mục nguồn nữa.',
  },
  {
    id: 'q14',
    lessonId: 'lesson3',
    question: 'Trong tên tệp "baitap_toan.docx", phần ".docx" cho biết điều gì?',
    options: [
      'Kích thước của tệp tính bằng kilobyte',
      'Phần mở rộng cho biết kiểu tệp (tệp văn bản Word)',
      'Tên của học sinh làm bài',
      'Ngày giờ tạo thư mục',
    ],
    correctIndex: 1,
    explanation:
      'Phần mở rộng (đuôi tệp như .docx, .pptx, .png) giúp máy tính và người dùng nhận biết loại dữ liệu của tệp và phần mềm mở tệp phù hợp.',
  },
  {
    id: 'q15',
    lessonId: 'lesson3',
    question: 'Khi đặt tên tệp hoặc thư mục trên máy tính Windows, cần tránh điều nào sau đây?',
    options: [
      'Sử dụng chữ cái và dấu gạch dưới _',
      'Sử dụng các kí tự đặc biệt bị cấm như \\ / : * ? " < > |',
      'Đặt tên ngắn gọn, có ý nghĩa',
      'Sử dụng chữ số trong tên tệp',
    ],
    correctIndex: 1,
    explanation:
      'Hệ điều hành không cho phép dùng các kí tự đặc biệt \\ / : * ? " < > | trong tên tệp và thư mục.',
  },
];
