export const tabViewBaseStyle = {
  position: 'absolute',
  left: 'var(--tab-left, calc(126 * var(--u)))',
  right: 'var(--tab-right, calc(37 * var(--u)))',
  top: 'var(--tab-top, calc(94 * var(--u)))',
  bottom: 'var(--tab-bottom, calc(26 * var(--u)))',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
  backdropFilter: 'blur(calc(12 * var(--u))) saturate(110%)',
  WebkitBackdropFilter: 'blur(calc(12 * var(--u))) saturate(110%)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 'var(--tab-radius, calc(26 * var(--u)))',
  padding: 'var(--tab-padding, calc(26 * var(--u)))',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
}

export const overviewLayoutStyle = {
  position: 'absolute',
  left: 'var(--tab-left, calc(126 * var(--u)))',
  right: 'var(--tab-right, calc(396 * var(--u)))',
  top: 'var(--tab-top, calc(136 * var(--u)))',
  bottom: 'var(--tab-bottom, calc(99 * var(--u)))',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 'calc(20 * var(--u))',
  pointerEvents: 'none'
}

