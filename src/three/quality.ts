/**
 * Một chỗ duy nhất quyết định cảnh 3D chạy ở mức nào.
 *
 * Điện thoại vẫn dựng được WebGL, nhưng bê nguyên cấu hình desktop sang thì
 * nóng máy và tụt khung hình. Nên thay vì tắt hẳn, ta hạ từng thông số:
 * độ phân giải vẽ, kích thước lưới mô phỏng sóng, số hạt bụi.
 *
 * Đánh giá một lần rồi nhớ luôn — các thông số này không đổi giữa chừng,
 * mà gọi matchMedia mỗi khung hình thì phí.
 */
export type Quality = {
  /** Có dựng cảnh 3D hay không. */
  enabled: boolean
  mobile: boolean
  /** Giới hạn tỉ lệ điểm ảnh khi vẽ. */
  dpr: [number, number]
  /** Cạnh của lưới mô phỏng sóng nước. */
  simSize: number
  /** Số hạt bụi lơ lửng. */
  motes: number
  /** Khoảng cách máy quay lùi ra khỏi tâm cảnh. */
  camDistance: number
  /** Góc mở ống kính, độ. */
  fov: number
}

let cached: Quality | null = null

export function getQuality(): Quality {
  if (cached) return cached

  if (typeof window === 'undefined') {
    cached = {
      enabled: false,
      mobile: false,
      dpr: [1, 1.5],
      simSize: 256,
      motes: 320,
      camDistance: 8.2,
      fov: 48,
    }
    return cached
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile = window.matchMedia('(max-width: 767px)').matches
  const cores = navigator.hardwareConcurrency ?? 4

  cached = {
    // Chỉ tắt khi người dùng tự yêu cầu giảm chuyển động, hoặc máy quá yếu.
    // Ngưỡng lõi hạ xuống dưới 4 vì điện thoại tầm trung bây giờ đều có 6–8 lõi.
    enabled: !reduced && cores >= 4,
    mobile,
    dpr: mobile ? [1, 1.3] : [1, 1.8],
    simSize: mobile ? 128 : 256,
    motes: mobile ? 130 : 320,
    camDistance: mobile ? 12.5 : 8.2,
    fov: mobile ? 58 : 48,
  }

  return cached
}
