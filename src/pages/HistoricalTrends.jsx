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
      <div style={{ backgroundColor: 'rgba(0,0,0,0.85)', padding: '12px', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', backdropFilter: 'blur(10px)', minWidth: '180px' }}>
        <p style={{ fontWeight: 600, marginBottom: '10px', opacity: 0.9 }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ color: entry.color, display: 'flex', gap: '12px', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>{entry.name}:</span>
            <span style={{ fontWeight: 600 }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function HistoricalTrends() {
  const { weatherData } = useDashboard()
  const [timeframe, setTimeframe] = useState('10 Years')
  const timeframes = ['1 Year', '5 Years', '10 Years']

  const data = mockHistoricalData[timeframe]

  const chartCardStyle = {
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 'calc(16 * var(--u))',
    padding: 'calc(24 * var(--u))',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
  }

  const titleStyle = { 
    fontSize: 'calc(20 * var(--u))', 
    fontWeight: 600, 
    marginBottom: 'calc(24 * var(--u))',
    color: '#fff'
  }

  return (
    <div style={tabViewBaseStyle}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'calc(32 * var(--u))', flexShrink: 0, flexWrap: 'wrap', gap: 'calc(16 * var(--u))' }}>
        <div>
          <h2 style={{ fontSize: 'calc(32 * var(--u))', fontWeight: 600, letterSpacing: 'calc(-.4 * var(--u))' }}>Historical Trends</h2>
          <p style={{ fontSize: 'calc(16 * var(--u))', color: 'rgba(255,255,255,0.7)', marginTop: 'calc(4 * var(--u))' }}>
            Historical Average vs Current Forecast for {weatherData.city}
          </p>
        </div>

        {/* Timeframe Selector */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', padding: 'calc(4 * var(--u))', borderRadius: 'calc(12 * var(--u))' }}>
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: 'calc(8 * var(--u)) calc(16 * var(--u))',
                borderRadius: 'calc(8 * var(--u))',
                fontSize: 'calc(14 * var(--u))',
                fontWeight: timeframe === tf ? 600 : 500,
                color: timeframe === tf ? '#fff' : 'rgba(255,255,255,0.6)',
                background: timeframe === tf ? 'rgba(255,255,255,0.2)' : 'transparent',
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'calc(24 * var(--u))', paddingBottom: 'calc(40 * var(--u))' }}>
        
        {/* Rainfall Chart */}
        <div style={chartCardStyle}>
          <h3 style={titleStyle}>Rainfall (mm)</h3>
          <div style={{ flex: 1, minHeight: 'calc(280 * var(--u))' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }} tickLine={false} axisLine={false} padding={{ left: 20, right: 20 }} />
                <YAxis width={40} stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', paddingTop: '10px' }} />
                <Bar dataKey="rainHist" name="Historical Average" fill="rgba(255,255,255,0.2)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="rainCur" name="Current Forecast" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temperature Chart */}
        <div style={chartCardStyle}>
          <h3 style={titleStyle}>Temperature (°C)</h3>
          <div style={{ flex: 1, minHeight: 'calc(280 * var(--u))' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }} tickLine={false} axisLine={false} padding={{ left: 20, right: 20 }} />
                <YAxis width={40} domain={['dataMin - 5', 'auto']} stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="tempHist" name="Historical Average" stroke="rgba(255,255,255,0.4)" strokeWidth={3} dot={{ r: 4, fill: 'rgba(255,255,255,0.4)', stroke: 'none' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="tempCur" name="Current Forecast" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', stroke: 'none' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humidity Chart */}
        <div style={chartCardStyle}>
          <h3 style={titleStyle}>Humidity (%)</h3>
          <div style={{ flex: 1, minHeight: 'calc(280 * var(--u))' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHumHist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(255,255,255,0.3)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="rgba(255,255,255,0.3)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHumCur" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }} tickLine={false} axisLine={false} padding={{ left: 20, right: 20 }} />
                <YAxis width={40} domain={[40, 100]} stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="humHist" name="Historical Average" stroke="rgba(255,255,255,0.4)" fillOpacity={1} fill="url(#colorHumHist)" />
                <Area type="monotone" dataKey="humCur" name="Current Forecast" stroke="#10b981" fillOpacity={1} fill="url(#colorHumCur)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rainy Days Chart */}
        <div style={chartCardStyle}>
          <h3 style={titleStyle}>Rainy Days (Days/Month)</h3>
          <div style={{ flex: 1, minHeight: 'calc(280 * var(--u))' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }} tickLine={false} axisLine={false} padding={{ left: 20, right: 20 }} />
                <YAxis width={40} stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', paddingTop: '10px' }} />
                <Bar dataKey="daysHist" name="Historical Average" fill="rgba(255,255,255,0.2)" radius={[6, 6, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="daysCur" name="Current Forecast" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4, fill: '#60a5fa', stroke: 'none' }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Extreme Weather Events Chart */}
        <div style={{ ...chartCardStyle, gridColumn: '1 / -1' }}>
          <h3 style={titleStyle}>Extreme Weather Events (Anomalies)</h3>
          <div style={{ flex: 1, minHeight: 'calc(280 * var(--u))' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }} tickLine={false} axisLine={false} padding={{ left: 20, right: 20 }} />
                <YAxis width={40} stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', paddingTop: '10px' }} />
                <Bar dataKey="extremeHist" name="Historical Average" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="extremeCur" name="Current Forecast" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}
