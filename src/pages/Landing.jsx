import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'

/* ── useScrollReveal ──────────────────────────────────── */
function useScrollReveal(threshold = 0.08) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ── Shared style helpers ─────────────────────────────── */
const h2Style = {
  fontFamily: "'Inter Tight','Inter',sans-serif",
  fontWeight: 800,
  fontSize: 'clamp(28px, calc(40 * var(--u)), 52px)',
  letterSpacing: '0.02em',
  color: '#fff',
  lineHeight: 1.15,
  textAlign: 'center',
  marginBottom: 'calc(14 * var(--u))',
  margin: '0 auto calc(14 * var(--u))',
}
const subStyle = {
  fontSize: 'clamp(14px, calc(15.5 * var(--u)), 18px)',
  color: 'rgba(255,255,255,.52)',
  textAlign: 'center',
  lineHeight: 1.65,
  maxWidth: 'calc(560 * var(--u))',
  margin: '0 auto',
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'calc(16 * var(--u))' }}>
      <span style={{
        fontSize: 'clamp(10px, calc(11.5 * var(--u)), 13px)',
        fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,.42)',
        textTransform: 'uppercase',
        padding: 'calc(5 * var(--u)) calc(14 * var(--u))',
        border: '1px solid rgba(255,255,255,.12)',
        borderRadius: 'calc(20 * var(--u))',
        background: 'rgba(255,255,255,.05)',
      }}>{children}</span>
    </div>
  )
}

/* ── Farmer Logo ────────────────────────────────────────── */
function FarmerLogo({ size = 32 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '9px',
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.35) 0%, rgba(234, 179, 8, 0.28) 100%)',
      border: '1.5px solid rgba(250, 204, 21, 0.5)',
      boxShadow: '0 2px 10px rgba(34, 197, 94, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      backdropFilter: 'blur(8px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <svg viewBox="0 0 24 24" fill="none" style={{ width: size * 0.78, height: size * 0.78 }} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {/* Straw farmer hat (wide brim) */}
        <path d="M2 13.5 C4.5 12, 7.5 11, 12 11 C16.5 11, 19.5 12, 22 13.5" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M6 11.5 C6.5 6.5, 8.5 4.5, 12 4.5 C15.5 4.5, 17.5 6.5, 18 11.5" fill="rgba(250, 204, 21, 0.35)" stroke="#facc15" strokeWidth="1.8" />
        {/* Hat band ribbon */}
        <path d="M6.5 9.5 C8.5 8.5, 10 8, 12 8 C14 8, 15.5 8.5, 17.5 9.5" stroke="#22c55e" strokeWidth="1.6" />
        {/* Head / Farmer Face */}
        <circle cx="12" cy="14.2" r="2.6" stroke="#ffffff" fill="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        {/* Farmer Shirt & Neck */}
        <path d="M7.5 21.5 v-1.8 a3 3 0 0 1 3 -3 h3 a3 3 0 0 1 3 3 v1.8" stroke="#4ade80" strokeWidth="1.8" />
        {/* Small Golden Wheat Stalk / Sprout */}
        <path d="M12 16.5 v3.5 M10.5 18 c.9-.6 1.5-.3 1.5 0 M13.5 18 c-.9-.6-1.5-.3-1.5 0" stroke="#fef08a" strokeWidth="1.4" />
      </svg>
    </div>
  )
}

/* ── Logo ─────────────────────────────────────────────── */
function Logo({ size = 36 }) {
  return <FarmerLogo size={size} />
}

/* ═══════════════════════════════════════════════════════
   1. STICKY NAV
═══════════════════════════════════════════════════════ */
function StickyNav() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: 'calc(13 * var(--u)) calc(60 * var(--u))',
      /* Glassmorphism when scrolled */
      background: scrolled
        ? 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(4,16,28,0.55) 100%)'
        : 'transparent',
      backdropFilter: scrolled ? 'blur(28px) saturate(180%) brightness(0.9)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(180%) brightness(0.9)' : 'none',
      /* Top highlight line + bottom separator */
      borderTop: scrolled ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      /* Soft glow shadow */
      boxShadow: scrolled
        ? '0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)'
        : 'none',
      transition: 'background .4s ease, backdrop-filter .4s ease, border-color .4s ease, box-shadow .4s ease',
    }}>
      {/* Brand */}
      <button onClick={() => scrollTo('hero')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))', padding: 0 }}>
        <FarmerLogo size={32} />
        <span style={{ fontSize: 'clamp(15px, calc(17 * var(--u)), 20px)', fontWeight: 800, color: '#fff', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))' }}>
          KisanDarpan <span style={{ color: '#38bdf8', fontSize: '0.85em', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', padding: '1px 7px', borderRadius: '6px', fontWeight: 700 }}>AI</span>
        </span>
      </button>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(28 * var(--u))' }}>
        {[['Features', 'features'], ['How It Works', 'how-it-works'], ['Pricing', 'pricing'], ['FAQ', 'faq']].map(([label, id]) => (
          <button key={id} onClick={() => scrollTo(id)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.65)', fontSize: 'clamp(12px,calc(13 * var(--u)),15px)', fontWeight: 500, letterSpacing: '0.02em', cursor: 'pointer', fontFamily: 'inherit', padding: 0, transition: 'color .2s' }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.65)'}
          >{label}</button>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))' }}>
        <Link to="/login" style={{ color: 'rgba(255,255,255,.7)', fontSize: 'clamp(12px,calc(13 * var(--u)),15px)', fontWeight: 500, textDecoration: 'none', padding: 'calc(8 * var(--u)) calc(14 * var(--u))', transition: 'color .2s' }}
          onMouseEnter={e => e.target.style.color = '#fff'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.7)'}
        >Sign in</Link>
        <Link to="/register"
          className="rounded-2xl border-2 border-dashed border-black bg-white font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:rounded-md hover:shadow-[2px_2px_0px_black] active:translate-x-[0] active:translate-y-[0] active:rounded-2xl active:shadow-none no-underline inline-flex items-center justify-center"
          style={{ height: 'calc(36 * var(--u))', padding: '0 calc(18 * var(--u))', fontSize: 'clamp(11px,calc(12 * var(--u)),13.5px)', letterSpacing: '0.05em' }}
        >Get started free</Link>
      </div>
    </nav>
  )
}

/* ═══════════════════════════════════════════════════════
   2. HERO
═══════════════════════════════════════════════════════ */
function HeroSection() {
  const navigate = useNavigate()
  return (
    <section id="hero" style={{
      position: 'relative', height: '100dvh', minHeight: 600,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Video */}
      <video autoPlay loop muted playsInline style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center', zIndex: 0,
        filter: 'brightness(.88) contrast(1.04)',
      }}>
        <source src="/163560-828200792_medium.mp4" type="video/mp4" />
        <source src="/assets/rice-field.webm" type="video/webm" />
      </video>

      {/* Vignette */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: `
          linear-gradient(105deg,rgba(4,16,24,.82) 0%,rgba(4,16,24,.55) 45%,rgba(4,16,24,.22) 82%,rgba(4,16,24,.40) 100%),
          linear-gradient(180deg,rgba(4,16,24,.45) 0%,transparent 20%),
          linear-gradient(0deg,rgba(4,16,24,.88) 0%,transparent 55%)
        `,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10,
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'calc(80 * var(--u)) calc(80 * var(--u)) calc(20 * var(--u))',
        maxWidth: 'calc(860 * var(--u))',
      }}>
        {/* Badge */}
        <div className="anim-chip sheen" style={{
          display: 'inline-flex', alignItems: 'center',
          height: 'calc(34 * var(--u))', borderRadius: 'calc(17 * var(--u))',
          padding: '0 calc(15 * var(--u))',
          background: 'rgba(255,255,255,.18)',
          backdropFilter: 'blur(calc(16 * var(--u))) saturate(115%)',
          WebkitBackdropFilter: 'blur(calc(16 * var(--u))) saturate(115%)',
          fontSize: 'clamp(11.5px,calc(12.5 * var(--u)),14.5px)',
          fontWeight: 600, letterSpacing: '0.08em',
          color: 'rgba(255,255,255,.94)', textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          alignSelf: 'flex-start', position: 'relative', overflow: 'hidden',
          marginBottom: 'calc(22 * var(--u))',
        }}>✦ &nbsp; Real-time Weather Intelligence Platform</div>

        {/* H1 */}
        <h1 style={{
          fontFamily: "'Inter Tight','Inter',sans-serif", fontWeight: 800,
          fontSize: 'clamp(44px,calc(72 * var(--u)),92px)', lineHeight: 1.1, letterSpacing: '0.04em',
          color: '#fff', textShadow: '0 3px 20px rgba(0,0,0,0.7),0 1px 3px rgba(0,0,0,0.9)',
          overflow: 'hidden', marginBottom: 'calc(22 * var(--u))',
        }}>
          {[{ text: 'Precision weather,', d: '.54s' }, { text: 'beautifully', d: '.66s' }, { text: 'delivered.', d: '.78s' }].map(({ text, d }) => (
            <span key={text} style={{ display: 'block', overflow: 'hidden' }}>
              <span style={{ display: 'block', animation: `lineUp 1.05s cubic-bezier(.16,1,.3,1) ${d} both` }}>{text}</span>
            </span>
          ))}
        </h1>

        {/* Sub */}
        <p className="anim-blurb" style={{
          fontSize: 'clamp(15px,calc(16.5 * var(--u)),20px)', lineHeight: 1.65, fontWeight: 450, letterSpacing: '0.035em',
          color: 'rgba(255,255,255,.88)', textShadow: '0 2px 12px rgba(0,0,0,0.8),0 1px 2px rgba(0,0,0,0.9)',
          maxWidth: 'calc(560 * var(--u))', marginBottom: 'calc(34 * var(--u))',
        }}>
          Hyper-local forecasts, live radar, severe weather alerts, and AI-driven
          climate insights — all wrapped in one stunning dashboard.
        </p>

        {/* CTAs */}
        <div className="anim-place" style={{ display: 'flex', gap: 'calc(12 * var(--u))', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'calc(40 * var(--u))' }}>
          <button onClick={() => navigate('/register')}
            className="rounded-2xl border-2 border-dashed border-black bg-white font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer flex items-center justify-center flex-shrink-0"
            style={{ height: 'calc(52 * var(--u))', padding: '0 calc(30 * var(--u))', fontSize: 'calc(13.5 * var(--u))', letterSpacing: 'calc(.6 * var(--u))', gap: 'calc(10 * var(--u))', fontFamily: 'inherit' }}>
            <span>Get started free</span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ width: 'calc(13 * var(--u))', height: 'calc(13 * var(--u))' }}>
              <line x1="2" y1="8" x2="14" y2="8" /><polyline points="9,3 14,8 9,13" />
            </svg>
          </button>
          <button onClick={() => navigate('/dashboard')}
            className="rounded-2xl border-2 border-dashed border-white/80 bg-white/10 font-semibold uppercase text-white backdrop-blur-md transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:bg-white/20 hover:border-white hover:shadow-[4px_4px_0px_rgba(255,255,255,0.85)] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer flex items-center justify-center flex-shrink-0"
            style={{ height: 'calc(52 * var(--u))', padding: '0 calc(28 * var(--u))', fontSize: 'calc(13.5 * var(--u))', letterSpacing: 'calc(.6 * var(--u))', gap: 'calc(10 * var(--u))', fontFamily: 'inherit' }}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 'calc(13 * var(--u))', height: 'calc(13 * var(--u))' }}>
              <polygon points="5,3 13,8 5,13" />
            </svg>
            <span>View live demo</span>
          </button>
        </div>

        {/* Stats */}
        <div className="anim-bigtemp" style={{ display: 'flex', gap: 'calc(36 * var(--u))', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {[['1K+', 'Active Users'], ['25', 'Blocks Covered'], ['120+', 'Panchayats Mapped'], ['< 1s', 'Avg Latency']].map(([n, l]) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 'calc(3 * var(--u))' }}>
              <span style={{ fontSize: 'clamp(26px,calc(30 * var(--u)),36px)', fontWeight: 800, color: '#fff', letterSpacing: '0.04em', lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>{n}</span>
              <span style={{ fontSize: 'clamp(11px,calc(12 * var(--u)),14px)', fontWeight: 500, color: 'rgba(255,255,255,.65)', letterSpacing: '0.08em', textTransform: 'uppercase', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll arrow */}
      <div style={{
        position: 'absolute', bottom: 'calc(32 * var(--u))', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'calc(4 * var(--u))', zIndex: 10,
        animation: 'riseIn 1s ease 2.2s both',
        cursor: 'pointer',
      }} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
        <span style={{ fontSize: 'calc(9 * var(--u))', fontWeight: 600, letterSpacing: '0.16em', color: 'rgba(255,255,255,.32)', textTransform: 'uppercase' }}>Explore</span>
        <svg
          viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ width: 'calc(22 * var(--u))', height: 'calc(22 * var(--u))', animation: 'arrowBounce 1.8s ease-in-out infinite' }}
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
        <svg
          viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ width: 'calc(22 * var(--u))', height: 'calc(22 * var(--u))', marginTop: 'calc(-10 * var(--u))', animation: 'arrowBounce 1.8s ease-in-out infinite .18s' }}
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   3. HOW IT WORKS
═══════════════════════════════════════════════════════ */
const HOW_STEPS = [
  {
    num: '01', title: 'Search your location',
    desc: 'Type any block or panchayat, pin a point on the map, or let KisanDarpan AI auto-detect your location in seconds.',
    icon: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: '100%', height: '100%' }}><circle cx="18" cy="18" r="10" /><line x1="25" y1="25" x2="34" y2="34" /><line x1="18" y1="12" x2="18" y2="24" strokeWidth="1.4" opacity=".5" /><line x1="12" y1="18" x2="24" y2="18" strokeWidth="1.4" opacity=".5" /></svg>,
  },
  {
    num: '02', title: 'Get your hyper-local forecast',
    desc: 'Instant hourly, daily, and micro-grid forecasts powered by WRF 9km input downscaled to 1 km² by AI.',
    icon: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: '100%', height: '100%' }}><circle cx="20" cy="16" r="6" /><path d="M8 32c0-6 5-11 12-11s12 5 12 11" opacity=".4" /><path d="M7 20h4M29 20h4M20 7V4M12 12l-2-2M28 12l2-2" strokeWidth="1.5" opacity=".55" /></svg>,
  },
  {
    num: '03', title: 'Set smart weather alerts',
    desc: 'Get push, email, or SMS notifications for storms, floods, high winds, or any custom threshold.',
    icon: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: '100%', height: '100%' }}><path d="M20 6a10 10 0 0 1 10 10c0 10-10 18-10 18S10 26 10 16a10 10 0 0 1 10-10z" opacity=".5" /><circle cx="20" cy="16" r="3.5" /><path d="M20 30v4M16 34h8" strokeWidth="1.5" /></svg>,
  },
]

function HowItWorksCard({ step, i, visible }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', zIndex: 1,
        background: hov
          ? 'linear-gradient(160deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,.10) 100%)'
          : 'linear-gradient(160deg,rgba(255,255,255,.10) 0%,rgba(255,255,255,.055) 100%)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: hov ? '2px solid rgba(255,255,255,.85)' : '2px dashed rgba(255,255,255,.15)',
        borderRadius: hov ? 'calc(12 * var(--u))' : 'calc(20 * var(--u))',
        padding: 'calc(30 * var(--u)) calc(26 * var(--u))',
        display: 'flex', flexDirection: 'column', gap: 'calc(16 * var(--u))',
        opacity: visible ? 1 : 0,
        transform: hov ? 'translate(-4px, -4px)' : visible ? 'none' : 'translateY(24px)',
        boxShadow: hov ? '4px 4px 0px rgba(255, 255, 255, 0.85)' : 'none',
        transition: `background .3s, border-color .3s, border-radius .3s, transform .3s, box-shadow .3s, opacity .6s ease ${i * .12}s`,
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(14 * var(--u))' }}>
        <div style={{
          width: 'calc(44 * var(--u))', height: 'calc(44 * var(--u))',
          borderRadius: 'calc(12 * var(--u))',
          background: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.16)',
          color: 'rgba(255,255,255,.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'calc(9 * var(--u))',
        }}>{step.icon}</div>
        <span style={{ fontSize: 'clamp(28px,calc(36 * var(--u)),46px)', fontWeight: 800, color: 'rgba(255,255,255,.10)', letterSpacing: '-0.02em', lineHeight: 1 }}>{step.num}</span>
      </div>
      <div style={{ fontSize: 'clamp(13.5px,calc(15.5 * var(--u)),18px)', fontWeight: 700, color: '#fff' }}>{step.title}</div>
      <div style={{ fontSize: 'clamp(12px,calc(13 * var(--u)),15px)', color: 'rgba(255,255,255,.58)', lineHeight: 1.68 }}>{step.desc}</div>
    </div>
  )
}

function HowItWorksSection() {
  const [ref, visible] = useScrollReveal()
  return (
    <section id="how-it-works" ref={ref} style={{
      padding: 'calc(96 * var(--u)) calc(80 * var(--u))',
      opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(32px)',
      transition: 'opacity .75s ease, transform .75s ease',
    }}>
      <SectionLabel>How it works</SectionLabel>
      <h2 style={h2Style}>Three steps to weather mastery</h2>
      <p style={{ ...subStyle, marginBottom: 'calc(56 * var(--u))' }}>From sign-up to your first alert in under two minutes.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'calc(24 * var(--u))', position: 'relative' }}>
        {/* Connector */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 'calc(34 * var(--u))',
          left: 'calc(16.66%)', right: 'calc(16.66%)',
          height: 1,
          background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.15) 20%,rgba(255,255,255,.15) 80%,transparent)',
          pointerEvents: 'none',
        }} />

        {HOW_STEPS.map((step, i) => (
          <HowItWorksCard key={step.num} step={step} i={i} visible={visible} />
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   5. FEATURES
═══════════════════════════════════════════════════════ */

/* ── Feature SVG Icons ────────────────────────────────── */
const S = { stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }

const FeatureIcons = {
  radar: (
    <svg viewBox="0 0 28 28" {...S} style={{ width: '100%', height: '100%' }}>
      <circle cx="14" cy="14" r="2.5" fill="currentColor" opacity=".9" />
      <path d="M14 14 L24 6" opacity=".7" />
      <circle cx="14" cy="14" r="6" opacity=".45" />
      <circle cx="14" cy="14" r="10.5" opacity=".22" />
      <path d="M5 23 A13 13 0 0 1 14 1" opacity=".35" strokeDasharray="2.5 3" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 28 28" {...S} style={{ width: '100%', height: '100%' }}>
      <path d="M14 2C10.13 2 7 5.13 7 9c0 5.25 7 15 7 15s7-9.75 7-15c0-3.87-3.13-7-7-7z" />
      <circle cx="14" cy="9" r="2.5" />
      <ellipse cx="14" cy="24.5" rx="4" ry="1.2" opacity=".28" fill="currentColor" stroke="none" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 28 28" {...S} style={{ width: '100%', height: '100%' }}>
      <path d="M11.5 4.5 A3 3 0 0 1 16.5 4.5 C19 9 22 13 23 18 H5 C6 13 9 9 11.5 4.5z" />
      <line x1="14" y1="11" x2="14" y2="15.5" />
      <circle cx="14" cy="18" r="0.8" fill="currentColor" stroke="none" />
      <path d="M11 21 a3 3 0 0 0 6 0" opacity=".6" />
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 28 28" {...S} style={{ width: '100%', height: '100%' }}>
      <path d="M10 8 C7 8 5 10 5 13 C5 15 6 16.5 8 17" />
      <path d="M18 8 C21 8 23 10 23 13 C23 15 22 16.5 20 17" />
      <path d="M10 8 C10 5.5 11.5 4 14 4 C16.5 4 18 5.5 18 8" />
      <path d="M8 17 C8 20.5 10.5 23 14 23 C17.5 23 20 20.5 20 17" />
      <line x1="14" y1="4" x2="14" y2="23" opacity=".3" />
      <circle cx="14" cy="13.5" r="2" fill="currentColor" opacity=".7" stroke="none" />
      <line x1="9" y1="13" x2="11.8" y2="13" opacity=".5" />
      <line x1="16.2" y1="13" x2="19" y2="13" opacity=".5" />
    </svg>
  ),
  devices: (
    <svg viewBox="0 0 28 28" {...S} style={{ width: '100%', height: '100%' }}>
      <rect x="2" y="6" width="17" height="12" rx="2" />
      <line x1="10.5" y1="18" x2="10.5" y2="21" />
      <line x1="7" y1="21" x2="14" y2="21" />
      <rect x="20" y="10" width="6" height="10" rx="1.5" />
      <line x1="23" y1="19" x2="23" y2="20.5" opacity=".5" />
    </svg>
  ),
  api: (
    <svg viewBox="0 0 28 28" {...S} style={{ width: '100%', height: '100%' }}>
      <polyline points="10,9 5,14 10,19" />
      <polyline points="18,9 23,14 18,19" />
      <line x1="15" y1="7" x2="13" y2="21" opacity=".55" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 28 28" {...S} style={{ width: '100%', height: '100%' }}>
      <path d="M6 22 C6 22 8 10 20 5 C20 5 22 15 14 20" />
      <path d="M6 22 L14 20" opacity=".7" />
      <path d="M12 13 C12 13 14 16 14 20" opacity=".45" />
      <circle cx="19" cy="21" r="2.5" opacity=".6" />
      <path d="M17 23 C17 23 16 24.5 14.5 24.5" opacity=".45" />
    </svg>
  ),
  lightning: (
    <svg viewBox="0 0 28 28" {...S} style={{ width: '100%', height: '100%' }}>
      <polygon points="16,3 8,16 13,16 12,25 20,12 15,12" fill="currentColor" opacity=".15" />
      <polyline points="16,3 8,16 13,16 12,25 20,12 15,12 16,3" />
      <circle cx="22" cy="6" r="1.5" opacity=".45" fill="currentColor" stroke="none" />
      <circle cx="6" cy="20" r="1" opacity=".3" fill="currentColor" stroke="none" />
    </svg>
  ),
  wind: (
    <svg viewBox="0 0 28 28" {...S} style={{ width: '100%', height: '100%' }}>
      <path d="M4 9 H18 A3 3 0 1 0 18 3" />
      <path d="M4 14 H22 A3 3 0 1 0 22 20" />
      <path d="M4 19 H14 A2.5 2.5 0 1 0 14 24" opacity=".6" />
    </svg>
  ),
}

const FEATURES = [
  { iconKey: 'radar',    title: 'Live Radar',           desc: 'Real-time precipitation maps refreshed every 2 minutes from satellite and Doppler feeds.' },
  { iconKey: 'pin',      title: 'Hyper-local Forecast', desc: 'Street-level accuracy from 50,000+ IoT sensors and AI spatial interpolation.' },
  { iconKey: 'alert',    title: 'Severe Alerts',        desc: 'Push, email, and SMS alerts for storms, floods, heat waves, fog, and lightning.' },
  { iconKey: 'brain',    title: 'AI Insights',          desc: 'ML models that learn your location\'s micro-climate patterns and predict anomalies.' },
  { iconKey: 'devices',  title: 'Any Device',           desc: 'Pixel-perfect responsive design across desktop, tablet, and mobile.' },
  { iconKey: 'api',      title: 'Developer API',        desc: 'RESTful + WebSocket API with 99.9% SLA. Integrate weather into any stack.' },
  { iconKey: 'leaf',     title: 'Agriculture Mode',     desc: 'Evapotranspiration, soil moisture, crop risk index — built for farmers.' },
  { iconKey: 'lightning',title: 'Lightning Tracker',    desc: 'Real-time lightning strikes on interactive map with 5 km radius alerts.' },
  { iconKey: 'wind',     title: 'Air Quality Index',    desc: 'PM2.5, PM10, CO₂, ozone — the complete atmospheric picture, side by side.' },
]

function GlassFeatureCard({ f, i, visible }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov
          ? 'linear-gradient(160deg,rgba(255,255,255,.14) 0%,rgba(255,255,255,.08) 100%)'
          : 'linear-gradient(160deg,rgba(255,255,255,.08) 0%,rgba(255,255,255,.04) 100%)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: hov ? '2px solid rgba(255,255,255,.85)' : '2px dashed rgba(255,255,255,.12)',
        borderRadius: hov ? 'calc(10 * var(--u))' : 'calc(16 * var(--u))',
        padding: 'calc(24 * var(--u)) calc(22 * var(--u))',
        display: 'flex', flexDirection: 'column', gap: 'calc(14 * var(--u))',
        opacity: visible ? 1 : 0,
        transform: hov ? 'translate(-4px, -4px)' : visible ? 'none' : 'translateY(20px)',
        boxShadow: hov ? '4px 4px 0px rgba(255, 255, 255, 0.85)' : 'none',
        transition: `background .3s, border-color .3s, border-radius .3s, transform .3s, box-shadow .3s, opacity .55s ease ${i * .07}s`,
      }}>
      {/* Icon box */}
      <div style={{
        width: 'calc(42 * var(--u))', height: 'calc(42 * var(--u))',
        borderRadius: 'calc(10 * var(--u))',
        background: hov ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.08)',
        border: hov ? '1px solid rgba(255,255,255,.3)' : '1px solid rgba(255,255,255,.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'calc(9 * var(--u))',
        color: 'rgba(255,255,255,.88)',
        transition: 'background .3s, border-color .3s',
        flexShrink: 0,
      }}>
        {FeatureIcons[f.iconKey]}
      </div>
      <div style={{ fontSize: 'clamp(13px,calc(14.5 * var(--u)),16.5px)', fontWeight: 700, color: '#fff', letterSpacing: '0.025em' }}>{f.title}</div>
      <div style={{ fontSize: 'clamp(11.5px,calc(12.5 * var(--u)),14px)', color: 'rgba(255,255,255,.55)', lineHeight: 1.68 }}>{f.desc}</div>
    </div>
  )
}

function FeaturesSection() {
  const [ref, visible] = useScrollReveal()
  return (
    <section id="features" ref={ref} style={{
      padding: 'calc(96 * var(--u)) calc(80 * var(--u))',
      background: 'linear-gradient(180deg,rgba(255,255,255,.025) 0%,transparent 100%)',
      opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(32px)',
      transition: 'opacity .75s ease, transform .75s ease',
    }}>
      <SectionLabel>Features</SectionLabel>
      <h2 style={h2Style}>Everything your team needs</h2>
      <p style={{ ...subStyle, marginBottom: 'calc(52 * var(--u))' }}>From casual checking to enterprise-grade climate intelligence.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'calc(14 * var(--u))' }}>
        {FEATURES.map((f, i) => <GlassFeatureCard key={f.title} f={f} i={i} visible={visible} />)}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   6. DASHBOARD PREVIEW
═══════════════════════════════════════════════════════ */
function PreviewSection() {
  const [ref, visible] = useScrollReveal()
  return (
    <section ref={ref} style={{
      padding: 'calc(96 * var(--u)) calc(80 * var(--u))',
      textAlign: 'center',
      opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(32px)',
      transition: 'opacity .8s ease, transform .8s ease',
    }}>
      <SectionLabel>Product</SectionLabel>
      <h2 style={h2Style}>See KisanDarpan AI in action</h2>
      <p style={{ ...subStyle, marginBottom: 'calc(52 * var(--u))' }}>A single unified dashboard — weather, radar, alerts, and AI insights at a glance.</p>

      {/* Mock dashboard */}
      <div style={{
        position: 'relative', maxWidth: 'calc(960 * var(--u))', margin: '0 auto',
        borderRadius: 'calc(22 * var(--u))', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,.12)',
        boxShadow: '0 0 0 1px rgba(255,255,255,.05), 0 32px 80px rgba(0,0,0,.65), 0 0 120px rgba(99,179,237,.05)',
      }}>
        {/* Browser chrome */}
        <div style={{ background: 'rgba(255,255,255,.07)', backdropFilter: 'blur(20px)', padding: 'calc(12 * var(--u)) calc(18 * var(--u))', display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 'calc(10 * var(--u))', height: 'calc(10 * var(--u))', borderRadius: '50%', background: c }} />)}
          <div style={{ flex: 1, height: 'calc(22 * var(--u))', background: 'rgba(255,255,255,.08)', borderRadius: 'calc(6 * var(--u))', marginLeft: 'calc(8 * var(--u))', display: 'flex', alignItems: 'center', paddingLeft: 'calc(10 * var(--u))' }}>
            <span style={{ fontSize: 'calc(10 * var(--u))', color: 'rgba(255,255,255,.32)' }}>kisandarpan.ai/dashboard</span>
          </div>
        </div>

        {/* Dashboard body */}
        <div style={{ background: 'linear-gradient(135deg,#04121b 0%,#061e2e 50%,#04121b 100%)', padding: 'calc(20 * var(--u))', display: 'grid', gridTemplateColumns: 'calc(175 * var(--u)) 1fr calc(155 * var(--u))', gap: 'calc(14 * var(--u))', minHeight: 'calc(370 * var(--u))' }}>

          {/* Sidebar */}
          <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 'calc(14 * var(--u))', padding: 'calc(16 * var(--u)) calc(12 * var(--u))', display: 'flex', flexDirection: 'column', gap: 'calc(6 * var(--u))' }}>
            {['🏠 Home', '🗺️ Radar', '📍 Locations', '⚠️ Alerts', '📊 Analytics', '⚙️ Settings'].map(item => (
              <div key={item} style={{ padding: 'calc(7 * var(--u)) calc(9 * var(--u))', borderRadius: 'calc(8 * var(--u))', background: item.startsWith('🏠') ? 'rgba(255,255,255,.12)' : 'transparent', fontSize: 'calc(10.5 * var(--u))', color: item.startsWith('🏠') ? '#fff' : 'rgba(255,255,255,.4)' }}>{item}</div>
            ))}
          </div>

          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(12 * var(--u))' }}>
            <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 'calc(14 * var(--u))', padding: 'calc(18 * var(--u))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,.45)', marginBottom: 3 }}>New Delhi, India</div>
                <div style={{ fontSize: 'calc(46 * var(--u))', fontWeight: 800, color: '#fff', lineHeight: 1 }}>28°</div>
                <div style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,.50)', marginTop: 4 }}>Partly cloudy · Feels like 31°</div>
              </div>
              <div style={{ fontSize: 'calc(56 * var(--u))' }}>⛅</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 'calc(14 * var(--u))', padding: 'calc(14 * var(--u)) calc(16 * var(--u))' }}>
              <div style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,.38)', marginBottom: 'calc(10 * var(--u))', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hourly Forecast</div>
              <div style={{ display: 'flex', gap: 'calc(8 * var(--u))' }}>
                {[['Now', '28°', '⛅'], ['3pm', '30°', '☀️'], ['6pm', '27°', '🌤️'], ['9pm', '24°', '🌙'], ['12am', '22°', '⭐']].map(([t, temp, icon]) => (
                  <div key={t} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: 'calc(7 * var(--u)) calc(9 * var(--u))', background: t === 'Now' ? 'rgba(255,255,255,.12)' : 'transparent', borderRadius: 'calc(8 * var(--u))' }}>
                    <div style={{ fontSize: 'calc(8.5 * var(--u))', color: 'rgba(255,255,255,.4)' }}>{t}</div>
                    <div style={{ fontSize: 'calc(13 * var(--u))' }}>{icon}</div>
                    <div style={{ fontSize: 'calc(10.5 * var(--u))', fontWeight: 600, color: '#fff' }}>{temp}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 'calc(14 * var(--u))', padding: 'calc(12 * var(--u)) calc(14 * var(--u))', display: 'flex', flexDirection: 'column', gap: 'calc(8 * var(--u))' }}>
              {[['Mon', '☀️', '32°', '24°'], ['Tue', '⛅', '29°', '21°'], ['Wed', '🌧️', '24°', '18°']].map(([d, icon, h, l]) => (
                <div key={d} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'calc(9.5 * var(--u))', color: 'rgba(255,255,255,.45)', width: 28 }}>{d}</span>
                  <span style={{ fontSize: 'calc(12 * var(--u))' }}>{icon}</span>
                  <span style={{ fontSize: 'calc(10.5 * var(--u))', color: '#fff', fontWeight: 600 }}>{h}</span>
                  <span style={{ fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,.35)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right rail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(12 * var(--u))' }}>
            {[{ label: 'UV Index', value: '7', sub: 'High', icon: '☀️' }, { label: 'Humidity', value: '65%', sub: 'Moderate', icon: '💧' }, { label: 'Wind', value: '18 km/h', sub: 'SW', icon: '🌬️' }, { label: 'Visibility', value: '9 km', sub: 'Good', icon: '👁️' }].map(({ label, value, sub, icon }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,.07)', borderRadius: 'calc(12 * var(--u))', padding: 'calc(11 * var(--u))' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 'calc(8.5 * var(--u))', color: 'rgba(255,255,255,.38)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                  <span style={{ fontSize: 'calc(11 * var(--u))' }}>{icon}</span>
                </div>
                <div style={{ fontSize: 'calc(17 * var(--u))', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{value}</div>
                <div style={{ fontSize: 'calc(8.5 * var(--u))', color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   7. PRICING
═══════════════════════════════════════════════════════ */
const PLANS = [
  {
    name: 'Free', price: '₹0', period: 'forever',
    desc: 'Perfect for individuals checking the weather.',
    features: ['5 saved locations', 'Hourly + 7-day forecast', 'Basic radar', 'Email alerts', null, null],
    cta: 'Start for free', primary: false,
  },
  {
    name: 'Pro', price: '₹299', period: 'per month', badge: 'Most popular',
    desc: 'For power users who need precision data.',
    features: ['Unlimited locations', '15-day forecast', 'Live radar + lightning', 'Push + SMS alerts', 'AI climate insights', 'API (10k calls/mo)'],
    cta: 'Start Pro trial', primary: true,
  },
  {
    name: 'Enterprise', price: 'Custom', period: 'contact us',
    desc: 'For teams, agencies, and government bodies.',
    features: ['All Pro features', '99.9% SLA guarantee', 'Dedicated support', 'Custom API limits', 'White-label options', 'On-prem deployment'],
    cta: 'Contact sales', primary: false,
  },
]

function PricingCard({ plan, i, visible }) {
  const navigate = useNavigate()
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        background: plan.primary
          ? (hov ? 'linear-gradient(160deg,rgba(255,255,255,.22) 0%,rgba(255,255,255,.12) 100%)' : 'linear-gradient(160deg,rgba(255,255,255,.17) 0%,rgba(255,255,255,.09) 100%)')
          : (hov ? 'linear-gradient(160deg,rgba(255,255,255,.14) 0%,rgba(255,255,255,.08) 100%)' : 'linear-gradient(160deg,rgba(255,255,255,.08) 0%,rgba(255,255,255,.04) 100%)'),
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: plan.primary
          ? (hov ? '2.5px solid rgba(255,255,255,.95)' : '2.5px dashed rgba(255,255,255,.45)')
          : (hov ? '2px solid rgba(255,255,255,.85)' : '2px dashed rgba(255,255,255,.15)'),
        borderRadius: hov ? 'calc(14 * var(--u))' : 'calc(22 * var(--u))',
        padding: 'calc(32 * var(--u)) calc(28 * var(--u))',
        display: 'flex', flexDirection: 'column', gap: 'calc(20 * var(--u))',
        opacity: visible ? 1 : 0,
        transform: hov ? 'translate(-4px, -4px)' : visible ? 'none' : 'translateY(24px)',
        boxShadow: hov ? '4px 4px 0px rgba(255, 255, 255, 0.85)' : (plan.primary ? '0 0 60px rgba(255,255,255,.03)' : 'none'),
        transition: `background .3s, border-color .3s, border-radius .3s, transform .3s, box-shadow .3s, opacity .6s ease ${i * .1}s`,
      }}>
      {plan.badge && (
        <div style={{ position: 'absolute', top: 'calc(-14 * var(--u))', left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#04121b', fontSize: 'calc(10 * var(--u))', fontWeight: 700, letterSpacing: '0.08em', padding: 'calc(5 * var(--u)) calc(14 * var(--u))', borderRadius: 'calc(20 * var(--u))', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{plan.badge}</div>
      )}
      <div>
        <div style={{ fontSize: 'calc(13 * var(--u))', fontWeight: 600, color: 'rgba(255,255,255,.5)', marginBottom: 'calc(6 * var(--u))' }}>{plan.name}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'calc(5 * var(--u))' }}>
          <span style={{ fontSize: 'clamp(28px,calc(36 * var(--u)),46px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{plan.price}</span>
          <span style={{ fontSize: 'calc(11.5 * var(--u))', color: 'rgba(255,255,255,.38)' }}>/ {plan.period}</span>
        </div>
        <div style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,.5)', marginTop: 'calc(5 * var(--u))', lineHeight: 1.55 }}>{plan.desc}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(9 * var(--u))' }}>
        {plan.features.map((f, j) => (
          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 'calc(9 * var(--u))' }}>
            <span style={{ fontSize: 'calc(12 * var(--u))', color: f ? 'rgba(255,255,255,.6)' : 'rgba(255,255,255,.18)', flexShrink: 0 }}>{f ? '✓' : '–'}</span>
            <span style={{ fontSize: 'clamp(11.5px,calc(12.5 * var(--u)),14px)', color: f ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.22)' }}>{f ?? 'Not included'}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate(plan.name === 'Enterprise' ? '/login' : '/register')}
        style={{ width: '100%', height: 'calc(46 * var(--u))', borderRadius: 'calc(12 * var(--u))', background: plan.primary ? '#fff' : 'rgba(255,255,255,.10)', color: plan.primary ? '#04121b' : '#fff', border: plan.primary ? 'none' : '1px solid rgba(255,255,255,.14)', fontSize: 'clamp(12px,calc(13 * var(--u)),14.5px)', fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .2s, transform .18s' }}
        onMouseEnter={e => { e.target.style.opacity = '.85'; e.target.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'none' }}
      >{plan.cta}</button>
    </div>
  )
}

function PricingSection() {
  const [ref, visible] = useScrollReveal()
  return (
    <section id="pricing" ref={ref} style={{
      padding: 'calc(96 * var(--u)) calc(80 * var(--u))',
      opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(32px)',
      transition: 'opacity .75s ease, transform .75s ease',
    }}>
      <SectionLabel>Pricing</SectionLabel>
      <h2 style={h2Style}>Simple, transparent pricing</h2>
      <p style={{ ...subStyle, marginBottom: 'calc(52 * var(--u))' }}>Start free. Upgrade when you need more. No hidden fees.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'calc(20 * var(--u))', alignItems: 'start' }}>
        {PLANS.map((plan, i) => <PricingCard key={plan.name} plan={plan} i={i} visible={visible} />)}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   8. TESTIMONIALS
═══════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  { quote: "KisanDarpan AI's hyper-local forecasts changed how we plan irrigation. We reduced water waste by 30% in our paddy and potato crops.", name: 'Priya Sharma', role: 'Agri-tech Lead, GreenField Co.', avatar: 'PS' },
  { quote: "The severity alert system saved our Kharif harvest. 12 hours before the cloudburst in Hooghly, KisanDarpan AI was the only platform that warned us.", name: 'Arjun Mehta', role: 'Operations Manager, Polba FPO', avatar: 'AM' },
  { quote: "We embedded KisanDarpan AI's downscaled telemetry into our local farm advisory network. Village microclimate precision is a game-changer.", name: 'Neha Krishnan', role: 'Krishi Vigyan Kendra Consultant', avatar: 'NK' },
]

function TestiCard({ t, i, visible }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov
          ? 'linear-gradient(160deg,rgba(255,255,255,.15) 0%,rgba(255,255,255,.08) 100%)'
          : 'linear-gradient(160deg,rgba(255,255,255,.09) 0%,rgba(255,255,255,.05) 100%)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: hov ? '2px solid rgba(255,255,255,.85)' : '2px dashed rgba(255,255,255,.15)',
        borderRadius: hov ? 'calc(12 * var(--u))' : 'calc(20 * var(--u))',
        padding: 'calc(28 * var(--u)) calc(24 * var(--u))',
        display: 'flex', flexDirection: 'column', gap: 'calc(18 * var(--u))',
        opacity: visible ? 1 : 0,
        transform: hov ? 'translate(-4px, -4px)' : visible ? 'none' : 'translateY(24px)',
        boxShadow: hov ? '4px 4px 0px rgba(255, 255, 255, 0.85)' : 'none',
        transition: `background .3s, border-color .3s, border-radius .3s, transform .3s, box-shadow .3s, opacity .6s ease ${i * .12}s`,
      }}>
      <div style={{ display: 'flex', gap: 3 }}>{Array(5).fill(null).map((_, j) => <span key={j} style={{ fontSize: 'calc(11 * var(--u))' }}>⭐</span>)}</div>
      <p style={{ fontSize: 'clamp(12.5px,calc(13.5 * var(--u)),15.5px)', color: 'rgba(255,255,255,.78)', lineHeight: 1.72, fontStyle: 'italic', flex: 1, margin: 0 }}>"{t.quote}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(12 * var(--u))' }}>
        <div style={{ width: 'calc(38 * var(--u))', height: 'calc(38 * var(--u))', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(255,255,255,.22),rgba(255,255,255,.08))', border: '1px solid rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'calc(11 * var(--u))', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{t.avatar}</div>
        <div>
          <div style={{ fontSize: 'calc(12.5 * var(--u))', fontWeight: 700, color: '#fff' }}>{t.name}</div>
          <div style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,.42)', marginTop: 2 }}>{t.role}</div>
        </div>
      </div>
    </div>
  )
}

function TestimonialsSection() {
  const [ref, visible] = useScrollReveal()
  return (
    <section ref={ref} style={{
      padding: 'calc(96 * var(--u)) calc(80 * var(--u))',
      background: 'linear-gradient(180deg,rgba(255,255,255,.02) 0%,transparent 100%)',
      opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(32px)',
      transition: 'opacity .75s ease, transform .75s ease',
    }}>
      <SectionLabel>Testimonials</SectionLabel>
      <h2 style={h2Style}>Trusted by farmers & experts</h2>
      <p style={{ ...subStyle, marginBottom: 'calc(52 * var(--u))' }}>See how agricultural officers and farmers rely on KisanDarpan AI every day.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'calc(18 * var(--u))' }}>
        {TESTIMONIALS.map((t, i) => <TestiCard key={t.name} t={t} i={i} visible={visible} />)}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   9. FAQ
═══════════════════════════════════════════════════════ */
const FAQS = [
  { q: "How accurate are KisanDarpan AI's forecasts?", a: "KisanDarpan AI blends ground AWS sensors across 25 blocks, satellite imagery, Doppler radar, and our ConvNeXt U-Net downscaling model. In independent benchmarks, our 1 km² micro-grid forecasts achieve over 92% R² accuracy." },
  { q: "Can I use KisanDarpan AI for free?", a: "Yes! The platform is designed for public welfare and research. Farmers and administrative officers can access all 25 blocks, 120+ panchayats, crop advisories, and weather radar with zero charges." },
  { q: "What data sources does KisanDarpan AI use?", a: "We aggregate data from IMD, WRF 9km Numerical Weather Prediction grids, ISRO, and our localized network of AWS IoT sensors deployed across 25 blocks and 120+ panchayats in West Bengal." },
  { q: "Is there an API I can integrate into local agricultural systems?", a: "Yes — KisanDarpan AI provides full RESTful and WebSocket API endpoints with micro-grid downscaled precipitation, temperature, humidity, and wind telemetry." },
  { q: "How do severe weather alerts work?", a: "Set custom thresholds for rain intensity, thunderstorm probability, heat stress, or wind gusts. KisanDarpan AI monitors 24/7 and triggers automated warnings before extreme events strike." },
  { q: "Is my location data private and secure?", a: "Yes. We are DPDPA compliant. Location telemetry is anonymized and encrypted end-to-end both at rest and in transit." },
  { q: "Can KisanDarpan AI provide advisories in regional languages?", a: "Absolutely. KisanDarpan AI supports voice audio bulletins and text in Bengali (বাংলা), Hindi (हिंदी), and English, with automated Agro-Bot recommendations." },
]

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div style={{
      background: isOpen ? 'rgba(255,255,255,.09)' : 'rgba(255,255,255,.055)',
      border: `1px solid ${isOpen ? 'rgba(255,255,255,.17)' : 'rgba(255,255,255,.08)'}`,
      borderRadius: 'calc(14 * var(--u))',
      overflow: 'hidden',
      transition: 'background .25s, border-color .25s',
    }}>
      <button onClick={onToggle} style={{ width: '100%', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'calc(18 * var(--u)) calc(22 * var(--u))', cursor: 'pointer', textAlign: 'left', gap: 'calc(16 * var(--u))', fontFamily: 'inherit' }}>
        <span style={{ fontSize: 'clamp(13px,calc(14.5 * var(--u)),16.5px)', fontWeight: 600, color: '#fff', lineHeight: 1.45 }}>{faq.q}</span>
        <span style={{ flexShrink: 0, width: 'calc(24 * var(--u))', height: 'calc(24 * var(--u))', borderRadius: '50%', background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'calc(15 * var(--u))', color: '#fff', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform .28s ease' }}>+</span>
      </button>
      <div style={{ maxHeight: isOpen ? '300px' : 0, overflow: 'hidden', transition: 'max-height .38s cubic-bezier(.16,1,.3,1)' }}>
        <p style={{ fontSize: 'clamp(12.5px,calc(13.5 * var(--u)),15px)', color: 'rgba(255,255,255,.62)', lineHeight: 1.78, padding: '0 calc(22 * var(--u)) calc(20 * var(--u))', margin: 0 }}>{faq.a}</p>
      </div>
    </div>
  )
}

function FAQSection() {
  const [ref, visible] = useScrollReveal()
  const [open, setOpen] = useState(null)
  return (
    <section id="faq" ref={ref} style={{
      padding: 'calc(96 * var(--u)) calc(80 * var(--u))',
      opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(32px)',
      transition: 'opacity .75s ease, transform .75s ease',
    }}>
      <SectionLabel>FAQ</SectionLabel>
      <h2 style={h2Style}>Frequently asked questions</h2>
      <p style={{ ...subStyle, marginBottom: 'calc(52 * var(--u))' }}>
        Can't find what you need?{' '}
        <a href="mailto:contact@kisandarpan.ai" style={{ color: 'rgba(255,255,255,.65)', textDecoration: 'underline' }}>Email us.</a>
      </p>
      <div style={{ maxWidth: 'calc(760 * var(--u))', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'calc(10 * var(--u))' }}>
        {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />)}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   10. FINAL CTA
═══════════════════════════════════════════════════════ */
function CTASection() {
  const [ref, visible] = useScrollReveal()
  const navigate = useNavigate()
  return (
    <section ref={ref} style={{
      padding: 'calc(40 * var(--u)) calc(80 * var(--u)) calc(96 * var(--u))',
      opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(32px)',
      transition: 'opacity .8s ease, transform .8s ease',
    }}>
      <div style={{
        background: 'linear-gradient(135deg,rgba(255,255,255,.12) 0%,rgba(255,255,255,.06) 60%,rgba(99,179,237,.07) 100%)',
        backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(255,255,255,.13)',
        borderRadius: 'calc(28 * var(--u))',
        padding: 'calc(72 * var(--u)) calc(60 * var(--u))',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '-30%', left: '20%', width: '60%', height: '160%', background: 'radial-gradient(ellipse,rgba(255,255,255,.04) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', padding: 'calc(5 * var(--u)) calc(14 * var(--u))', border: '1px solid rgba(255,255,255,.16)', borderRadius: 'calc(20 * var(--u))', fontSize: 'calc(11 * var(--u))', fontWeight: 600, color: 'rgba(255,255,255,.58)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'calc(24 * var(--u))' }}>✦ &nbsp; No credit card required</div>
          <h2 style={{ fontFamily: "'Inter Tight','Inter',sans-serif", fontWeight: 800, fontSize: 'clamp(30px,calc(50 * var(--u)),66px)', lineHeight: 1.1, letterSpacing: '0.02em', color: '#fff', marginBottom: 'calc(18 * var(--u))', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>Start for free today.</h2>
          <p style={{ fontSize: 'clamp(14px,calc(15.5 * var(--u)),18px)', color: 'rgba(255,255,255,.58)', lineHeight: 1.65, maxWidth: 'calc(460 * var(--u))', margin: '0 auto calc(40 * var(--u))' }}>
            Join 1,000+ farmers and agricultural officers who trust KisanDarpan AI for daily hyper-local micro-climate intelligence. Free forever, upgrade anytime.
          </p>
          <div style={{ display: 'flex', gap: 'calc(12 * var(--u))', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')}
              className="rounded-2xl border-2 border-dashed border-black bg-white font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer flex items-center justify-center"
              style={{ height: 'calc(52 * var(--u))', padding: '0 calc(36 * var(--u))', fontSize: 'calc(13.5 * var(--u))', letterSpacing: 'calc(.6 * var(--u))', fontFamily: 'inherit' }}>
              Create free account →
            </button>
            <button onClick={() => navigate('/dashboard')}
              className="rounded-2xl border-2 border-dashed border-white/80 bg-white/10 font-semibold uppercase text-white backdrop-blur-md transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:bg-white/20 hover:border-white hover:shadow-[4px_4px_0px_rgba(255,255,255,0.85)] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer flex items-center justify-center"
              style={{ height: 'calc(52 * var(--u))', padding: '0 calc(28 * var(--u))', fontSize: 'calc(13.5 * var(--u))', letterSpacing: 'calc(.6 * var(--u))', fontFamily: 'inherit' }}>
              View live demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   11. FOOTER
═══════════════════════════════════════════════════════ */
const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap', 'API Docs'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Resources: ['Documentation', 'Help Center', 'Status', 'Community', 'Integrations'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Security'],
}

function FooterSection() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,.07)', padding: 'calc(60 * var(--u)) calc(80 * var(--u)) calc(36 * var(--u))' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'calc(230 * var(--u)) repeat(4,1fr)', gap: 'calc(36 * var(--u))', marginBottom: 'calc(48 * var(--u))' }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(9 * var(--u))', marginBottom: 'calc(13 * var(--u))' }}>
            <FarmerLogo size={28} />
            <span style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>KisanDarpan AI</span>
          </div>
          <p style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,.42)', lineHeight: 1.72, maxWidth: 'calc(195 * var(--u))', margin: '0 0 calc(18 * var(--u))' }}>Precision agromet intelligence for every farmer, panchayat, and agricultural officer.</p>
          <div style={{ display: 'flex', gap: 'calc(8 * var(--u))' }}>
            {['𝕏', 'in', '▶', '𝕗'].map(icon => (
              <a key={icon} href="#" style={{ width: 'calc(30 * var(--u))', height: 'calc(30 * var(--u))', borderRadius: 'calc(7 * var(--u))', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'calc(10.5 * var(--u))', color: 'rgba(255,255,255,.5)', textDecoration: 'none', transition: 'background .2s,color .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.14)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = 'rgba(255,255,255,.5)' }}
              >{icon}</a>
            ))}
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([col, links]) => (
          <div key={col}>
            <div style={{ fontSize: 'calc(11 * var(--u))', fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'calc(14 * var(--u))' }}>{col}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(8 * var(--u))' }}>
              {links.map(link => (
                <a key={link} href="#" style={{ fontSize: 'calc(12 * var(--u))', color: 'rgba(255,255,255,.42)', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,.82)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.42)'}
                >{link}</a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 'calc(22 * var(--u))', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'calc(10 * var(--u))' }}>
        <span style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,.28)' }}>© {new Date().getFullYear()} KisanDarpan AI, Inc. All rights reserved. Made with ❤️ for SIH 2026.</span>
        <div style={{ display: 'flex', gap: 'calc(18 * var(--u))' }}>
          {['Privacy', 'Terms', 'Cookies'].map(l => (
            <a key={l} href="#" style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,.28)', textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,.6)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.28)'}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
export default function Landing() {
  return (
    <div style={{ background: '#04121b', overflowX: 'hidden' }}>
      <StickyNav />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PreviewSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}
