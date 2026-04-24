import { SignIn } from '@clerk/clerk-react'

const SANS  = "'Inter', system-ui, sans-serif"
const SERIF = "'Cormorant Garamond', Georgia, serif"

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/signin.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        fontFamily: SANS,
      }}
    >
      {/* overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,8,0,0.28)' }} />

      {/* Logo */}
      <div style={{
        position: 'relative', zIndex: 1,
        marginBottom: '32px', textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <img
          src="/bayan.svg"
          alt="Bayan"
          style={{ height: '70px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
        />
        <p style={{
          fontFamily: SERIF,
          fontSize: '13px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.65)',
          margin: '8px 0 0',
          fontWeight: 500,
        }}>
          Solar Digital Twin Platform
        </p>
      </div>

      {/* Clerk SignIn — fully managed, handles 2FA, OAuth, redirects */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SignIn
          routing="path"
          path="/sign-in"
          forceRedirectUrl="/"
          appearance={{
            layout: { logoPlacement: 'none', showOptionalFields: false },
            variables: {
              colorPrimary:         '#e8733a',
              colorBackground:      'rgba(255,255,255,0.92)',
              colorText:            '#1a0f06',
              colorTextSecondary:   '#6b4c34',
              colorInputBackground: 'rgba(255,255,255,0.95)',
              colorInputText:       '#1a0f06',
              borderRadius:         '50px',
              fontFamily:           SANS,
              fontSize:             '14px',
            },
            elements: {
              card: {
                boxShadow:      '0 8px 40px rgba(0,0,0,0.22)',
                border:         '1.5px solid rgba(232,115,58,0.25)',
                backdropFilter: 'blur(14px)',
                padding:        '32px 36px',
                width:          '380px',
                background:     'rgba(255,255,255,0.92)',
                borderRadius:   '16px',
              },
              headerTitle:              { display: 'none' },
              headerSubtitle:           { display: 'none' },
              header:                   { display: 'none' },
              socialButtonsBlockButton: { display: 'none' },
              dividerRow:               { display: 'none' },
              formButtonPrimary: {
                background:   '#e8733a',
                borderRadius: '50px',
                fontSize:     '14px',
                fontWeight:   '600',
                height:       '44px',
              },
              formFieldInput: {
                borderRadius: '50px',
                border:       '1.5px solid rgba(232,115,58,0.35)',
                height:       '44px',
                paddingLeft:  '16px',
              },
              footerActionLink:  { color: '#e8733a' },
              footerActionText:  { color: '#6b4c34', fontSize: '13px' },
            },
          }}
        />
      </div>

      {/* Footer */}
      <p style={{
        position: 'absolute', bottom: '14px', zIndex: 1,
        fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: 0,
      }}>
        Copyright © 2024–2026 Insight Solar Twin. All rights reserved.
      </p>
    </div>
  )
}
