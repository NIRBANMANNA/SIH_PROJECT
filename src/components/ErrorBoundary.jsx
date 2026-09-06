import React, { Component } from 'react'
import { Icon } from './IconSprite'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Kisan Darpan Dashboard Caught Error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (this.props.onReset) {
      this.props.onReset()
    } else {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'absolute',
          top: 'calc(64 * var(--u))',
          left: 'calc(72 * var(--u))',
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'calc(24 * var(--u))',
          zIndex: 50,
          background: 'rgba(4, 18, 27, 0.75)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{
            maxWidth: '540px',
            width: '100%',
            background: 'linear-gradient(135deg, rgba(26, 38, 57, 0.85) 0%, rgba(13, 22, 34, 0.95) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'calc(16 * var(--u))',
            padding: 'calc(28 * var(--u))',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 24px rgba(239, 68, 68, 0.15)',
            textAlign: 'center',
            color: '#fff'
          }}>
            <div style={{
              width: 'calc(54 * var(--u))',
              height: 'calc(54 * var(--u))',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto calc(16 * var(--u))',
              color: '#ef4444'
            }}>
              <Icon id="i-alert" width="28" height="28" />
            </div>

            <h2 style={{
              fontSize: 'calc(18 * var(--u))',
              fontWeight: 700,
              marginBottom: 'calc(8 * var(--u))',
              letterSpacing: '-0.02em',
              color: '#f87171'
            }}>
              View Temporarily Interrupted
            </h2>

            <p style={{
              fontSize: 'calc(13 * var(--u))',
              color: 'rgba(255, 255, 255, 0.75)',
              lineHeight: 1.5,
              marginBottom: 'calc(20 * var(--u))'
            }}>
              Kisan Darpan encountered an unexpected issue while rendering this section. Your telemetry and session state remain safe.
            </p>

            {this.state.error && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'calc(8 * var(--u))',
                padding: 'calc(10 * var(--u)) calc(14 * var(--u))',
                fontSize: 'calc(11 * var(--u))',
                fontFamily: 'monospace',
                color: '#fda4af',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: 'calc(20 * var(--u))',
                maxHeight: '80px'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: 'calc(12 * var(--u))', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'calc(8 * var(--u))',
                  padding: 'calc(10 * var(--u)) calc(20 * var(--u))',
                  fontSize: 'calc(13 * var(--u))',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'calc(6 * var(--u))',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Icon id="i-refresh" width="15" height="15" />
                Reload View
              </button>

              <button
                onClick={() => { window.location.href = '/dashboard/overview' }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 'calc(8 * var(--u))',
                  padding: 'calc(10 * var(--u)) calc(16 * var(--u))',
                  fontSize: 'calc(13 * var(--u))',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Go to Overview
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
