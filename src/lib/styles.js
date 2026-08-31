export const tabViewBaseStyle = {
  position: 'absolute',
  left: 'calc(126 * var(--u))',
  right: 'calc(37 * var(--u))',
  top: 'calc(94 * var(--u))',
  bottom: 'calc(26 * var(--u))',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
  backdropFilter: 'blur(calc(12 * var(--u))) saturate(110%)',
  WebkitBackdropFilter: 'blur(calc(12 * var(--u))) saturate(110%)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 'calc(26 * var(--u))',
  padding: 'calc(26 * var(--u))',
  overflowY: 'auto'
}

export const overviewLayoutStyle = {
  position: 'absolute',
  left: 'calc(126 * var(--u))',
  right: 'calc(396 * var(--u))',
  top: 'calc(136 * var(--u))',
  bottom: 'calc(99 * var(--u))',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 'calc(20 * var(--u))',
  pointerEvents: 'none'
}
