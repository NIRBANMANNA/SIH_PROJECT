import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'

/**
 * DynamicWeatherCanvas
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders realistic, GPU-accelerated atmospheric animations:
 * 1. Live Rain Engine (streaks, splashes, velocity, wind tilt, lightning flashes)
 * 2. Summer Sun & Solar Radiance (rotating god rays, sun flare, floating warm heat motes)
 * 3. Accurate Time Sense (Night with twinkling stars & lunar glow, Dawn, Day, Sunset)
 * 4. Adaptive photo color grading based on time-of-day & weather conditions
 * 5. Interactive live ambient mode switcher (Auto, Summer Day, Rain Showers, Starry Night, Sunset)
 */
export default function DynamicWeatherCanvas({ manualMode, onModeChange }) {
  const canvasRef = useRef(null)
  const { blockWeatherData, weatherData } = useDashboard()

  // Detect condition from active block telemetry
  const condition = (blockWeatherData?.condition || weatherData?.condition || 'Rain').toLowerCase()
  const windSpeedStr = blockWeatherData?.wind || weatherData?.wind || '20 km/h'
  const windNum = parseFloat(windSpeedStr) || 20

  // Real-world clock
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours())
  const [currentMinute, setCurrentMinute] = useState(() => new Date().getMinutes())

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentHour(now.getHours())
      setCurrentMinute(now.getMinutes())
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  // Determine active time of day
  // Night: 19:00 - 05:00, Dawn: 05:00 - 08:00, Day: 08:00 - 17:00, Sunset: 17:00 - 19:00
  const realTimeOfDay = useMemo(() => {
    if (currentHour >= 5 && currentHour < 8) return 'dawn'
    if (currentHour >= 8 && currentHour < 17) return 'day'
    if (currentHour >= 17 && currentHour < 19) return 'sunset'
    return 'night'
  }, [currentHour])

  // Determine weather type
  const isRain = condition.includes('rain') || condition.includes('shower') || condition.includes('drizzle') || condition.includes('thunder')
  const isThunder = condition.includes('thunder') || condition.includes('storm') || condition.includes('heavy rain')
  const isSunny = condition.includes('sun') || condition.includes('clear') || condition.includes('summer') || condition.includes('hot')

  // Resolved ambient scenario (either auto from real time + weather, or manual preview override)
  const effectiveScenario = useMemo(() => {
    if (manualMode && manualMode !== 'auto') {
      return manualMode
    }
    // Auto resolution:
    if (isRain) {
      return realTimeOfDay === 'night' ? 'night-rain' : 'day-rain'
    }
    if (realTimeOfDay === 'night') return 'night-clear'
    if (realTimeOfDay === 'sunset') return 'sunset'
    if (realTimeOfDay === 'dawn') return 'dawn'
    return isSunny ? 'summer-day' : 'day-clouds'
  }, [manualMode, isRain, realTimeOfDay, isSunny])

  // Canvas Particle Animation Engine
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initParticles()
    }
    window.addEventListener('resize', handleResize)

    // ─── 1. Stars (for Night / Twilight) ───────────────────
    const numStars = 110
    let stars = []

    // ─── 2. Raindrops ─────────────────────────────────────
    const numRain = 220
    let raindrops = []
    let splashes = []

    // ─── 3. Summer Sun Motes / Pollen Heat Shimmer ────────
    const numMotes = 45
    let motes = []

    // ─── 4. Cloud Drift Puffs ─────────────────────────────
    const numClouds = 6
    let clouds = []

    // Initialize all particle pools
    const initParticles = () => {
      // Stars
      stars = []
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.75),
          radius: Math.random() * 1.5 + 0.4,
          baseAlpha: Math.random() * 0.75 + 0.25,
          twinkleSpeed: Math.random() * 0.025 + 0.008,
          phase: Math.random() * Math.PI * 2,
        })
      }

      // Raindrops
      raindrops = []
      for (let i = 0; i < numRain; i++) {
        raindrops.push({
          x: Math.random() * (width + 200) - 100,
          y: Math.random() * height,
          length: Math.random() * 24 + 14,
          speed: Math.random() * 14 + 16,
          thickness: Math.random() * 1.2 + 0.7,
          opacity: Math.random() * 0.5 + 0.25,
        })
      }
      splashes = []

      // Summer motes
      motes = []
      for (let i = 0; i < numMotes; i++) {
        motes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.8 + 1,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(Math.random() * 0.6 + 0.3),
          opacity: Math.random() * 0.6 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        })
      }

      // Clouds
      clouds = []
      for (let i = 0; i < numClouds; i++) {
        clouds.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.45) + 30,
          radius: Math.random() * 160 + 100,
          speed: Math.random() * 0.25 + 0.1,
          opacity: Math.random() * 0.08 + 0.04,
        })
      }
    }

    initParticles()

    let animId
    let lastTime = performance.now()
    let sunRotation = 0
    let lightningIntensity = 0
    let nextLightningTime = performance.now() + Math.random() * 9000 + 4000

    const windAngle = Math.min(Math.max((windNum - 10) * 0.5, 5), 25) * (Math.PI / 180)
    const windTiltX = Math.sin(windAngle)
    const windTiltY = Math.cos(windAngle)

    const render = (time) => {
      const dt = Math.min(time - lastTime, 60)
      lastTime = time
      ctx.clearRect(0, 0, width, height)

      const isNightMode = effectiveScenario.includes('night')
      const isRainMode = effectiveScenario.includes('rain')
      const isSummerMode = effectiveScenario === 'summer-day' || (!isNightMode && !isRainMode && isSunny)
      const isSunsetMode = effectiveScenario === 'sunset' || effectiveScenario === 'dawn'

      // ─── A. Stars (Night Sky) ──────────────────────────────
      if (isNightMode || isSunsetMode) {
        const starFade = isNightMode ? 1 : 0.4
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i]
          s.phase += s.twinkleSpeed * (dt / 16)
          const alpha = (s.baseAlpha + Math.sin(s.phase) * 0.35) * starFade
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(235, 245, 255, ${Math.max(0.1, Math.min(1, alpha))})`
          ctx.shadowBlur = s.radius > 1.2 ? 6 : 0
          ctx.shadowColor = 'rgba(210, 235, 255, 0.8)'
          ctx.fill()
        }
        ctx.shadowBlur = 0

        // Moon & Lunar Glow (Top right corner of sky)
        if (isNightMode) {
          const moonX = width * 0.78
          const moonY = height * 0.14
          // Outer atmospheric lunar halo
          const haloGrad = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 140)
          haloGrad.addColorStop(0, 'rgba(215, 235, 255, 0.22)')
          haloGrad.addColorStop(0.5, 'rgba(160, 205, 250, 0.08)')
          haloGrad.addColorStop(1, 'rgba(10, 25, 45, 0)')
          ctx.beginPath()
          ctx.arc(moonX, moonY, 140, 0, Math.PI * 2)
          ctx.fillStyle = haloGrad
          ctx.fill()

          // Crescent Moon
          ctx.save()
          ctx.beginPath()
          ctx.arc(moonX, moonY, 20, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
          ctx.shadowColor = 'rgba(255, 255, 255, 0.9)'
          ctx.shadowBlur = 15
          ctx.fill()

          // Mask inner shadow to shape luminous crescent
          ctx.beginPath()
          ctx.arc(moonX + 8, moonY - 4, 18, 0, Math.PI * 2)
          ctx.fillStyle = '#061320'
          ctx.shadowBlur = 0
          ctx.fill()
          ctx.restore()
        }
      }

      // ─── B. Summer Sun & Golden God-Rays ───────────────────
      if (isSummerMode) {
        sunRotation += 0.002 * (dt / 16)
        const sunX = width * 0.72
        const sunY = height * 0.16

        // 1. Broad Solar Aura
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 320)
        sunGlow.addColorStop(0, 'rgba(255, 235, 160, 0.38)')
        sunGlow.addColorStop(0.35, 'rgba(254, 215, 102, 0.18)')
        sunGlow.addColorStop(0.7, 'rgba(251, 146, 60, 0.06)')
        sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.beginPath()
        ctx.arc(sunX, sunY, 320, 0, Math.PI * 2)
        ctx.fillStyle = sunGlow
        ctx.fill()

        // 2. Rotating Luminous Solar Flares / God Rays
        ctx.save()
        ctx.translate(sunX, sunY)
        ctx.rotate(sunRotation)
        const rayCount = 12
        for (let r = 0; r < rayCount; r++) {
          const angle = (r * Math.PI * 2) / rayCount
          const rayLen = 280 + Math.sin(sunRotation * 3 + r) * 40
          ctx.save()
          ctx.rotate(angle)
          const rayGrad = ctx.createLinearGradient(0, 0, rayLen, 0)
          rayGrad.addColorStop(0, 'rgba(255, 245, 190, 0.22)')
          rayGrad.addColorStop(0.5, 'rgba(253, 224, 71, 0.08)')
          rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.beginPath()
          ctx.moveTo(0, -12)
          ctx.lineTo(rayLen, 0)
          ctx.lineTo(0, 12)
          ctx.closePath()
          ctx.fillStyle = rayGrad
          ctx.fill()
          ctx.restore()
        }

        // Sun Core
        const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 36)
        coreGrad.addColorStop(0, '#ffffff')
        coreGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.95)')
        coreGrad.addColorStop(1, 'rgba(250, 204, 21, 0)')
        ctx.beginPath()
        ctx.arc(0, 0, 36, 0, Math.PI * 2)
        ctx.fillStyle = coreGrad
        ctx.fill()
        ctx.restore()

        // 3. Floating Summer Heat Motes & Pollen Dust
        for (let m = 0; m < motes.length; m++) {
          const mote = motes[m]
          mote.y += mote.vy * (dt / 16)
          mote.x += (mote.vx + Math.sin(mote.y * 0.015 + mote.pulse) * 0.3) * (dt / 16)
          mote.pulse += mote.pulseSpeed

          if (mote.y < -10) {
            mote.y = height + 10
            mote.x = Math.random() * width
          }
          if (mote.x < -10) mote.x = width + 10
          if (mote.x > width + 10) mote.x = -10

          const mAlpha = mote.opacity * (0.6 + Math.sin(mote.pulse) * 0.4)
          ctx.beginPath()
          ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(254, 240, 138, ${mAlpha})`
          ctx.shadowColor = 'rgba(250, 204, 21, 0.6)'
          ctx.shadowBlur = 4
          ctx.fill()
        }
        ctx.shadowBlur = 0
      }

      // ─── C. Clouds & Mist Floating ─────────────────────────
      for (let c = 0; c < clouds.length; c++) {
        const cloud = clouds[c]
        cloud.x += cloud.speed * (dt / 16)
        if (cloud.x - cloud.radius > width) {
          cloud.x = -cloud.radius
          cloud.y = Math.random() * (height * 0.45) + 30
        }

        const cloudGrad = ctx.createRadialGradient(cloud.x, cloud.y, cloud.radius * 0.2, cloud.x, cloud.y, cloud.radius)
        if (isNightMode) {
          cloudGrad.addColorStop(0, `rgba(30, 48, 72, ${cloud.opacity * 1.5})`)
          cloudGrad.addColorStop(1, 'rgba(10, 20, 35, 0)')
        } else if (isSunsetMode) {
          cloudGrad.addColorStop(0, `rgba(235, 120, 140, ${cloud.opacity * 2})`)
          cloudGrad.addColorStop(1, 'rgba(200, 80, 100, 0)')
        } else {
          cloudGrad.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity * 2.2})`)
          cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        }
        ctx.beginPath()
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2)
        ctx.fillStyle = cloudGrad
        ctx.fill()
      }

      // ─── D. Live Raindrop Engine (Fall, Tilt & Splash) ──────
      if (isRainMode) {
        // Lightning Trigger
        if (isThunder && time > nextLightningTime) {
          lightningIntensity = 1.0
          nextLightningTime = time + Math.random() * 11000 + 5000
        }
        if (lightningIntensity > 0) {
          ctx.fillStyle = `rgba(220, 235, 255, ${lightningIntensity * 0.45})`
          ctx.fillRect(0, 0, width, height)
          lightningIntensity -= 0.04 * (dt / 16)
        }

        const dropColor = isNightMode ? 'rgba(195, 220, 255,' : 'rgba(255, 255, 255,'
        ctx.lineWidth = 1.2
        ctx.lineCap = 'round'

        for (let r = 0; r < raindrops.length; r++) {
          const drop = raindrops[r]
          drop.x += windTiltX * drop.speed * (dt / 16)
          drop.y += windTiltY * drop.speed * (dt / 16)

          const endX = drop.x - windTiltX * drop.length
          const endY = drop.y - windTiltY * drop.length

          ctx.beginPath()
          ctx.moveTo(drop.x, drop.y)
          ctx.lineTo(endX, endY)
          ctx.strokeStyle = `${dropColor} ${drop.opacity})`
          ctx.lineWidth = drop.thickness
          ctx.stroke()

          // Ground / bottom splash
          if (drop.y > height - 10) {
            if (Math.random() < 0.35 && splashes.length < 50) {
              splashes.push({
                x: drop.x,
                y: height - Math.random() * 15,
                radius: 1,
                maxRadius: Math.random() * 8 + 4,
                alpha: 0.6,
              })
            }
            drop.y = -drop.length
            drop.x = Math.random() * (width + 200) - 100
          }
          if (drop.x > width + 100) drop.x = -50
        }

        // Draw Splashes & Ripples
        for (let s = splashes.length - 1; s >= 0; s--) {
          const splash = splashes[s]
          splash.radius += 0.45 * (dt / 16)
          splash.alpha -= 0.025 * (dt / 16)
          if (splash.alpha <= 0) {
            splashes.splice(s, 1)
            continue
          }
          ctx.beginPath()
          ctx.ellipse(splash.x, splash.y, splash.radius * 2, splash.radius * 0.7, 0, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(215, 235, 255, ${splash.alpha})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [effectiveScenario, windNum, isThunder, isSunny])

  // Sky Overlay Gradient based on Time of Day & Weather
  const skyOverlayGradient = useMemo(() => {
    switch (effectiveScenario) {
      case 'night-rain':
        return 'linear-gradient(180deg, rgba(3, 10, 22, 0.78) 0%, rgba(6, 18, 34, 0.52) 45%, rgba(2, 8, 16, 0.88) 100%)'
      case 'night-clear':
        return 'linear-gradient(180deg, rgba(2, 7, 18, 0.75) 0%, rgba(5, 16, 32, 0.45) 50%, rgba(1, 5, 12, 0.85) 100%)'
      case 'day-rain':
        return 'linear-gradient(180deg, rgba(15, 28, 45, 0.48) 0%, rgba(25, 42, 65, 0.25) 50%, rgba(8, 18, 30, 0.65) 100%)'
      case 'summer-day':
        return 'linear-gradient(180deg, rgba(56, 189, 248, 0.22) 0%, rgba(250, 204, 21, 0.12) 35%, rgba(15, 23, 42, 0.25) 100%)'
      case 'sunset':
        return 'linear-gradient(180deg, rgba(49, 14, 62, 0.55) 0%, rgba(217, 70, 54, 0.35) 45%, rgba(245, 158, 11, 0.2) 75%, rgba(15, 23, 42, 0.75) 100%)'
      case 'dawn':
        return 'linear-gradient(180deg, rgba(30, 27, 75, 0.52) 0%, rgba(190, 80, 110, 0.32) 45%, rgba(251, 146, 60, 0.22) 75%, rgba(10, 18, 30, 0.7) 100%)'
      default:
        return 'linear-gradient(180deg, rgba(4, 16, 24, 0.34) 0%, rgba(4, 16, 24, 0.2) 40%, rgba(4, 16, 24, 0.06) 78%, transparent 100%)'
    }
  }, [effectiveScenario])

  // Formatted display label for the ambience badge
  const displayLabel = useMemo(() => {
    const timeStr = `${currentHour % 12 || 12}:${currentMinute < 10 ? '0' : ''}${currentMinute} ${currentHour >= 12 ? 'PM' : 'AM'}`
    switch (effectiveScenario) {
      case 'night-rain':
        return `🌙 Night Rain • ${timeStr}`
      case 'night-clear':
        return `🌙 Starry Night • ${timeStr}`
      case 'day-rain':
        return `🌧️ Live Rain • ${timeStr}`
      case 'summer-day':
        return `☀️ Summer Sun • ${timeStr}`
      case 'sunset':
        return `🌅 Golden Sunset • ${timeStr}`
      case 'dawn':
        return `🌄 Morning Dawn • ${timeStr}`
      default:
        return `🌤️ Live Sky • ${timeStr}`
    }
  }, [effectiveScenario, currentHour, currentMinute])

  return (
    <>
      {/* Background color grading & dynamic gradient tint */}
      <div
        id="dynamic-sky-backdrop-filter"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          background: skyOverlayGradient,
          transition: 'background 1s ease',
        }}
      />

      {/* Live Particle Canvas: Rain, Stars, Sun Rays, Motes */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Floating Interactive Ambience & Time Controller Badge */}
      <div
        style={{
          position: 'fixed',
          bottom: 'calc(18 * var(--u))',
          right: 'calc(38 * var(--u))',
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          gap: 'calc(6 * var(--u))',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          borderRadius: 'calc(16 * var(--u))',
          padding: 'calc(4 * var(--u)) calc(8 * var(--u))',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          fontSize: 'calc(11.5 * var(--u))',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', padding: '0 calc(4 * var(--u))' }}>
          <span style={{ width: 'calc(6 * var(--u))', height: 'calc(6 * var(--u))', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
          <span style={{ fontWeight: 600, color: '#e2e8f0', letterSpacing: '-0.2px' }}>{displayLabel}</span>
        </div>

        {/* Quick Ambience Switcher Dropdown */}
        <select
          value={manualMode || 'auto'}
          onChange={(e) => onModeChange?.(e.target.value)}
          aria-label="Select Atmospheric Weather & Time Environment"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: 'calc(10 * var(--u))',
            color: '#7dd3fc',
            padding: 'calc(3 * var(--u)) calc(8 * var(--u))',
            fontSize: 'calc(11 * var(--u))',
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="auto" style={{ background: '#0f172a', color: '#fff' }}>⚡ Auto (Live Time & Weather)</option>
          <option value="day-rain" style={{ background: '#0f172a', color: '#fff' }}>🌧️ Daytime Rain Showers</option>
          <option value="night-rain" style={{ background: '#0f172a', color: '#fff' }}>🌧️🌙 Night Monsoon Rain</option>
          <option value="summer-day" style={{ background: '#0f172a', color: '#fff' }}>☀️ Summer Sun & Heat</option>
          <option value="night-clear" style={{ background: '#0f172a', color: '#fff' }}>🌙 Starry Night Sky</option>
          <option value="sunset" style={{ background: '#0f172a', color: '#fff' }}>🌅 Golden Sunset</option>
          <option value="dawn" style={{ background: '#0f172a', color: '#fff' }}>🌄 Morning Dawn</option>
        </select>
      </div>
    </>
  )
}
