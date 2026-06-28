'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [selectedLang, setSelectedLang] = useState({ code: 'en', label: 'English', flag: '🇬🇧' })

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'sw', label: 'Kiswahili', flag: '🇹🇿' }
  ]

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#0d1f3c',
      color: '#f9f7f3',
      fontFamily: 'Inter, Arial, sans-serif',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background with gradient and pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,150,60,0.08), transparent 70%),
          radial-gradient(ellipse 50% 40% at 80% 80%, rgba(46,107,79,0.06), transparent 60%)
        `,
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(200,150,60,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(200,150,60,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)'
      }} />

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 40px',
        background: 'rgba(13,31,60,0.85)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(200,150,60,0.12)'
      }}>
        <div style={{
          fontFamily: "'Fraunces', serif",
          fontSize: '22px',
          fontWeight: 700,
          color: '#f5efe0',
          letterSpacing: '-0.01em'
        }}>
          Ndak<span style={{ color: '#c8963c' }}>w</span>izera
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#d4cfc5',
                cursor: 'pointer',
                padding: '5px 12px',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '999px',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {selectedLang.flag} {selectedLang.label} ▾
            </button>
            
            {showLangDropdown && (
              <div style={{
                position: 'absolute',
                top: '36px',
                right: 0,
                background: '#1a2e50',
                border: '1px solid rgba(200,150,60,0.2)',
                borderRadius: '10px',
                padding: '6px',
                minWidth: '140px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.4)'
              }}>
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang)
                      setShowLangDropdown(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      fontSize: '12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: '#d4cfc5',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(200,150,60,0.12)'
                      e.currentTarget.style.color = '#c8963c'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#d4cfc5'
                    }}
                  >
                    <span>{lang.flag}</span> {lang.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/dashboard">
            <button style={{
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              background: '#c8963c',
              color: '#2c1c05',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 20px',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.12s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e3b96a'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#c8963c'}
            >
              Sign In
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative'
      }}>
        {/* Trust Seal */}
        <div style={{
          position: 'relative',
          marginBottom: '48px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '1.5px solid rgba(200,150,60,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #e3b768, #a3742a 75%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(200,150,60,0.4), 0 0 0 3px rgba(200,150,60,0.2)'
            }}>
              <svg viewBox="0 0 36 36" fill="none" style={{ width: '36px', height: '36px' }}>
                <path d="M18 4L22 14H33L24 20L27 31L18 25L9 31L12 20L3 14H14L18 4Z" fill="#2c1c05" opacity="0.3"/>
                <path d="M18 7L21 15.5H30L23 20.5L25.5 29L18 24.5L10.5 29L13 20.5L6 15.5H15L18 7Z" fill="#2c1c05"/>
              </svg>
            </div>
          </div>
        </div>

        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#c8963c',
          marginBottom: '18px'
        }}>
          Verified Asset &amp; Liability Transparency Platform
        </p>

        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(42px, 7vw, 72px)',
          fontWeight: 600,
          lineHeight: 1.05,
          color: '#f5efe0',
          letterSpacing: '-0.02em',
          marginBottom: '10px'
        }}>
          Know what you're<br />
          building your life <em style={{ fontStyle: 'italic', color: '#c8963c' }}>on</em>
        </h1>

        <p style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(14px, 2.5vw, 18px)',
          fontStyle: 'italic',
          color: 'rgba(200,150,60,0.7)',
          marginBottom: '24px'
        }}>
          "Ndakwizera" — I Trust You, in Kinyarwanda
        </p>

        <p style={{
          fontSize: 'clamp(14px, 2vw, 17px)',
          color: '#d4cfc5',
          lineHeight: 1.65,
          maxWidth: '520px',
          margin: '0 auto 36px'
        }}>
          Before you marry, during a dispute, or settling an inheritance — Ndakwizera gives you legally verified, 
          institution-confirmed records about a person's land, vehicles, businesses, and debts.
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/request">
            <button style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 700,
              background: '#c8963c',
              color: '#2c1c05',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 28px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(200,150,60,0.35)',
              transition: 'background 0.2s, transform 0.12s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e3b96a'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(200,150,60,0.45)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#c8963c'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,150,60,0.35)'
            }}
            >
              Submit a transparency request
            </button>
          </Link>
          <button style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            background: 'transparent',
            color: '#f5efe0',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '10px',
            padding: '14px 28px',
            cursor: 'pointer',
            transition: 'border-color 0.2s, color 0.2s, transform 0.12s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#c8963c'
            e.currentTarget.style.color = '#c8963c'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
            e.currentTarget.style.color = '#f5efe0'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
          >
            See how it works
          </button>
        </div>

        <div style={{
          marginTop: '48px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#7e8aab'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2e6b4f' }}></span>
            Legal approval required on every request
          </div>
          <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '18px' }}>·</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#7e8aab'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2e6b4f' }}></span>
            OTP-verified access only
          </div>
          <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '18px' }}>·</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#7e8aab'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2e6b4f' }}></span>
            No data stored beyond 24 hours
          </div>
        </div>
      </div>
    </div>
  )
}