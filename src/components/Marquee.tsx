import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Thời gian chạy hết một vòng, giây. Càng lớn càng chậm. */
  duration?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  className?: string
}

/**
 * Dải chạy vô hạn. Nội dung được nhân đôi rồi dịch -50% nên vòng lặp liền mạch.
 */
export function Marquee({
  children,
  duration = 30,
  direction = 'left',
  pauseOnHover = true,
  className = '',
}: Props) {
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div
        className="marquee-track"
        data-direction={direction}
        data-pause={pauseOnHover}
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
