import { HardwareDevice, QuizQuestion } from '../types';

export const LESSON1_DEVICES: HardwareDevice[] = [
  {
    id: 'keyboard',
    name: 'Bàn phím',
    category: 'input',
    categoryLabel: 'Thiết bị vào',
    shortDesc: 'Nhập chữ, số và kí tự điều khiển vào máy tính.',
    functionDesc:
      'Tiếp nhận thông tin dạng văn bản, chữ số, kí hiệu và các tổ hợp phím lệnh từ người dùng rồi chuyển thành tín hiệu gửi vào máy tính xử lí.',
    realWorldExample:
      'Gõ bài văn bản trong Microsoft Word, nhập công thức toán, tìm kiếm thông tin trên trình duyệt web.',
    labPosition: { x: 42, y: 67 },
  },
  {
    id: 'mouse',
    name: 'Chuột máy tính',
    category: 'input',
    categoryLabel: 'Thiết bị vào',
    shortDesc: 'Điều khiển con trỏ và ra lệnh bằng thao tác nhấp, kéo.',
    functionDesc:
      'Tiếp nhận thao tác di chuyển, nhấp chọn, nhấp đúp hoặc kéo thả của người dùng để điều khiển con trỏ và chọn các đối tượng trên màn hình.',
    realWorldExample:
      'Mở thư mục bài tập, chọn biểu tượng phần mềm, kéo thả hình ảnh hoặc vẽ trong phần mềm Paint.',
    labPosition: { x: 58, y: 70 },
  },
  {
    id: 'monitor',
    name: 'Màn hình thông thường',
    category: 'output',
    categoryLabel: 'Thiết bị ra',
    shortDesc: 'Hiển thị hình ảnh, văn bản và video từ máy tính.',
    functionDesc:
      'Xuất thông tin đã được máy tính xử lí ra bên ngoài dưới dạng hình ảnh, chữ viết, biểu đồ, video để người dùng quan sát.',
    realWorldExample:
      'Xem bài giảng điện tử, đọc tài liệu học tập, quan sát kết quả khi gõ văn bản.',
    specialNote:
      'Màn hình thông thường chỉ dùng để hiển thị thông tin nên là thiết bị ra (khác với màn hình cảm ứng).',
    labPosition: { x: 46, y: 36 },
  },
  {
    id: 'printer',
    name: 'Máy in',
    category: 'output',
    categoryLabel: 'Thiết bị ra',
    shortDesc: 'In văn bản và hình ảnh từ máy tính ra giấy.',
    functionDesc:
      'Nhận dữ liệu văn bản, hình ảnh từ máy tính và thể hiện ra trên giấy hoặc vật liệu in để người dùng cầm đọc trực tiếp.',
    realWorldExample:
      'In phiếu bài tập Tin học 7, in báo cáo kết quả học tập, in tranh ảnh minh họa.',
    labPosition: { x: 80, y: 45 },
  },
  {
    id: 'speaker',
    name: 'Loa máy tính',
    category: 'output',
    categoryLabel: 'Thiết bị ra',
    shortDesc: 'Phát âm thanh từ máy tính ra môi trường bên ngoài.',
    functionDesc:
      'Chuyển tín hiệu âm thanh số từ máy tính thành sóng âm thanh phát ra không khí để người dùng nghe được.',
    realWorldExample:
      'Nghe bài giảng tiếng Anh, nghe nhạc, nghe thông báo âm thanh của bài học.',
    labPosition: { x: 24, y: 47 },
  },
  {
    id: 'microphone',
    name: 'Micro',
    category: 'input',
    categoryLabel: 'Thiết bị vào',
    shortDesc: 'Thu âm thanh từ bên ngoài đưa vào máy tính.',
    functionDesc:
      'Thu nhận giọng nói hoặc âm thanh từ môi trường bên ngoài và chuyển thành tín hiệu số đưa vào máy tính để ghi âm hoặc xử lí.',
    realWorldExample:
      'Ghi âm bài thuyết trình, phát biểu trong giờ học trực tuyến, thu âm luyện đọc tiếng Anh.',
    labPosition: { x: 32, y: 58 },
  },
  {
    id: 'webcam',
    name: 'Webcam',
    category: 'input',
    categoryLabel: 'Thiết bị vào',
    shortDesc: 'Thu hình ảnh và video trực tiếp đưa vào máy tính.',
    functionDesc:
      'Ghi lại hình ảnh tĩnh hoặc hình ảnh chuyển động (video) của người dùng và khung cảnh xung quanh để truyền vào máy tính.',
    realWorldExample:
      'Tham gia lớp học trực tuyến, gọi video trao đổi bài với bạn bè và thầy cô.',
    labPosition: { x: 46, y: 17 },
  },
  {
    id: 'scanner',
    name: 'Máy quét (Scanner)',
    category: 'input',
    categoryLabel: 'Thiết bị vào',
    shortDesc: 'Quét tài liệu giấy, ảnh thành dữ liệu số trong máy tính.',
    functionDesc:
      'Chụp và chuyển đổi hình ảnh, trang sách hoặc tài liệu in trên giấy thành tệp hình ảnh/tài liệu lưu trữ trong máy tính.',
    realWorldExample:
      'Quét bài vẽ trên giấy hoặc phiếu bài làm để lưu lại và nộp cho giáo viên qua mạng.',
    labPosition: { x: 16, y: 67 },
  },
  {
    id: 'touchscreen',
    name: 'Màn hình cảm ứng',
    category: 'both',
    categoryLabel: 'Thiết bị vừa vào vừa ra',
    shortDesc: 'Vừa hiển thị hình ảnh vừa nhận thao tác chạm của người dùng.',
    functionDesc:
      'Kết hợp hai chức năng: vừa xuất thông tin hình ảnh ra cho người dùng xem (chức năng ra), vừa tiếp nhận thao tác chạm, vuốt trực tiếp bằng ngón tay hoặc bút cảm ứng (chức năng vào).',
    realWorldExample:
      'Màn hình máy tính bảng, điện thoại thông minh, bảng tương tác thông minh trong lớp học.',
    specialNote:
      'Đây là thiết bị vừa vào vừa ra vì vừa hiển thị thông tin (ra) vừa nhận lệnh chạm tay (vào).',
    labPosition: { x: 73, y: 69 },
  },
  {
    id: 'headset',
    name: 'Tai nghe có micro',
    category: 'both',
    categoryLabel: 'Thiết bị vừa vào vừa ra',
    shortDesc: 'Vừa phát âm thanh ra tai nghe vừa thu giọng nói qua micro.',
    functionDesc:
      'Tích hợp hai bộ phận trong cùng một thiết bị: phần tai nghe phát âm thanh từ máy tính ra cho người đeo nghe (thiết bị ra) và phần micro thu giọng nói đưa vào máy tính (thiết bị vào).',
    realWorldExample:
      'Học ngoại ngữ giao tiếp, thảo luận nhóm trực tuyến trong phòng máy tính mà không gây ồn.',
    specialNote:
      'Tai nghe thông thường chỉ là thiết bị ra, nhưng tai nghe có gắn micro là thiết bị vừa vào vừa ra.',
    labPosition: { x: 64, y: 44 },
  },
];

export const LESSON1_SCENARIOS: QuizQuestion[] = [
  {
    id: 'l1-s1',
    lessonId: 'lesson1',
    question:
      'Bạn Lan muốn nhập một đoạn văn bản về chủ đề bảo vệ môi trường vào máy tính. Bạn Lan nên sử dụng thiết bị nào?',
    options: ['Loa', 'Bàn phím', 'Máy in', 'Màn hình'],
    correctIndex: 1,
    explanation:
      'Bàn phím là thiết bị vào chuyên dùng để nhập chữ cái, chữ số và các kí hiệu văn bản vào máy tính.',
  },
  {
    id: 'l1-s2',
    lessonId: 'lesson1',
    question:
      'Để vừa nghe cô giáo giảng bài trực tuyến vừa phát biểu ý kiến mà không làm ảnh hưởng người xung quanh, bạn Minh nên chọn thiết bị nào?',
    options: [
      'Máy quét',
      'Tai nghe có micro',
      'Máy in',
      'Màn hình thông thường',
    ],
    correctIndex: 1,
    explanation:
      'Tai nghe có micro là thiết bị vừa vào vừa ra: phần tai nghe giúp phát âm thanh (ra) và phần micro giúp thu giọng nói đưa vào máy tính (vào).',
  },
  {
    id: 'l1-s3',
    lessonId: 'lesson1',
    question:
      'Bạn Hùng có một bức tranh vẽ tay trên giấy và muốn đưa hình ảnh bức tranh đó vào máy tính để chỉnh sửa. Bạn Hùng nên dùng thiết bị nào?',
    options: ['Máy quét (Scanner)', 'Máy in', 'Loa', 'Chuột máy tính'],
    correctIndex: 0,
    explanation:
      'Máy quét (Scanner) là thiết bị vào có chức năng chuyển hình ảnh, tài liệu trên giấy thành tệp dữ liệu số đưa vào máy tính.',
  },
  {
    id: 'l1-s4',
    lessonId: 'lesson1',
    question:
      'Vì sao màn hình cảm ứng trên máy tính bảng được xếp vào nhóm thiết bị vừa vào vừa ra?',
    options: [
      'Vì màn hình có kích thước lớn và mỏng',
      'Vì màn hình vừa hiển thị thông tin vừa nhận thao tác chạm tay của người dùng',
      'Vì màn hình chỉ dùng để xem phim và nghe nhạc',
      'Vì màn hình có thể in tài liệu ra giấy',
    ],
    correctIndex: 1,
    explanation:
      'Màn hình cảm ứng vừa xuất thông tin hình ảnh ra (chức năng thiết bị ra), vừa nhận lệnh chạm, vuốt từ người dùng đưa vào máy tính (chức năng thiết bị vào).',
  },
  {
    id: 'l1-s5',
    lessonId: 'lesson1',
    question:
      'Sau khi hoàn thành bài trình bày trên máy tính, nhóm bạn An muốn có bản giấy để nộp cho cô giáo. Nhóm cần sử dụng thiết bị ra nào?',
    options: ['Webcam', 'Micro', 'Máy in', 'Bàn phím'],
    correctIndex: 2,
    explanation:
      'Máy in là thiết bị ra giúp xuất dữ liệu văn bản, hình ảnh từ máy tính ra trang giấy.',
  },
];
