import React, { useState } from 'react'
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart
} from 'recharts'
import { tabViewBaseStyle } from '../lib/styles'
import { mockHistoricalData } from '../data/mockHistorical'
import { useDashboard } from '../context/DashboardContext'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: 'rgba(5, 18, 28, 0.94)', 
        padding: 'calc(12 * var(--u)) calc(16 * var(--u))', 
        border: '1px solid rgba(255,255,255,0.18)', 
        borderRadius: 'calc(10 * var(--u))', 
        color: '#fff', 
        fontSize: 'calc(13 * var(--u))', 
        backdropFilter: 'blur(12px)', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        minWidth: 'calc(190 * var(--u))' 
      }}>
        <p style={{ fontWeight: 700, marginBottom: 'calc(8 * var(--u))', color: '#93c5fd', fontSize: 'calc(14 * var(--u))' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ color: entry.color, display: 'flex', gap: 'calc(14 * var(--u))', justifyContent: 'space-between', marginBottom: 'calc(4 * var(--u))', fontSize: 'calc(12.5 * var(--u))' }}>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>{entry.name}:</span>
            <span style={{ fontWeight: 700, color: entry.color }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function HistoricalTrends() {
  const { weatherData, activeBlock, activeDistrict } = useDashboard()
  const [timeframe, setTimeframe] = useState('10 Years')
  const timeframes = ['1 Year', '5 Years', '10 Years']

  const data = mockHistoricalData[timeframe] || mockHistoricalData['10 Years']

  const chartCardStyle = {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'calc(18 * var(--u))',
    padding: 'calc(22 * var(--u)) calc(24 * var(--u))',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    minWidth: 0, // Prevents flex/grid overflow truncation
    overflow: 'hidden'
  }

  const titleStyle = { 
    fontSize: 'calc(18 * var(--u))', 
    fontWeight: 600, 
    marginBottom: 'calc(18 * var(--u))',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }

  const chartMargin = { top: 16, right: 24, left: 10, bottom: 12 }

  return (
    <div style={tabViewBaseStyle}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'calc(28 * var(--u))', flexShrink: 0, flexWrap: 'wrap', gap: 'calc(16 * var(--u))' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10 * var(--u))' }}>
            <h2 style={{ fontSize: 'calc(28 * var(--u))', fontWeight: 700, letterSpacing: 'calc(-.4 * var(--u))', color: '#fff' }}>Historical Climate Trends</h2>
            <span style={{ fontSize: 'calc(12 * var(--u))', padding: 'calc(3 * var(--u)) calc(10 * var(--u))', background: 'rgba(56, 189, 248, 0.18)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: 'calc(12 * var(--u))', color: '#7dd3fc', fontWeight: 600 }}>
              {activeBlock ? `${activeBlock} Block` : activeDistrict}
            </span>
          </div>
          <p style={{ fontSize: 'calc(14.5 * var(--u))', color: 'rgba(255,255,255,0.72)', marginTop: 'calc(6 * var(--u))' }}>
            Comparative Baseline (Multi-Decadal WRF Climatology vs Downscaled Model Predictions)
          </p>
        </div>

        {/* Timeframe Selector */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', padding: 'calc(4 * var(--u))', borderRadius: 'calc(12 * var(--u))', border: '1px solid rgba(255,255,255,0.12)' }}>
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: 'calc(8 * var(--u)) calc(16 * var(--u))',
                borderRadius: 'calc(8 * var(--u))',
                fontSize: 'calc(13 * var(--u))',
                fontWeight: timeframe === tf ? 600 : 500,
                color: timeframe === tf ? '#fff' : 'rgba(255,255,255,0.65)',
                background: timeframe === tf ? 'rgba(255,255,255,0.22)' : 'transparent',
                boxShadow: timeframe === tf ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout for Charts */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(calc(440 * var(--u)), 1fr))', 
        gap: 'calc(24 * var(--u))', 
        paddingBottom: 'calc(60 * var(--u))' 
      }}>
        
        {/* Rainfall Chart */}
        <div style={chartCardStyle}>
          <div style={titleStyle}>
            <span>Rainfall Comparison</span>
            <span style={{ fontSize: 'calc(12 * var(--u))', color: '#93c5fd', fontWeight: 500 }}>Unit: mm</span>
          </div>
          <div style={{ width: '100%', height: 'calc(300 * var(--u))' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12.5 }} tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis width={52} stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12.5 }} tickLine={false} axisLine={false} tickMargin={6} tickFormatter={(val) => `${val} mm`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.06)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', paddingTop: '12px' }} />
                <Bar dataKey="rainHist" name="Historical Average" fill="rgba(255,255,255,0.24)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="rainCur" name="Current Forecast" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temperature Chart */}
        <div style={chartCardStyle}>
          <div style={titleStyle}>
            <span>Temperature Profile</span>
            <span style={{ fontSize: 'calc(12 * var(--u))', color: '#fbbf24', fontWeight: 500 }}>Unit: °C</span>
          </div>
          <div style={{ width: '100%', height: 'calc(300 * var(--u))' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12.5 }} tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis width={46} domain={['dataMin - 4', 'dataMax + 4']} stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12.5 }} tickLine={false} axisLine={false} tickMargin={6} tickFormatter={(val) => `${val}°C`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', paddingTop: '12px' }} />
                <Line type="monotone" dataKey="tempHist" name="Historical Average" stroke="rgba(255,255,255,0.45)" strokeWidth={2.8} dot={{ r: 4, fill: 'rgba(255,255,255,0.6)', stroke: 'none' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="tempCur" name="Current Forecast" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4.5, fill: '#f59e0b', stroke: '#fff', strokeWidth: 1.5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humidity Chart */}
        <div style={chartCardStyle}>
          <div style={titleStyle}>
            <span>Relative Humidity</span>
            <span style={{ fontSize: 'calc(12 * var(--u))', color: '#34d399', fontWeight: 500 }}>Unit: % RH</span>
          </div>
          <div style={{ width: '100%', height: 'calc(300 * var(--u))' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={chartMargin}>
                <defs>
                  <linearGradient id="colorHumHist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(255,255,255,0.35)" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="rgba(255,255,255,0.35)" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="colorHumCur" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12.5 }} tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis width={46} domain={[30, 100]} stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12.5 }} tickLine={false} axisLine={false} tickMargin={6} tickFormatter={(val) => `${val}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', paddingTop: '12px' }} />
                <Area type="monotone" dataKey="humHist" name="Historical Average" stroke="rgba(255,255,255,0.45)" fillOpacity={1} fill="url(#colorHumHist)" />
                <Area type="monotone" dataKey="humCur" name="Current Forecast" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHumCur)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rainy Days Chart */}
        <div style={chartCardStyle}>
          <div style={titleStyle}>
            <span>Precipitation Frequency</span>
            <span style={{ fontSize: 'calc(12 * var(--u))', color: '#60a5fa', fontWeight: 500 }}>Days / Month</span>
          </div>
          <div style={{ width: '100%', height: 'calc(300 * var(--u))' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12.5 }} tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis width={46} stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12.5 }} tickLine={false} axisLine={false} tickMargin={6} tickFormatter={(val) => `${val}d`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', paddingTop: '12px' }} />
                <Bar dataKey="daysHist" name="Historical Average" fill="rgba(255,255,255,0.24)" radius={[6, 6, 0, 0]} barSize={22} />
                <Line type="monotone" dataKey="daysCur" name="Current Forecast" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4.5, fill: '#60a5fa', stroke: '#fff', strokeWidth: 1.5 }} activeDot={{ r: 7 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Extreme Weather Events Chart */}
        <div style={{ ...chartCardStyle, gridColumn: '1 / -1' }}>
          <div style={titleStyle}>
            <span>Extreme Weather Anomalies & Heavy Outliers</span>
            <span style={{ fontSize: 'calc(12 * var(--u))', color: '#f87171', fontWeight: 500 }}>Incidents / Month</span>
          </div>
          <div style={{ width: '100%', height: 'calc(300 * var(--u))' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12.5 }} tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis width={46} stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12.5 }} tickLine={false} axisLine={false} tickMargin={6} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.06)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', paddingTop: '12px' }} />
                <Bar dataKey="extremeHist" name="Historical Average" fill="rgba(255,255,255,0.24)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="extremeCur" name="Current Forecast" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}
