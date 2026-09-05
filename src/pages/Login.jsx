import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

/* ─── tiny reusable primitives ───────────────────────── */
/* ─── tiny reusable primitives ───────────────────────── */
function Logo({ size = 40 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '11px',
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
        <path d="M2 13.5 C4.5 12, 7.5 11, 12 11 C16.5 11, 19.5 12, 22 13.5" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M6 11.5 C6.5 6.5, 8.5 4.5, 12 4.5 C15.5 4.5, 17.5 6.5, 18 11.5" fill="rgba(250, 204, 21, 0.35)" stroke="#facc15" strokeWidth="1.8" />
        <path d="M6.5 9.5 C8.5 8.5, 10 8, 12 8 C14 8, 15.5 8.5, 17.5 9.5" stroke="#22c55e" strokeWidth="1.6" />
        <circle cx="12" cy="14.2" r="2.6" stroke="#ffffff" fill="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <path d="M7.5 21.5 v-1.8 a3 3 0 0 1 3 -3 h3 a3 3 0 0 1 3 3 v1.8" stroke="#4ade80" strokeWidth="1.8" />
        <path d="M12 16.5 v3.5 M10.5 18 c.9-.6 1.5-.3 1.5 0 M13.5 18 c-.9-.6-1.5-.3-1.5 0" stroke="#fef08a" strokeWidth="1.4" />
      </svg>
    </div>
  )
}

/* eye / eye-off toggle icon */
function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
      <circle cx="10" cy="10" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
      <circle cx="10" cy="10" r="3" />
      <line x1="2" y1="2" x2="18" y2="18" />
    </svg>
  )
}

/* Google "G" SVG */
function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }} aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}


/* Glass input field */
function GlassInput({ id, label, type = 'text', value, onChange, placeholder, autoComplete, rightSlot }) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(8 * var(--u))', width: '100%' }}>
      <label
        htmlFor={id}
        style={{ fontSize: 'clamp(11px, calc(13 * var(--u)), 15px)', fontWeight: 500, color: 'rgba(255,255,255,.70)', letterSpacing: 'calc(.5 * var(--u))', textTransform: 'uppercase' }}
      >
        {label}
      </label>
      <div
        style={{
          position: 'relative',
          borderRadius: 'calc(14 * var(--u))',
          background: focused ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.10)',
          border: `calc(1 * var(--u)) solid ${focused ? 'rgba(255,255,255,.42)' : 'rgba(255,255,255,.18)'}`,
          transition: 'background .2s, border-color .2s',
        }}
      >
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: rightSlot
              ? 'calc(16 * var(--u)) calc(48 * var(--u)) calc(16 * var(--u)) calc(18 * var(--u))'
              : 'calc(16 * var(--u)) calc(18 * var(--u))',
            fontSize: 'clamp(14px, calc(16 * var(--u)), 19px)',
            fontWeight: 400,
            color: '#fff',
            letterSpacing: 'calc(-.1 * var(--u))',
            fontFamily: 'inherit',
          }}
        />
        {rightSlot && (
          <div
            style={{
              position: 'absolute',
              right: 'calc(14 * var(--u))',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,.50)',
              display: 'flex',
              cursor: 'pointer',
            }}
          >
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  )
}

/* Social button */
function SocialBtn({ children, label, onClick, fullWidth }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`${fullWidth ? 'w-full' : 'flex-1'} rounded-2xl border-2 border-dashed border-white/80 bg-white/12 font-semibold uppercase text-white backdrop-blur-md transition-all duration-300 hover:translate-x-[-3px] hover:translate-y-[-3px] hover:rounded-md hover:bg-white/22 hover:border-white hover:shadow-[3px_3px_0px_white] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer flex items-center justify-center`}
      style={{
        gap: 'calc(8 * var(--u))',
        height: 'calc(46 * var(--u))',
        fontSize: 'clamp(12px, calc(13.5 * var(--u)), 16px)',
        letterSpacing: 'calc(.5 * var(--u))',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  )
}

/* ─── Main Login page ──────────────────────────────────── */
export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    // Simulate auth — replace with real call
    setTimeout(() => { setLoading(false); navigate('/dashboard') }, 1200)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: '#04121b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background Video — 215347.mp4 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
          filter: 'brightness(0.85) contrast(1.05)',
        }}
      >
        <source src="/215347.mp4" type="video/mp4" />
        <source src="/assets/rice-field.webm" type="video/webm" />
      </video>

      {/* Vignette — darker for login to focus card */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          background: `
            linear-gradient(135deg, rgba(4,16,24,.78) 0%, rgba(4,16,24,.52) 50%, rgba(4,16,24,.68) 100%),
            linear-gradient(0deg, rgba(4,16,24,.25), rgba(4,16,24,.25))
          `,
        }}
      />

      {/* ── Left brand panel (desktop only) ── */}
      <div
        className="login-brand-panel"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '44%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'calc(54 * var(--u)) calc(60 * var(--u))',
          zIndex: 2,
        }}
      >
        {/* Wordmark */}
        <div className="anim-hello" style={{ display: 'flex', alignItems: 'center', gap: 'calc(14 * var(--u))' }}>
          <Logo size={44} />
          <span style={{ fontSize: 'clamp(17px, calc(21 * var(--u)), 26px)', fontWeight: 700, color: '#fff', letterSpacing: 'calc(-.3 * var(--u))' }}>
            KisanDarpan AI
          </span>
        </div>

        {/* Headline */}
        <div>
          <div className="anim-chip sheen" style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 'calc(32 * var(--u))',
            borderRadius: 'calc(16 * var(--u))',
            padding: '0 calc(14 * var(--u))',
            background: 'rgba(255,255,255,.175)',
            backdropFilter: 'blur(calc(16 * var(--u))) saturate(115%)',
            WebkitBackdropFilter: 'blur(calc(16 * var(--u))) saturate(115%)',
            fontSize: 'clamp(11.5px, calc(13 * var(--u)), 15.5px)',
            fontWeight: 500,
            color: 'rgba(255,255,255,.90)',
            letterSpacing: 'calc(.3 * var(--u))',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 'calc(22 * var(--u))',
          }}>
            Real-time Agromet Intelligence
          </div>

          <h1
            style={{
              fontFamily: "'Inter Tight', 'Inter', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(42px, calc(60 * var(--u)), 80px)',
              lineHeight: 'clamp(50px, calc(70 * var(--u)), 92px)',
              letterSpacing: 'calc(.2 * var(--u))',
              color: '#fff',
              overflow: 'hidden',
            }}
          >
            <span style={{ display: 'block', overflow: 'hidden' }}>
              <span className="anim-h1l1" style={{ display: 'block' }}>Precision</span>
            </span>
            <span style={{ display: 'block', overflow: 'hidden' }}>
              <span className="anim-h1l2" style={{ display: 'block' }}>weather at</span>
            </span>
            <span style={{ display: 'block', overflow: 'hidden' }}>
              <span style={{ display: 'block', animation: 'lineUp 1.05s cubic-bezier(.16,1,.3,1) .78s both' }}>your fingertips.</span>
            </span>
          </h1>

          <p
            className="anim-blurb"
            style={{
              fontSize: 'clamp(14px, calc(16.5 * var(--u)), 20px)',
              lineHeight: 'clamp(22px, calc(26 * var(--u)), 32px)',
              fontWeight: 400,
              color: 'rgba(255,255,255,.65)',
              marginTop: 'calc(18 * var(--u))',
              maxWidth: 'calc(360 * var(--u))',
            }}
          >
            Hyper-local forecasts, severe weather alerts, and AI-driven<br />
            climate insights — all in one beautiful dashboard.
          </p>

          {/* Stats row */}
          <div
            className="anim-place"
            style={{
              display: 'flex',
              gap: 'calc(36 * var(--u))',
              marginTop: 'calc(44 * var(--u))',
            }}
          >
            {[['1K+', 'Active Users'], ['25', 'Blocks Covered'], ['120+', 'Panchayats Mapped']].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontSize: 'clamp(22px, calc(30 * var(--u)), 38px)', fontWeight: 700, color: '#fff', letterSpacing: 'calc(-.5 * var(--u))', lineHeight: 1 }}>
                  {num}
                </div>
                <div style={{ fontSize: 'clamp(11px, calc(13 * var(--u)), 15.5px)', fontWeight: 400, color: 'rgba(255,255,255,.55)', marginTop: 'calc(4 * var(--u))' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: 'clamp(11px, calc(13 * var(--u)), 15px)', color: 'rgba(255,255,255,.35)', letterSpacing: 'calc(.2 * var(--u))' }}>
          © 2025 Aurora Weather Inc. — All rights reserved.
        </div>
      </div>

      {/* ── Vertical divider ── */}
      <div
        className="login-divider"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '44%',
          top: 'calc(40 * var(--u))',
          bottom: 'calc(40 * var(--u))',
          width: '1px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,.18) 20%, rgba(255,255,255,.18) 80%, transparent 100%)',
          zIndex: 2,
        }}
      />

      {/* ── Auth card ── */}
      <div
        className="anim-card1 auth-card"
        style={{
          position: 'relative',
          zIndex: 10,
          marginLeft: '44%',
          width: 'calc(420 * var(--u))',
          maxWidth: '90vw',
          borderRadius: 'calc(28 * var(--u))',
          background: 'linear-gradient(160deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,.265) 30%, rgba(255,255,255,.245) 70%, rgba(255,255,255,.215) 100%)',
          backdropFilter: 'blur(calc(36 * var(--u))) saturate(125%)',
          WebkitBackdropFilter: 'blur(calc(36 * var(--u))) saturate(125%)',
          padding: 'calc(44 * var(--u)) calc(40 * var(--u))',
          overflow: 'hidden',
        }}
      >
        {/* Card header */}
        <div className="anim-place" style={{ marginBottom: 'calc(32 * var(--u))' }}>
          <div style={{ fontSize: 'clamp(20px, calc(26 * var(--u)), 34px)', fontWeight: 700, color: '#fff', letterSpacing: 'calc(-.4 * var(--u))' }}>
            Welcome back
          </div>
          <div style={{ fontSize: 'clamp(13px, calc(15.5 * var(--u)), 18.5px)', fontWeight: 400, color: 'rgba(255,255,255,.60)', marginTop: 'calc(6 * var(--u))' }}>
            Sign in to your Aurora account
          </div>
        </div>

        {/* Social buttons */}
        <div className="anim-bigtemp" style={{ display: 'flex', gap: 'calc(12 * var(--u))', marginBottom: 'calc(28 * var(--u))' }}>
          <SocialBtn label="Continue with Google" fullWidth>
            <GoogleG />
            Continue with Google
          </SocialBtn>
        </div>

        {/* Divider */}
        <div
          className="anim-met1"
          style={{ display: 'flex', alignItems: 'center', gap: 'calc(12 * var(--u))', marginBottom: 'calc(28 * var(--u))' }}
        >
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.18)' }} />
          <span style={{ fontSize: 'clamp(11.5px, calc(13.5 * var(--u)), 16px)', color: 'rgba(255,255,255,.45)', fontWeight: 500 }}>or continue with email</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.18)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(18 * var(--u))' }}>
            <div className="anim-met2">
              <GlassInput
                id="email"
                label="Email address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="anim-met3">
              <GlassInput
                id="password"
                label="Password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', padding: 0 }}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={showPw} />
                  </button>
                }
              />
            </div>
          </div>

          {/* Remember + Forgot */}
          <div
            className="anim-temp1"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'calc(16 * var(--u))', marginBottom: 'calc(24 * var(--u))' }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{
                  width: 'calc(16 * var(--u))',
                  height: 'calc(16 * var(--u))',
                  accentColor: 'rgba(255,255,255,.8)',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: 'clamp(12.5px, calc(14.5 * var(--u)), 17px)', color: 'rgba(255,255,255,.65)', fontWeight: 400 }}>Remember me</span>
            </label>
            <a
              href="#"
              style={{ fontSize: 'clamp(12.5px, calc(14.5 * var(--u)), 17px)', color: 'rgba(255,255,255,.75)', fontWeight: 500, textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.75)'}
            >
              Forgot password?
            </a>
          </div>

          {/* Error message */}
          {error && (
            <div
              style={{
                marginBottom: 'calc(16 * var(--u))',
                padding: 'calc(12 * var(--u)) calc(16 * var(--u))',
                borderRadius: 'calc(10 * var(--u))',
                background: 'rgba(255,80,80,.18)',
                border: '1px solid rgba(255,100,100,.30)',
                fontSize: 'clamp(12.5px, calc(14.5 * var(--u)), 17px)',
                color: 'rgba(255,200,200,.95)',
              }}
            >
              {error}
            </div>
          )}

          {/* Submit button */}
          <SubmitButton loading={loading} />
        </form>

        {/* Sign up link */}
        <div
          className="anim-temp2"
          style={{ textAlign: 'center', marginTop: 'calc(24 * var(--u))', fontSize: 'clamp(13px, calc(15.5 * var(--u)), 18.5px)', color: 'rgba(255,255,255,.55)' }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{ color: '#fff', fontWeight: 600, textDecoration: 'none', transition: 'opacity .15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Create one free
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ── Submit button with loading spinner ── */
function SubmitButton({ loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-2xl border-2 border-dashed border-black bg-white font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer flex items-center justify-center disabled:pointer-events-none disabled:opacity-60"
      style={{
        height: 'calc(52 * var(--u))',
        fontSize: 'clamp(13px, calc(15.5 * var(--u)), 18px)',
        letterSpacing: 'calc(.6 * var(--u))',
        fontFamily: 'inherit',
        gap: 'calc(10 * var(--u))',
      }}
    >
      {loading ? (
        <>
          <Spinner />
          <span>Signing in…</span>
        </>
      ) : (
        'Sign in to Aurora'
      )}
    </button>
  )
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 20 20"
      style={{ width: 18, height: 18, animation: 'spin 0.8s linear infinite' }}
      aria-hidden="true"
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <circle cx="10" cy="10" r="7" fill="none" stroke="#04121b" strokeWidth="2.5" strokeDasharray="30" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  )
}
