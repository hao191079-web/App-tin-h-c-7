import { QuizQuestion, SoftwareItem } from '../types';

export const LESSON2_DEFINITION =
  'Phần mềm máy tính là chương trình máy tính giúp máy tính thực hiện những công việc nhất định.';

export const LESSON2_SOFTWARE_ITEMS: SoftwareItem[] = [
  {
    id: 'windows',
    name: 'Windows',
    category: 'system',
    categoryLabel: 'Phần mềm hệ thống',
    roleDesc:
      'Hệ điều hành phổ biến trên máy tính cá nhân, quản lí phần cứng, tệp tin và tạo môi trường để các phần mềm ứng dụng hoạt động.',
    exampleUse:
      'Khởi động máy tính, quản lí cửa sổ làm việc, kết nối máy in và chạy các phần mềm học tập.',
    accentColor: '#0284C7',
  },
  {
    id: 'linux',
    name: 'Linux',
    category: 'system',
    categoryLabel: 'Phần mềm hệ thống',
    roleDesc:
      'Hệ điều hành mã nguồn mở ổn định và bảo mật, điều khiển toàn bộ hoạt động của máy tính và phân phối tài nguyên cho các chương trình.',
    exampleUse:
      'Sử dụng trên nhiều máy tính học tập, máy chủ và hệ thống công nghệ thông tin.',
    accentColor: '#0F766E',
  },
  {
    id: 'android',
    name: 'Android',
    category: 'system',
    categoryLabel: 'Phần mềm hệ thống',
    roleDesc:
      'Hệ điều hành dành cho điện thoại thông minh và máy tính bảng, điều khiển màn hình cảm ứng, bộ nhớ và các ứng dụng di động.',
    exampleUse:
      'Quản lí cuộc gọi, kết nối Wi-Fi và chạy các ứng dụng học tập trên máy tính bảng.',
    accentColor: '#16A34A',
  },
  {
    id: 'word',
    name: 'Microsoft Word',
    category: 'application',
    categoryLabel: 'Phần mềm ứng dụng',
    roleDesc:
      'Phần mềm soạn thảo văn bản giúp tạo, chỉnh sửa, định dạng tài liệu học tập và báo cáo.',
    exampleUse: 'Viết bài thu hoạch, soạn đơn xin phép, làm phiếu bài tập Ngữ văn.',
    accentColor: '#2563EB',
  },
  {
    id: 'excel',
    name: 'Microsoft Excel',
    category: 'application',
    categoryLabel: 'Phần mềm ứng dụng',
    roleDesc:
      'Phần mềm bảng tính giúp nhập dữ liệu dạng bảng, tính toán tự động bằng công thức và vẽ biểu đồ.',
    exampleUse: 'Lập bảng điểm lớp học, thống kê chi tiêu hoặc vẽ biểu đồ số liệu.',
    accentColor: '#15803D',
  },
  {
    id: 'powerpoint',
    name: 'Microsoft PowerPoint',
    category: 'application',
    categoryLabel: 'Phần mềm ứng dụng',
    roleDesc:
      'Phần mềm trình chiếu giúp thiết kế các trang chiếu kết hợp chữ, hình ảnh, âm thanh để thuyết trình.',
    exampleUse: 'Tạo bài thuyết trình nhóm môn Tin học hoặc Lịch sử.',
    accentColor: '#EA580C',
  },
  {
    id: 'chrome',
    name: 'Google Chrome',
    category: 'application',
    categoryLabel: 'Phần mềm ứng dụng',
    roleDesc:
      'Trình duyệt web giúp người dùng truy cập Internet, tìm kiếm thông tin và xem học liệu trực tuyến.',
    exampleUse: 'Tra cứu kiến thức khoa học, học tập trên trang web giáo dục.',
    accentColor: '#0284C7',
  },
  {
    id: 'paint',
    name: 'Paint',
    category: 'application',
    categoryLabel: 'Phần mềm ứng dụng',
    roleDesc:
      'Phần mềm đồ họa đơn giản giúp vẽ tranh, tô màu và chỉnh sửa hình ảnh cơ bản trên máy tính.',
    exampleUse: 'Vẽ sơ đồ minh họa đơn giản hoặc cắt ghép hình ảnh cho bài học.',
    accentColor: '#7C3AED',
  },
];

export const LESSON2_SCENARIOS: QuizQuestion[] = [
  {
    id: 'l2-s1',
    lessonId: 'lesson2',
    question:
      'Khi máy tính khởi động, phần mềm nào có vai trò quản lí và điều khiển hoạt động của máy tính?',
    options: [
      'Microsoft Word',
      'Hệ điều hành (Phần mềm hệ thống)',
      'Paint',
      'Google Chrome',
    ],
    correctIndex: 1,
    explanation:
      'Hệ điều hành là phần mềm hệ thống quan trọng nhất, tự động chạy khi máy tính khởi động để quản lí phần cứng và điều khiển mọi hoạt động của máy tính.',
  },
  {
    id: 'l2-s2',
    lessonId: 'lesson2',
    question:
      'Nếu một máy tính mới lắp xong phần cứng nhưng chưa cài đặt phần mềm hệ thống (hệ điều hành), điều gì sẽ xảy ra?',
    options: [
      'Vẫn dùng được Microsoft Word bình thường',
      'Máy tính không thể hoạt động và không chạy được các phần mềm ứng dụng',
      'Chỉ vào được trình duyệt Google Chrome',
      'Tự động vẽ được tranh trên Paint',
    ],
    correctIndex: 1,
    explanation:
      'Phần mềm hệ thống tạo môi trường để các phần mềm ứng dụng hoạt động. Không có hệ điều hành, máy tính không thể điều khiển phần cứng và chạy ứng dụng.',
  },
  {
    id: 'l2-s3',
    lessonId: 'lesson2',
    question:
      'Bạn Nam muốn thiết kế bài thuyết trình có hình ảnh và hiệu ứng chuyển trang để trình bày trước lớp. Bạn Nam nên mở phần mềm ứng dụng nào?',
    options: ['Android', 'Linux', 'Microsoft PowerPoint', 'Windows'],
    correctIndex: 2,
    explanation:
      'Microsoft PowerPoint là phần mềm ứng dụng chuyên dùng để soạn thảo và trình chiếu các trang chiếu sinh động.',
  },
  {
    id: 'l2-s4',
    lessonId: 'lesson2',
    question:
      'Nhóm phần mềm nào sau đây chỉ gồm các phần mềm hệ thống?',
    options: [
      'Windows, Linux, Android',
      'Windows, Microsoft Word, Paint',
      'Google Chrome, Microsoft Excel, Linux',
      'Android, Microsoft PowerPoint, Paint',
    ],
    correctIndex: 0,
    explanation:
      'Windows, Linux và Android đều là các hệ điều hành (phần mềm hệ thống). Còn Word, Excel, PowerPoint, Chrome, Paint là phần mềm ứng dụng.',
  },
  {
    id: 'l2-s5',
    lessonId: 'lesson2',
    question:
      'Phát biểu nào sau đây mô tả đúng về vai trò của phần mềm ứng dụng?',
    options: [
      'Điều khiển trực tiếp nguồn điện của máy tính',
      'Hỗ trợ người dùng thực hiện những công việc cụ thể như soạn văn bản, vẽ tranh, tra cứu web',
      'Thay thế hoàn toàn bàn phím và chuột',
      'Chỉ dùng để khởi động máy tính bảng',
    ],
    correctIndex: 1,
    explanation:
      'Phần mềm ứng dụng được viết ra để hỗ trợ người dùng thực hiện các công việc cụ thể (học tập, soạn thảo, tính toán, giải trí...).',
  },
];
