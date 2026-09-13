/**
 * Lớp nhiễu phủ toàn trang cho đỡ "phẳng kiểu CSS".
 *
 * Blend mode phải đổi theo theme: multiply làm tối nên hợp nền sáng,
 * còn trên nền tối thì nó gần như biến mất — nền tối phải dùng screen.
 * Hai giá trị đó nằm trong biến --grain-blend ở index.css.
 *
 * z-20 để nhiễu nằm trên nội dung nhưng vẫn dưới thanh nav (z-50),
 * nếu đặt cao hơn thì nav bị phủ nhiễu và chữ mờ đi.
 */
export function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20"
      style={{
        mixBlendMode: 'var(--grain-blend)' as React.CSSProperties['mixBlendMode'],
        opacity: 'var(--grain-opacity)' as unknown as number,
      }}
      aria-hidden
    >
      <svg className="h-full w-full">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  )
}
