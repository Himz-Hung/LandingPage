/**
 * Toàn bộ nội dung của trang nằm ở đây.
 * Muốn custom: sửa file này, không cần đụng vào component.
 * Ảnh đang dùng placeholder picsum — thay bằng đường dẫn ảnh của bạn (vd: '/images/su-kien-1.jpg').
 */

const img = (seed: string, w = 1400, h = 1000) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export const site = {
  name: 'Tạ Khoa',
  role: 'Công ty tổ chức sự kiện',
  email: 'xinchao@takhoa.vn',
  phone: '0900 123 456',
  location: 'TP. Hồ Chí Minh',
  timezone: 'GMT+7',
}

export const nav = [
  { label: 'Dự án', href: '#work' },
  { label: 'Tin tức', href: '#journal' },
  { label: 'Liên hệ', href: '#contact' },
]

export const hero = {
  greeting: 'Đang nhận lịch quý IV 2026',
  headline: 'Dựng nên những đêm mà khán giả còn nhắc mãi.',
  paragraph:
    'Chúng tôi lo trọn gói một sự kiện: từ ý tưởng, sân khấu, âm thanh ánh sáng cho tới đêm diễn thật. Mười hai năm, hơn sáu trăm chương trình đã sáng đèn đúng giờ.',
  ctaPrimary: { label: 'Nhận báo giá', href: '#contact' },
  ctaSecondary: { label: 'Xem dự án', href: '#work' },
  image: img('takhoa-stage', 1600, 1100),
}

export const marqueeWords = [
  'Sân khấu',
  'Âm thanh ánh sáng',
  'Màn hình LED',
  'Sự kiện doanh nghiệp',
  'Lễ khai trương',
  'Đại nhạc hội',
]

export const approach = {
  eyebrow: 'Quy trình',
  title: 'Từ tờ giấy trắng tới đêm sáng đèn.',
  steps: [
    {
      no: '01',
      title: 'Nghe brief & lên ý tưởng',
      body: 'Ngồi lại để hiểu bạn muốn khán giả nhớ điều gì. Kết thúc bước này bạn nhận được concept, kịch bản khung và dự toán sơ bộ — đủ rõ để trình lên cấp trên.',
      weight: 20,
    },
    {
      no: '02',
      title: 'Thiết kế & dựng phối cảnh 3D',
      body: 'Sân khấu, ánh sáng và đường đi của khán giả đều được dựng 3D trước. Bạn nhìn thấy đêm diễn trên màn hình trước khi chi một đồng thi công.',
      weight: 30,
    },
    {
      no: '03',
      title: 'Sản xuất & thi công',
      body: 'Đóng sân khấu, treo đèn, dựng LED, chạy kỹ thuật. Mọi thiết bị đều có phương án dự phòng và được tổng duyệt trước giờ G.',
      weight: 35,
    },
    {
      no: '04',
      title: 'Vận hành & hậu kỳ',
      body: 'Đạo diễn cầm nhịp suốt chương trình. Sau đêm diễn bạn nhận bộ ảnh, video recap và báo cáo tổng kết trong vòng một tuần.',
      weight: 15,
    },
  ],
}

export const works = [
  {
    title: 'Year End Party — Tập đoàn Minh Phát',
    category: 'Tiệc cuối năm · 1.800 khách',
    year: '2026',
    image: img('event-yep'),
  },
  {
    title: 'Lễ khánh thành nhà máy Long An',
    category: 'Lễ khánh thành · Sân khấu ngoài trời',
    year: '2025',
    image: img('event-khanhthanh'),
  },
  {
    title: 'Đại nhạc hội Thanh Âm Mùa Hạ',
    category: 'Lễ hội âm nhạc · 12.000 khán giả',
    year: '2025',
    image: img('event-nhachoi'),
  },
  {
    title: 'Hội nghị khách hàng Vietcare',
    category: 'Hội nghị · Sân khấu LED cong',
    year: '2024',
    image: img('event-hoinghi'),
  },
]

export const stats = [
  { value: 12, suffix: '+', label: 'Năm trong nghề' },
  { value: 640, suffix: '', label: 'Chương trình đã tổ chức' },
  { value: 1.2, suffix: ' triệu', label: 'Lượt khách tham dự' },
  { value: 100, suffix: '%', label: 'Sự kiện sáng đèn đúng giờ' },
]

export const services = {
  eyebrow: 'Dịch vụ',
  title: 'Những gì chúng tôi nhận làm.',
  items: [
    {
      no: '01',
      title: 'Sự kiện doanh nghiệp',
      body: 'Year end party, kỷ niệm thành lập, hội nghị khách hàng, lễ vinh danh nội bộ.',
      tags: ['Gala', 'Hội nghị', 'Team building'],
    },
    {
      no: '02',
      title: 'Lễ khai trương & khánh thành',
      body: 'Nghi thức, sân khấu ngoài trời, đón tiếp quan khách, làm việc với địa phương.',
      tags: ['Nghi thức', 'Ngoài trời', 'Giấy phép'],
    },
    {
      no: '03',
      title: 'Ra mắt sản phẩm',
      body: 'Kịch bản kể chuyện thương hiệu, hiệu ứng trình chiếu, khu trải nghiệm cho khách mời.',
      tags: ['Launching', 'Trình chiếu', 'Booth'],
    },
    {
      no: '04',
      title: 'Lễ hội âm nhạc',
      body: 'Sân khấu lớn, dàn đèn, hệ thống âm thanh công suất cao, điều phối nghệ sĩ.',
      tags: ['Line-up', 'Dàn đèn', 'An ninh'],
    },
    {
      no: '05',
      title: 'Kỹ thuật sân khấu',
      body: 'Cho thuê và vận hành âm thanh, ánh sáng, màn hình LED, truss, máy phát dự phòng.',
      tags: ['Âm thanh', 'Ánh sáng', 'LED'],
    },
  ],
}

export const testimonials = [
  {
    quote:
      'Mưa ập xuống trước giờ khai mạc bốn mươi phút. Đội kỹ thuật che chắn xong, chương trình vẫn bắt đầu đúng giờ. Khách mời không hề biết đã có chuyện gì.',
    name: 'Nguyễn Thị Lan Hương',
    title: 'Trưởng phòng Truyền thông, Tập đoàn Minh Phát',
    avatar: img('avatar-lanhuong', 200, 200),
  },
  {
    quote:
      'Bản dựng 3D giống đêm diễn thật tới mức ban giám đốc duyệt ngay vòng đầu. Đó là lần hiếm hoi chúng tôi không phải họp lại lần hai.',
    name: 'Trần Quốc Bảo',
    title: 'Giám đốc Marketing, Vietcare',
    avatar: img('avatar-quocbao', 200, 200),
  },
  {
    quote:
      'Mười hai nghìn khán giả, không một sự cố âm thanh. Khâu dự phòng của các bạn làm tôi yên tâm ngay từ buổi tổng duyệt.',
    name: 'Phạm Hoàng Nam',
    title: 'Nhà sản xuất, Thanh Âm Mùa Hạ',
    avatar: img('avatar-hoangnam', 200, 200),
  },
]

export const partners = {
  eyebrow: 'Đối tác',
  title: 'Những cái tên đã đồng hành.',
  body: 'Hơn 180 doanh nghiệp đã tin tưởng giao chương trình cho chúng tôi, nhiều nơi quay lại từ năm này qua năm khác.',
  /**
   * Đang để dạng chữ. Muốn dùng logo thật thì thêm trường logo: '/logos/ten.svg'
   * rồi đổi <span> thành <img> trong Partners.tsx.
   */
  logos: [
    'Minh Phát Group',
    'Vietcare',
    'Thanh Âm Mùa Hạ',
    'Đại Tín Bank',
    'Nam Long Foods',
    'Hải Đăng Logistics',
    'An Khang Pharma',
    'Trường Sơn Auto',
    'Bách Việt Tech',
    'Phú Mỹ Land',
    'Sao Mai Media',
    'Tân Hiệp Industrial',
  ],
  note: 'Khách quay lại sau chương trình đầu tiên',
  retention: 76,
}

export const gallery = {
  eyebrow: 'Hậu trường',
  title: 'Những giờ trước khi đèn sáng.',
  body: 'Dựng sân khấu, canh đèn, tổng duyệt. Phần khán giả không nhìn thấy nhưng quyết định cả đêm diễn.',
  images: [
    img('backstage-1', 900, 1200),
    img('backstage-2', 900, 700),
    img('backstage-3', 900, 1100),
    img('backstage-4', 900, 800),
  ],
}

export const pricing = {
  eyebrow: 'Báo giá',
  title: 'Gói tổ chức.',
  note: 'Mức giá tham khảo cho sự kiện trong nội thành. Chương trình ngoài tỉnh hoặc quy mô lớn sẽ được báo giá riêng sau khi khảo sát mặt bằng.',
  plans: [
    {
      name: 'Nội bộ',
      price: '180tr',
      period: '/ chương trình',
      body: 'Sự kiện trong nhà, quy mô dưới 300 khách.',
      features: [
        'Kịch bản và điều phối chương trình',
        'Sân khấu tiêu chuẩn kèm màn hình LED',
        'Âm thanh ánh sáng cơ bản',
        'MC và nhân sự hỗ trợ',
      ],
      featured: false,
    },
    {
      name: 'Trọn gói',
      price: '650tr',
      period: '/ chương trình',
      body: 'Sự kiện 500 tới 2.000 khách, trong nhà hoặc ngoài trời.',
      features: [
        'Toàn bộ gói Nội bộ',
        'Thiết kế sân khấu riêng kèm phối cảnh 3D',
        'Dàn đèn và âm thanh công suất lớn',
        'Quay phim, chụp ảnh, dựng video recap',
        'Phương án dự phòng thời tiết và điện',
      ],
      featured: true,
    },
    {
      name: 'Đồng hành năm',
      price: '2,4 tỷ',
      period: '/ năm',
      body: 'Cho doanh nghiệp có lịch sự kiện đều đặn quanh năm.',
      features: [
        'Trọn bộ sự kiện nội bộ trong năm',
        'Đội ngũ cố định, hiểu văn hoá công ty',
        'Kho thiết bị ưu tiên vào mùa cao điểm',
        'Báo cáo tổng kết theo quý',
      ],
      featured: false,
    },
  ],
}

export const faqs = [
  {
    q: 'Cần đặt trước bao lâu?',
    a: 'Sự kiện nội bộ nên đặt trước 4 đến 6 tuần. Chương trình ngoài trời hoặc quy mô lớn cần 8 đến 12 tuần vì còn khâu xin phép và đặt thiết bị. Mùa cao điểm cuối năm nên giữ chỗ sớm hơn.',
  },
  {
    q: 'Có nhận sự kiện ngoài TP.HCM không?',
    a: 'Có. Chúng tôi đã làm tại Hà Nội, Đà Nẵng, Long An, Bình Dương và nhiều tỉnh khác. Chi phí di chuyển và lưu trú của ê-kíp sẽ được ghi rõ trong báo giá, không phát sinh về sau.',
  },
  {
    q: 'Trời mưa thì xử lý thế nào?',
    a: 'Mọi sự kiện ngoài trời đều có phương án dự phòng ghi trong hợp đồng: mái che, bạt phủ thiết bị, sàn thoát nước và kịch bản rút gọn. Chúng tôi theo dõi dự báo từ trước bảy ngày.',
  },
  {
    q: 'Thiết bị hỏng giữa chương trình thì sao?',
    a: 'Âm thanh, ánh sáng và nguồn điện đều có thiết bị dự phòng đặt sẵn tại hiện trường, kèm máy phát điện riêng. Kỹ thuật viên trực suốt chương trình để đổi trong vòng vài phút.',
  },
  {
    q: 'Thanh toán theo tiến độ nào?',
    a: 'Tạm ứng 40% khi ký hợp đồng, 40% trước ngày thi công, 20% còn lại sau khi nghiệm thu. Xuất hoá đơn đầy đủ.',
  },
  {
    q: 'Có lo giấy phép tổ chức không?',
    a: 'Có. Chúng tôi chuẩn bị hồ sơ và làm việc với cơ quan quản lý cho các hạng mục cần cấp phép như biểu diễn nghệ thuật, sử dụng vỉa hè, pháo hoa kỹ thuật và an toàn phòng cháy.',
  },
]

export const journal = [
  {
    title: 'Vì sao nên dựng 3D sân khấu trước khi thi công',
    date: '18.08.2026',
    readTime: '5 phút đọc',
    image: img('journal-3d', 1200, 800),
  },
  {
    title: 'Checklist chuẩn bị cho sự kiện ngoài trời mùa mưa',
    date: '02.07.2026',
    readTime: '8 phút đọc',
    image: img('journal-mua', 1200, 800),
  },
  {
    title: 'Tính công suất âm thanh theo số lượng khán giả',
    date: '11.05.2026',
    readTime: '6 phút đọc',
    image: img('journal-amthanh', 1200, 800),
  },
]

export const socials = [
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
]
