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
    slug: 'year-end-party-minh-phat',
    title: 'Year End Party — Tập đoàn Minh Phát',
    category: 'Tiệc cuối năm · 1.800 khách',
    year: '2026',
    image: img('event-yep'),
    client: 'Tập đoàn Minh Phát',
    venue: 'Trung tâm hội nghị, Quận 7',
    duration: '6 tuần chuẩn bị',
    summary:
      'Một đêm tổng kết cho 1.800 nhân sự trải khắp ba miền, phần lớn lần đầu gặp nhau ngoài màn hình. Yêu cầu của ban lãnh đạo gói gọn trong một câu: đừng làm lễ trao thưởng, hãy làm một đêm mà người ta muốn ở lại tới phút cuối.',
    scope: [
      'Kịch bản và đạo diễn chương trình',
      'Sân khấu trung tâm 24m kèm màn hình LED cong',
      'Dàn đèn và âm thanh cho hội trường 2.000 chỗ',
      'Điều phối nghệ sĩ khách mời',
      'Quay phim, chụp ảnh, dựng recap trong 5 ngày',
    ],
    gallery: [img('yep-1', 1200, 900), img('yep-2', 900, 1200), img('yep-3', 1200, 900)],
  },
  {
    slug: 'khanh-thanh-nha-may-long-an',
    title: 'Lễ khánh thành nhà máy Long An',
    category: 'Lễ khánh thành · Sân khấu ngoài trời',
    year: '2025',
    image: img('event-khanhthanh'),
    client: 'Nam Long Foods',
    venue: 'Khu công nghiệp Long An',
    duration: '9 tuần chuẩn bị',
    summary:
      'Lễ khánh thành ngoài trời giữa mùa mưa, có lãnh đạo tỉnh và hơn 400 khách mời. Toàn bộ phương án dự phòng thời tiết được chốt trước ba tuần và tổng duyệt hai lần trong điều kiện mưa giả định.',
    scope: [
      'Hồ sơ xin phép và làm việc với địa phương',
      'Sân khấu ngoài trời kèm mái che toàn phần',
      'Nghi thức cắt băng và trình chiếu tiến trình xây dựng',
      'Máy phát điện dự phòng và sàn thoát nước',
      'Đón tiếp, hậu cần cho đoàn khách cấp tỉnh',
    ],
    gallery: [
      img('kt-1', 1200, 900),
      img('kt-2', 900, 1200),
      img('kt-3', 1200, 900),
    ],
  },
  {
    slug: 'dai-nhac-hoi-thanh-am-mua-ha',
    title: 'Đại nhạc hội Thanh Âm Mùa Hạ',
    category: 'Lễ hội âm nhạc · 12.000 khán giả',
    year: '2025',
    image: img('event-nhachoi'),
    client: 'Thanh Âm Mùa Hạ',
    venue: 'Sân vận động ngoài trời',
    duration: '12 tuần chuẩn bị',
    summary:
      'Mười hai nghìn khán giả, tám nghệ sĩ, năm giờ chạy liên tục không nghỉ giữa chừng. Bài toán khó nhất không phải sân khấu mà là luồng di chuyển của đám đông và phương án dự phòng cho hệ thống âm thanh công suất lớn.',
    scope: [
      'Sân khấu chính 32m và hai cánh gà',
      'Hệ thống âm thanh công suất lớn kèm dàn dự phòng song song',
      'Dàn đèn và hiệu ứng theo từng tiết mục',
      'Điều phối nghệ sĩ và lịch chạy kỹ thuật',
      'Phối hợp an ninh và phân luồng khán giả',
    ],
    gallery: [
      img('nh-1', 1200, 900),
      img('nh-2', 900, 1200),
      img('nh-3', 1200, 900),
    ],
  },
  {
    slug: 'hoi-nghi-khach-hang-vietcare',
    title: 'Hội nghị khách hàng Vietcare',
    category: 'Hội nghị · Sân khấu LED cong',
    year: '2024',
    image: img('event-hoinghi'),
    client: 'Vietcare',
    venue: 'Khách sạn 5 sao, Quận 1',
    duration: '5 tuần chuẩn bị',
    summary:
      'Hội nghị thường niên cho 600 đại lý toàn quốc, trọng tâm là màn công bố dòng sản phẩm mới. Bản dựng 3D sân khấu được ban giám đốc duyệt ngay vòng đầu, rút ngắn khâu chốt thiết kế xuống còn một tuần.',
    scope: [
      'Thiết kế sân khấu LED cong kèm phối cảnh 3D',
      'Kịch bản công bố sản phẩm và hiệu ứng trình chiếu',
      'Khu trải nghiệm sản phẩm cho đại lý',
      'Âm thanh ánh sáng cho hội trường 700 chỗ',
      'Vận hành và điều phối trong ngày',
    ],
    gallery: [
      img('hn-1', 1200, 900),
      img('hn-2', 900, 1200),
      img('hn-3', 1200, 900),
    ],
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
    slug: 'dung-3d-san-khau-truoc-khi-thi-cong',
    title: 'Vì sao nên dựng 3D sân khấu trước khi thi công',
    date: '18.08.2026',
    readTime: '5 phút đọc',
    image: img('journal-3d', 1200, 800),
    author: 'Tạ Khoa',
    excerpt:
      'Một bản dựng 3D tốn hai ngày công có thể tiết kiệm cả tuần thi công và vài chục triệu tiền sửa sai. Đây là những gì nó giúp phát hiện sớm.',
    body: [
      {
        type: 'p',
        text: 'Khách thường hỏi vì sao phải mất thêm hai ngày dựng 3D trong khi bản vẽ mặt bằng đã có đủ kích thước. Câu trả lời ngắn: bản vẽ mặt bằng cho biết thứ gì nằm ở đâu, còn bản dựng 3D cho biết khán giả sẽ nhìn thấy gì.',
      },
      { type: 'h', text: 'Nó phát hiện sớm ba thứ' },
      {
        type: 'list',
        items: [
          'Góc chết. Chỗ nào khán giả bị cột hoặc giàn đèn che mất sân khấu, thấy ngay trên bản dựng thay vì thấy vào tối diễn.',
          'Tỉ lệ chữ trên màn LED. Tên thương hiệu trông vừa vặn trên màn hình máy tính nhưng nhỏ hơn nắm tay khi nhìn từ hàng ghế cuối.',
          'Đường đi của khách. Lối vào, khu check-in và quầy nước nếu nằm sai chỗ sẽ tạo nút thắt ngay mười lăm phút đầu.',
        ],
      },
      {
        type: 'quote',
        text: 'Sửa một chi tiết trên bản dựng mất mười lăm phút. Sửa đúng chi tiết đó khi giàn đã dựng mất nửa ngày và tiền thuê thiết bị vẫn tính đủ.',
      },
      { type: 'h', text: 'Nó rút ngắn khâu duyệt' },
      {
        type: 'p',
        text: 'Đây mới là lợi ích lớn nhất mà ít người nghĩ tới. Khi trình bày bằng bản vẽ kỹ thuật, mỗi người trong phòng họp hình dung một kiểu khác nhau, và tranh luận kéo dài vì không ai nói về cùng một thứ. Đưa ra bản dựng 3D thì cả phòng nhìn chung một hình ảnh, góp ý chuyển ngay từ mơ hồ sang cụ thể.',
      },
      {
        type: 'p',
        text: 'Ở hội nghị khách hàng gần nhất chúng tôi làm, ban giám đốc duyệt ngay vòng đầu. Khâu chốt thiết kế rút từ ba tuần xuống còn một, và toàn bộ thời gian tiết kiệm được dồn hết vào chạy kỹ thuật.',
      },
    ],
  },
  {
    slug: 'checklist-su-kien-ngoai-troi-mua-mua',
    title: 'Checklist chuẩn bị cho sự kiện ngoài trời mùa mưa',
    date: '02.07.2026',
    readTime: '8 phút đọc',
    image: img('journal-mua', 1200, 800),
    author: 'Tạ Khoa',
    excerpt:
      'Mưa không phải rủi ro bất ngờ ở Việt Nam, nó là điều kiện mặc định từ tháng năm tới tháng mười một. Kế hoạch phải viết theo hướng đó ngay từ đầu.',
    body: [
      {
        type: 'p',
        text: 'Sai lầm phổ biến nhất là coi mưa như tình huống phát sinh rồi mới tính phương án ứng phó. Ở miền Nam, từ tháng năm tới tháng mười một, mưa là điều kiện mặc định. Kế hoạch nên viết cho trời mưa, còn trời nắng thì coi như được thêm.',
      },
      { type: 'h', text: 'Bảy ngày trước' },
      {
        type: 'list',
        items: [
          'Theo dõi dự báo theo giờ, không phải theo ngày. Một cơn mưa lúc mười sáu giờ và một cơn lúc mười chín giờ đòi hỏi hai kịch bản hoàn toàn khác nhau.',
          'Chốt kịch bản rút gọn. Tiết mục nào cắt được, cắt theo thứ tự nào, ai là người ra quyết định cắt.',
          'Xác nhận lại số lượng bạt phủ thiết bị và vị trí cất giữ khi cần dùng gấp.',
        ],
      },
      { type: 'h', text: 'Ngày thi công' },
      {
        type: 'list',
        items: [
          'Sàn sân khấu phải cao hơn mặt đất tối thiểu 40cm và có rãnh thoát ở hai bên.',
          'Toàn bộ ổ điện nâng khỏi mặt đất, không đặt trực tiếp lên sàn dù có che.',
          'Mái che phải phủ quá mép sân khấu ít nhất một mét, vì mưa ở đây thường tạt ngang chứ không rơi thẳng.',
          'Máy phát điện đặt nơi cao ráo, có mái riêng, và thử tải đủ công suất trước khi khách tới.',
        ],
      },
      {
        type: 'quote',
        text: 'Lần gần nhất mưa ập xuống trước giờ khai mạc bốn mươi phút. Đội kỹ thuật che chắn xong trong hai mươi phút và chương trình vẫn bắt đầu đúng giờ. Khách mời không hề biết đã có chuyện gì.',
      },
      { type: 'h', text: 'Thứ hay bị quên' },
      {
        type: 'p',
        text: 'Lối đi của khách. Phần lớn kế hoạch chống mưa tập trung vào sân khấu và thiết bị, trong khi thứ quyết định trải nghiệm lại là quãng đường từ chỗ đậu xe tới chỗ ngồi. Không có mái che ở đoạn đó thì khách ướt từ trước khi chương trình bắt đầu, và mọi thứ sau đó đều bị nhìn qua tâm trạng ấy.',
      },
    ],
  },
  {
    slug: 'tinh-cong-suat-am-thanh-theo-so-khan-gia',
    title: 'Tính công suất âm thanh theo số lượng khán giả',
    date: '11.05.2026',
    readTime: '6 phút đọc',
    image: img('journal-amthanh', 1200, 800),
    author: 'Tạ Khoa',
    excerpt:
      'Không có công thức nào áp dụng được cho mọi trường hợp, nhưng có vài mốc tham chiếu giúp bạn biết báo giá mình nhận được là hợp lý hay đang thiếu.',
    body: [
      {
        type: 'p',
        text: 'Câu hỏi hay gặp nhất khi khách so sánh báo giá: vì sao cùng một sự kiện mà nơi này báo hai dàn loa, nơi kia báo sáu. Phần lớn chênh lệch không nằm ở chuyện ai đắt hơn, mà ở chỗ hai bên hiểu khác nhau về không gian.',
      },
      { type: 'h', text: 'Ba yếu tố quyết định, không phải một' },
      {
        type: 'list',
        items: [
          'Số lượng khán giả chỉ cho biết cần phủ âm tới đâu, không cho biết cần bao nhiêu công suất.',
          'Thể tích không gian mới là thứ quyết định. Một trăm khách trong hội trường trần cao sáu mét cần nhiều hơn ba trăm khách ngoài trời.',
          'Chất liệu bề mặt. Phòng nhiều kính và bê tông dội âm mạnh, cần xử lý khác hẳn phòng trải thảm có rèm.',
        ],
      },
      { type: 'h', text: 'Mốc tham chiếu nhanh' },
      {
        type: 'p',
        text: 'Với sự kiện trong nhà, trần dưới năm mét, nói chuyện và nhạc nền là chính: khoảng 3 tới 5 watt cho mỗi khách là đủ. Có ca nhạc sống thì tăng gấp đôi. Ngoài trời không có tường phản xạ, phải tính gấp ba tới bốn lần so với trong nhà cùng số khách.',
      },
      {
        type: 'quote',
        text: 'Con số quan trọng hơn công suất là độ phủ. Một dàn mạnh đặt sai chỗ khiến hàng đầu chói tai còn hàng cuối nghe không rõ.',
      },
      { type: 'h', text: 'Thứ nên hỏi khi nhận báo giá' },
      {
        type: 'p',
        text: 'Đừng hỏi tổng công suất bao nhiêu watt. Hãy hỏi có bao nhiêu điểm phát, đặt ở đâu, và có dàn dự phòng chạy song song hay không. Ba câu đó cho biết nhiều về chất lượng hơn mọi con số công suất ghi trên báo giá.',
      },
    ],
  },
]

export const socials = [
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
]
