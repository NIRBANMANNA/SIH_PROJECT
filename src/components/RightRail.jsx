import { Icon } from './IconSprite'
import { useDashboard } from '../context/DashboardContext'
import { getBlockWeatherData, getWeatherData } from '../data/mockWeather'

// Shared glass card base style
const cardBase = {
  background: 'linear-gradient(180deg, rgba(255,255,255,.20) 0%, rgba(255,255,255,.258) 24%, rgba(255,255,255,.252) 78%, rgba(255,255,255,.232) 100%)',
  backdropFilter: 'blur(calc(26 * var(--u))) saturate(118%)',
  WebkitBackdropFilter: 'blur(calc(26 * var(--u))) saturate(118%)',
  position: 'relative',
  overflow: 'hidden',
  flexShrink: 0,
  transition: 'transform 0.2s, background 0.2s',
}

// Big card: Current active block weather
function BigCard({ cityData, tempUnit }) {
  if (!cityData) return null;
  const displayTemp = tempUnit === 'F' ? Math.round(cityData.temp * 9/5 + 32) : cityData.temp

  return (
    <div
      className="anim-card1 sheen"
      style={{
        ...cardBase,
        borderRadius: 'calc(26 * var(--u))',
        padding: 'calc(22 * var(--u)) calc(24 * var(--u))',
      }}
      aria-label={`${cityData.city || cityData.block} weather`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          className="anim-place"
          style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', fontSize: 'calc(13.5 * var(--u))', fontWeight: 600, color: 'rgba(255,255,255,.92)' }}
        >
          <Icon id="i-pin" width="13" height="13" style={{ opacity: 0.85, color: '#38bdf8' }} />
          {cityData.block ? `${cityData.block} (Block)` : cityData.city}
        </div>
        {cityData.totalPanchayats && (
          <span style={{ fontSize: 'calc(11 * var(--u))', padding: 'calc(3 * var(--u)) calc(8 * var(--u))', background: 'rgba(255,255,255,0.14)', borderRadius: 'calc(10 * var(--u))', color: 'rgba(255,255,255,0.85)' }}>
            {cityData.totalPanchayats} Panchayats
          </span>
        )}
      </div>

      <div
        className="anim-bigtemp"
        style={{
          fontFamily: "'Inter Tight', 'Inter', sans-serif",
          fontSize: 'calc(92 * var(--u))',
          fontWeight: 500,
          letterSpacing: 'calc(-4.4 * var(--u))',
          lineHeight: 1,
          color: '#fff',
          marginTop: 'calc(4 * var(--u))',
        }}
      >
        {displayTemp}<span style={{ fontStyle: 'normal', fontSize: 'calc(38 * var(--u))', letterSpacing: 0, verticalAlign: 'super' }}>°{tempUnit}</span>
      </div>

      <div style={{ display: 'flex', gap: 'calc(18 * var(--u))', marginTop: 'calc(14 * var(--u))' }}>
        {[
          { icon: 'i-wind', text: cityData.wind, cls: 'anim-met1' },
          { icon: 'i-drop', text: cityData.humidity, cls: 'anim-met2' },
          { icon: 'i-gust', text: cityData.rainfall || cityData.gusts, cls: 'anim-met3' },
        ].map(({ icon, text, cls }) => (
          <div
            key={icon}
            className={cls}
            style={{ display: 'flex', alignItems: 'center', gap: 'calc(5 * var(--u))', fontSize: 'calc(13 * var(--u))', fontWeight: 500, color: 'rgba(255,255,255,.90)' }}
          >
            <Icon id={icon} width="15" height="15" style={{ opacity: 0.75 }} />
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}

// Row card: clickable smaller location card
function RowCard({ animCls, region, city, condition, icon, temp, onClick, subBadge }) {
  return (
    <div
      className={`${animCls} sheen`}
      onClick={onClick}
      style={{
        ...cardBase,
        height: 'calc(118 * var(--u))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'calc(16 * var(--u)) calc(22 * var(--u))',
        borderRadius: 'calc(22 * var(--u))',
        cursor: 'pointer',
      }}
      aria-label={`${city} weather`}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(calc(-2 * var(--u)))';
        e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,255,255,.25) 0%, rgba(255,255,255,.30) 100%)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,255,255,.20) 0%, rgba(255,255,255,.232) 100%)';
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6 * var(--u))', marginBottom: 'calc(4 * var(--u))' }}>
          <span style={{ fontSize: 'calc(11 * var(--u))', fontWeight: 600, color: 'rgba(255,255,255,.65)', letterSpacing: 'calc(.4 * var(--u))', textTransform: 'uppercase' }}>
            {region}
          </span>
          {subBadge && (
            <span style={{ fontSize: 'calc(10 * var(--u))', color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.12)', padding: 'calc(1 * var(--u)) calc(6 * var(--u))', borderRadius: 'calc(6 * var(--u))' }}>
              {subBadge}
            </span>
          )}
        </div>
        <div style={{ fontSize: 'calc(17 * var(--u))', fontWeight: 600, color: '#fff', marginBottom: 'calc(3 * var(--u))' }}>
          {city}
        </div>
        <div style={{ fontSize: 'calc(12 * var(--u))', fontWeight: 400, color: 'rgba(255,255,255,.78)' }}>
          {condition}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'calc(6 * var(--u))' }}>
        <Icon id={icon} width="36" height="36" />
        <span style={{ fontSize: 'calc(24 * var(--u))', fontWeight: 500, letterSpacing: 'calc(-.5 * var(--u))', color: '#fff' }}>{temp}</span>
      </div>
    </div>
  )
}

export default function RightRail({ tempUnit = 'C', style }) {
  const { 
    activeBlock, 
    handleBlockChange, 
    blocksInDistrict, 
    blockWeatherData,
    activeDistrict
  } = useDashboard()

  // Get other blocks in this district to render as interactive cards
  const inactiveBlocks = (blocksInDistrict || [])
    .filter(b => b.toLowerCase() !== (activeBlock || '').toLowerCase())
    .slice(0, 3)

  const formatTemp = (tempVal) => {
    const value = tempUnit === 'F' ? Math.round(tempVal * 9/5 + 32) : tempVal
    return `${value}°`
  }

  const rowAnimClasses = ['anim-card2', 'anim-card3', 'anim-card4']

  return (
    <aside
      className="right-rail-aside"
      aria-label="Block level weather cards"
      style={{
        position: 'absolute',
        right: 'calc(38 * var(--u))',
        top: 'calc(134 * var(--u))',
        bottom: 'calc(95 * var(--u))',
        width: 'calc(310 * var(--u))',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(12 * var(--u))',
        ...style
      }}
    >
      <BigCard cityData={blockWeatherData} tempUnit={tempUnit} />
      
      {inactiveBlocks.map((blkName, idx) => {
        const data = getBlockWeatherData(blkName, activeDistrict)
        if (!data) return null;
        
        return (
          <RowCard
            key={blkName}
            animCls={rowAnimClasses[idx]}
            region={data.region}
            city={`${blkName} Block`}
            condition={`${data.condition} • ${data.rainfall}`}
            icon={data.conditionId}
            temp={formatTemp(data.temp)}
            subBadge={`${data.totalPanchayats} GPs`}
            onClick={() => handleBlockChange(blkName)}
          />
        )
      })}
    </aside>
  )
}
