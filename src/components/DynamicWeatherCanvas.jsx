import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useDashboard } from '../context/DashboardContext'

/**
 * DynamicWeatherCanvas
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Overview Tab:
 *    - Full, serene, noise-free atmospheric weather animation
 *    - Gentle, soft raindrops (significantly reduced count & thickness, no visual noise)
 *    - Delicate ground ripples, gentle stars, and warm solar radiance
 *    - Interactive live ambience switcher badge
 * 2. Map, Forecast & All Other Tabs:
 *    - Minimal weather sense only (accurate day/night/sunset sky color grading)
 *    - Zero particle clutter or raindrops over maps, charts, or tables
 *    - Zero switcher badge clutter
 */
export default function DynamicWeatherCanvas({ manualMode, onModeChange }) {
  const canvasRef = useRef(null)
  const location = useLocation()
  const { blockWeatherData, weatherData, liveApiResult, activeBlock } = useDashboard()

  // Determine if user is on the main Overview page
  const isOverview = useMemo(() => {
    const path = (location?.pathname || '').toLowerCase()
    return path.endsWith('/overview') || path === '/dashboard' || path === '/dashboard/'
  }, [location?.pathname])

  // ─── 1. METEOROLOGICAL METRICS RESOLUTION ──────────────────────────────────
  const rainMm = useMemo(() => {
    if (liveApiResult?.variables?.tp?.avg != null) return Number(liveApiResult.variables.tp.avg)
    if (liveApiResult?.tp?.avg != null) return Number(liveApiResult.tp.avg)
    const val = parseFloat(blockWeatherData?.rainfall || weatherData?.rainfall)
    return isNaN(val) ? 0 : val
  }, [liveApiResult, blockWeatherData, weatherData])

  const tempC = useMemo(() => {
    if (liveApiResult?.variables?.t2m?.avg != null) return Number(liveApiResult.variables.t2m.avg)
    if (liveApiResult?.t2m?.avg != null) return Number(liveApiResult.t2m.avg)
    const val = typeof blockWeatherData?.temp === 'number' ? blockWeatherData.temp : parseFloat(blockWeatherData?.temp || weatherData?.temp)
    return isNaN(val) ? 28 : val
  }, [liveApiResult, blockWeatherData, weatherData])

  const windSpeed = useMemo(() => {
    if (liveApiResult?.variables?.ws?.avg != null) return Number(liveApiResult.variables.ws.avg)
    if (liveApiResult?.ws?.avg != null) return Number(liveApiResult.ws.avg)
    const val = parseFloat(blockWeatherData?.wind || weatherData?.wind)
    return isNaN(val) ? 18 : val
  }, [liveApiResult, blockWeatherData, weatherData])

  const conditionText = useMemo(() => {
    if (blockWeatherData?.condition) return blockWeatherData.condition.toLowerCase()
    if (weatherData?.condition) return weatherData.condition.toLowerCase()
    if (rainMm >= 25) return 'heavy rain & showers'
    if (rainMm >= 10) return 'moderate rain'
    if (rainMm >= 2) return 'scattered rain'
    if (tempC >= 32) return 'sunny'
    return 'partly cloudy'
  }, [blockWeatherData, weatherData, rainMm, tempC])

  // Rain, Thunder & Summer condition checks
  const isRaining = useMemo(() => {
    return rainMm >= 1.0 || 
      conditionText.includes('rain') || 
      conditionText.includes('shower') || 
      conditionText.includes('drizzle') || 
      conditionText.includes('thunder') || 
      conditionText.includes('hail') ||
      conditionText.includes('monsoon')
  }, [rainMm, conditionText])

  const isThunder = useMemo(() => {
    return conditionText.includes('thunder') || conditionText.includes('storm') || rainMm >= 32
  }, [conditionText, rainMm])

  const isSunny = useMemo(() => {
    return !isRaining && (
      conditionText.includes('sun') || 
      conditionText.includes('clear') || 
      conditionText.includes('hot') || 
      tempC >= 31
    )
  }, [isRaining, conditionText, tempC])

  // ─── 2. ACCURATE REAL-TIME CLOCK AWARENESS ─────────────────────────────────
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

  // Precise astronomical day/night cycle:
  const realTimeOfDay = useMemo(() => {
    const timeDec = currentHour + currentMinute / 60
    if (timeDec >= 5.0 && timeDec < 7.5) return 'dawn'
    if (timeDec >= 7.5 && timeDec < 17.0) return 'day'
    if (timeDec >= 17.0 && timeDec < 19.5) return 'sunset'
    return 'night'
  }, [currentHour, currentMinute])

  // ─── 3. RESOLVED AMBIENT SCENARIO ──────────────────────────────────────────
  const effectiveScenario = useMemo(() => {
    if (manualMode && manualMode !== 'auto') {
      return manualMode
    }
    // Auto resolution strictly adheres to active meteorological telemetry + time:
    if (isRaining) {
      return realTimeOfDay === 'night' ? 'night-rain' : 'day-rain'
    }
    if (realTimeOfDay === 'night') return 'night-clear'
    if (realTimeOfDay === 'sunset') return 'sunset'
    if (realTimeOfDay === 'dawn') return 'dawn'
    return isSunny ? 'summer-day' : 'day-clouds'
  }, [manualMode, isRaining, realTimeOfDay, isSunny])

  // ─── 4. GPU PARTICLE SIMULATION ENGINE ─────────────────────────────────────
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

    // Particle pools:
    // Only populated when on Overview tab.
    // Kept calm, gentle, and noise-free.
    let numStars = 0
    let numRain = 0
    let numMotes = 0
    let numClouds = isOverview ? 5 : 2

    if (isOverview) {
      if (effectiveScenario.includes('night') || effectiveScenario === 'sunset' || effectiveScenario === 'dawn') {
        numStars = 65 // gentle, delicate twinkle
      }

      if (effectiveScenario.includes('rain') || (effectiveScenario === 'auto' && isRaining)) {
        // Less noise, calm and aesthetic rain
        if (rainMm >= 25) numRain = 85      // Heavy rain: reduced from 300 to 85
        else if (rainMm >= 10) numRain = 45  // Moderate rain: reduced from 190 to 45
        else numRain = 22                   // Light drizzle: reduced from 85 to 22
      }

      if (effectiveScenario === 'summer-day' || (!effectiveScenario.includes('night') && !effectiveScenario.includes('rain') && isSunny)) {
        numMotes = tempC >= 33 ? 28 : 16    // Summer motes: soft golden drift
      }
    }

    let stars = []
    let raindrops = []
    let splashes = []
    let motes = []
    let clouds = []

    const initParticles = () => {
      // 1. Stars pool
      stars = []
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.72),
          radius: Math.random() * 1.3 + 0.3,
          baseAlpha: Math.random() * 0.65 + 0.2,
          twinkleSpeed: Math.random() * 0.025 + 0.008,
          phase: Math.random() * Math.PI * 2,
        })
      }

      // 2. Raindrops pool (gentle, soft, thin strokes)
      raindrops = []
      for (let i = 0; i < numRain; i++) {
        const speedBase = rainMm >= 25 ? 16 : rainMm >= 10 ? 12 : 9
        raindrops.push({
          x: Math.random() * (width + 250) - 100,
          y: Math.random() * height,
          length: rainMm >= 25 ? Math.random() * 14 + 10 : Math.random() * 10 + 6,
          speed: Math.random() * 5 + speedBase,
          thickness: rainMm >= 25 ? Math.random() * 0.3 + 0.8 : Math.random() * 0.2 + 0.6,
          opacity: rainMm >= 25 ? Math.random() * 0.16 + 0.18 : Math.random() * 0.12 + 0.14,
        })
      }
      splashes = []

      // 3. Summer heat shimmer motes
      motes = []
      for (let i = 0; i < numMotes; i++) {
        motes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.2 + 0.8,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(Math.random() * 0.5 + 0.25),
          opacity: Math.random() * 0.45 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.008,
        })
      }

      // 4. Ambient cloud masses
      clouds = []
      for (let i = 0; i < numClouds; i++) {
        clouds.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.45) + 20,
          radius: Math.random() * 160 + 100,
          speed: (Math.random() * 0.15 + 0.05) * (windSpeed / 18),
          opacity: isRaining ? Math.random() * 0.09 + 0.05 : Math.random() * 0.05 + 0.02,
        })
      }
    }

    initParticles()

    let animId
    let lastTime = performance.now()
    let sunRotation = 0
    let lightningIntensity = 0
    let nextLightningTime = performance.now() + Math.random() * 12000 + 6000

    const windAngle = Math.min(26, Math.max(3, (windSpeed / 50) * 24)) * (Math.PI / 180)
    const windTiltX = Math.sin(windAngle)
    const windTiltY = Math.cos(windAngle)

    const render = (time) => {
      const dt = Math.min(time - lastTime, 60)
      lastTime = time
      ctx.clearRect(0, 0, width, height)

      // When NOT on Overview: clean canvas, minimal weather sense only (background tint handles the atmosphere)
      if (!isOverview) {
        animId = requestAnimationFrame(render)
        return
      }

      const isNightMode = effectiveScenario.includes('night')
      const isRainMode = effectiveScenario.includes('rain')
      const isSummerMode = effectiveScenario === 'summer-day' || (!isNightMode && !isRainMode && isSunny)
      const isSunsetMode = effectiveScenario === 'sunset' || effectiveScenario === 'dawn'

      // ─── A. STARS & LUNAR CELESTIAL SKY ──────────────────────
      if ((isNightMode || isSunsetMode) && stars.length > 0) {
        const starFade = isNightMode ? (isRainMode ? 0.35 : 0.85) : 0.3
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i]
          s.phase += s.twinkleSpeed * (dt / 16)
          const alpha = (s.baseAlpha + Math.sin(s.phase) * 0.28) * starFade
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(235, 245, 255, ${Math.max(0.06, Math.min(0.9, alpha))})`
          if (s.radius > 1.1 && !isRainMode) {
            ctx.shadowBlur = 4
            ctx.shadowColor = 'rgba(210, 235, 255, 0.6)'
          } else {
            ctx.shadowBlur = 0
          }
          ctx.fill()
        }
        ctx.shadowBlur = 0

        // Moon & Luminous Lunar Halo
        if (isNightMode) {
          const moonX = width * 0.78
          const moonY = height * 0.14
          const moonAlpha = isRainMode ? 0.28 : 0.9

          const haloGrad = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 120)
          haloGrad.addColorStop(0, `rgba(215, 235, 255, ${0.18 * moonAlpha})`)
          haloGrad.addColorStop(0.5, `rgba(160, 205, 250, ${0.06 * moonAlpha})`)
          haloGrad.addColorStop(1, 'rgba(10, 25, 45, 0)')
          ctx.beginPath()
          ctx.arc(moonX, moonY, 120, 0, Math.PI * 2)
          ctx.fillStyle = haloGrad
          ctx.fill()

          // Crescent Moon
          ctx.save()
          ctx.beginPath()
          ctx.arc(moonX, moonY, 18, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${moonAlpha})`
          ctx.shadowColor = 'rgba(255, 255, 255, 0.75)'
          ctx.shadowBlur = isRainMode ? 4 : 10
          ctx.fill()

          ctx.beginPath()
          ctx.arc(moonX + 7, moonY - 3, 16, 0, Math.PI * 2)
          ctx.fillStyle = '#061320'
          ctx.shadowBlur = 0
          ctx.fill()
          ctx.restore()
        }
      }

      // ─── B. SUMMER SUN & RADIANT GOD RAYS ───────────────────
      if (isSummerMode) {
        sunRotation += 0.0014 * (dt / 16)
        const sunX = width * 0.72
        const sunY = height * 0.16

        // Solar Aura
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 280)
        sunGlow.addColorStop(0, 'rgba(255, 235, 160, 0.30)')
        sunGlow.addColorStop(0.35, 'rgba(254, 215, 102, 0.14)')
        sunGlow.addColorStop(0.7, 'rgba(251, 146, 60, 0.04)')
        sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.beginPath()
        ctx.arc(sunX, sunY, 280, 0, Math.PI * 2)
        ctx.fillStyle = sunGlow
        ctx.fill()

        // Rotating God Rays
        ctx.save()
        ctx.translate(sunX, sunY)
        ctx.rotate(sunRotation)
        const rayCount = 10
        for (let r = 0; r < rayCount; r++) {
          const angle = (r * Math.PI * 2) / rayCount
          const rayLen = r % 2 === 0 ? 240 : 170
          const raySpread = 0.07
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(Math.cos(angle - raySpread) * rayLen, Math.sin(angle - raySpread) * rayLen)
          ctx.lineTo(Math.cos(angle + raySpread) * rayLen, Math.sin(angle + raySpread) * rayLen)
          ctx.closePath()
          const rayGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, rayLen)
          rayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.15)')
          rayGrad.addColorStop(0.5, 'rgba(253, 186, 116, 0.05)')
          rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = rayGrad
          ctx.fill()
        }
        ctx.restore()

        // Solar Core Disc
        ctx.beginPath()
        ctx.arc(sunX, sunY, 28, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 245, 0.92)'
        ctx.shadowColor = 'rgba(253, 224, 71, 0.8)'
        ctx.shadowBlur = 18
        ctx.fill()
        ctx.shadowBlur = 0

        // Summer Heat Shimmer Motes
        for (let m = 0; m < motes.length; m++) {
          const mote = motes[m]
          mote.y += mote.vy * (dt / 16)
          mote.x += (mote.vx + Math.sin(mote.y * 0.015 + mote.pulse) * 0.25) * (dt / 16)
          mote.pulse += mote.pulseSpeed

          if (mote.y < -10) {
            mote.y = height + 10
            mote.x = Math.random() * width
          }
          if (mote.x < -10) mote.x = width + 10
          if (mote.x > width + 10) mote.x = -10

          const mAlpha = mote.opacity * (0.6 + Math.sin(mote.pulse) * 0.35)
          ctx.beginPath()
          ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(254, 240, 138, ${mAlpha})`
          ctx.shadowColor = 'rgba(250, 204, 21, 0.45)'
          ctx.shadowBlur = 3
          ctx.fill()
        }
        ctx.shadowBlur = 0
      }

      // ─── C. ROLLING ATMOSPHERIC CLOUDS ───────────────────────
      for (let c = 0; c < clouds.length; c++) {
        const cloud = clouds[c]
        cloud.x += cloud.speed * (dt / 16)
        if (cloud.x - cloud.radius > width) {
          cloud.x = -cloud.radius
          cloud.y = Math.random() * (height * 0.45) + 20
        }

        const cloudGrad = ctx.createRadialGradient(cloud.x, cloud.y, cloud.radius * 0.2, cloud.x, cloud.y, cloud.radius)
        if (isNightMode) {
          cloudGrad.addColorStop(0, `rgba(26, 40, 60, ${cloud.opacity * 1.4})`)
          cloudGrad.addColorStop(1, 'rgba(8, 16, 28, 0)')
        } else if (isSunsetMode) {
          cloudGrad.addColorStop(0, `rgba(235, 120, 140, ${cloud.opacity * 1.6})`)
          cloudGrad.addColorStop(1, 'rgba(200, 80, 100, 0)')
        } else {
          cloudGrad.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity * 1.8})`)
          cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        }
        ctx.beginPath()
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2)
        ctx.fillStyle = cloudGrad
        ctx.fill()
      }

      // ─── D. GENTLE, NOISE-FREE RAINDROP ENGINE ────────────────
      if (isRainMode && raindrops.length > 0) {
        // Soft thunder ambient glow (rare & subtle)
        if (isThunder && time > nextLightningTime) {
          lightningIntensity = 0.45
          nextLightningTime = time + Math.random() * 14000 + 7000
        }
        if (lightningIntensity > 0) {
          ctx.fillStyle = `rgba(220, 235, 255, ${lightningIntensity * 0.22})`
          ctx.fillRect(0, 0, width, height)
          lightningIntensity -= 0.03 * (dt / 16)
        }

        const dropColor = isNightMode ? 'rgba(195, 220, 255,' : 'rgba(255, 255, 255,'
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

          // Ground / bottom subtle ripple splash
          if (drop.y > height - 10) {
            if (Math.random() < 0.25 && splashes.length < 20) {
              splashes.push({
                x: drop.x,
                y: height - Math.random() * 12,
                radius: 0.8,
                maxRadius: rainMm >= 25 ? Math.random() * 5 + 3 : Math.random() * 3 + 2,
                alpha: 0.35,
              })
            }
            drop.y = -drop.length
            drop.x = Math.random() * (width + 250) - 100
          }
          if (drop.x > width + 100) drop.x = -50
        }

        // Render soft splash ripples
        for (let s = splashes.length - 1; s >= 0; s--) {
          const splash = splashes[s]
          splash.radius += 0.35 * (dt / 16)
          splash.alpha -= 0.025 * (dt / 16)
          if (splash.alpha <= 0) {
            splashes.splice(s, 1)
            continue
          }
          ctx.beginPath()
          ctx.ellipse(splash.x, splash.y, splash.radius * 2, splash.radius * 0.7, 0, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(215, 235, 255, ${splash.alpha})`
          ctx.lineWidth = 0.8
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
  }, [effectiveScenario, windSpeed, rainMm, tempC, isRaining, isThunder, isSunny, conditionText, isOverview])

  // ─── 5. SKY GRADIENT COLOR GRADING (MINIMAL WEATHER SENSE ACROSS ALL TABS) ─
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

  // ─── 6. LIVE METRIC STATUS LABEL ───────────────────────────────────────────
  const displayLabel = useMemo(() => {
    const timeStr = `${currentHour % 12 || 12}:${currentMinute < 10 ? '0' : ''}${currentMinute} ${currentHour >= 12 ? 'PM' : 'AM'}`

    switch (effectiveScenario) {
      case 'night-rain':
        return `🌙 Night Rain • ${timeStr} (${rainMm}mm)`
      case 'night-clear':
        return `🌙 Starry Night • ${timeStr} (${tempC}°C)`
      case 'day-rain':
        return `🌧️ Live Rain • ${timeStr} (${rainMm}mm)`
      case 'summer-day':
        return `☀️ Summer Sun • ${timeStr} (${tempC}°C)`
      case 'sunset':
        return `🌅 Golden Sunset • ${timeStr}`
      case 'dawn':
        return `🌄 Morning Dawn • ${timeStr}`
      default:
        return `🌤️ Live • ${timeStr}`
    }
  }, [effectiveScenario, currentHour, currentMinute, rainMm, tempC])

  return (
    <>
      {/* Background color grading & dynamic gradient tint (Minimal Weather Sense for All Tabs) */}
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

      {/* Live Particle Canvas: Rendered on Overview only; clean & cleared on other tabs */}
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

      {/* Floating Interactive Ambience & Time Controller Badge (Overview Tab Only) */}
      {isOverview && (
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
            <option value="auto" style={{ background: '#0f172a', color: '#fff' }}>⚡ Auto (Trained ML & Live Telemetry)</option>
            <option value="day-rain" style={{ background: '#0f172a', color: '#fff' }}>🌧️ Daytime Rain Showers</option>
            <option value="night-rain" style={{ background: '#0f172a', color: '#fff' }}>🌧️🌙 Night Monsoon Rain</option>
            <option value="summer-day" style={{ background: '#0f172a', color: '#fff' }}>☀️ Summer Sun & Heat</option>
            <option value="night-clear" style={{ background: '#0f172a', color: '#fff' }}>🌙 Starry Night Sky</option>
            <option value="sunset" style={{ background: '#0f172a', color: '#fff' }}>🌅 Golden Sunset</option>
            <option value="dawn" style={{ background: '#0f172a', color: '#fff' }}>🌄 Morning Dawn</option>
          </select>
        </div>
      )}
    </>
  )
}
