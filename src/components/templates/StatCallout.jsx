import { COLORS } from '../../constants/brand'

function CanvasLogo({ isDark, height = 60, align = 'left' }) {
  const src = isDark ? '/OneSignal-Logo-White.png' : '/OneSignal-Logo-Black.png'
  return (
    <div style={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
      <img src={src} alt="OneSignal" style={{ height, width: 'auto', display: 'block' }} />
    </div>
  )
}

export default function StatCallout({ fields, dimension, isDark, logoAlign = 'left' }) {
  const { pill, stat, statLabel, subheadline, cta } = fields
  const { width, height } = dimension
  const isLandscape = width > height
  const fg = isDark ? COLORS.white : COLORS.black
  const fgSub = isDark ? 'rgba(255,255,255,0.75)' : COLORS.gray600
  const accentColor = isDark ? COLORS.cyan300 : COLORS.purple600
  const pillBorder = isDark ? 'rgba(255,255,255,0.5)' : COLORS.purple600
  const pillText = isDark ? COLORS.white : COLORS.purple600
  const ctaBg = isDark ? COLORS.white : COLORS.black
  const ctaText = isDark ? COLORS.black : COLORS.white
  const pad = Math.round(width * 0.074)
  const statFontSize = height > 1400 ? Math.round(width * 0.26) : isLandscape ? Math.round(height * 0.28) : Math.round(width * 0.26)
  const logoH = Math.round(height * 0.055)

  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column', padding: pad, fontFamily: "'Epilogue', sans-serif", gap: Math.round(height * 0.04) }}>
      <CanvasLogo isDark={isDark} height={logoH} align={logoAlign} />
      <div style={{ flex: 1, display: 'flex', flexDirection: isLandscape ? 'row' : 'column', alignItems: isLandscape ? 'center' : 'flex-start', gap: isLandscape ? Math.round(width * 0.06) : Math.round(height * 0.03), justifyContent: 'center' }}>
        <div>
          {pill && <div style={{ display: 'inline-flex', marginBottom: Math.round(height * 0.02), border: `1.5px solid ${pillBorder}`, borderRadius: 6, padding: `${Math.round(height * 0.009)}px ${Math.round(width * 0.022)}px`, color: pillText, fontSize: Math.round(width * 0.022), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600 }}>{pill}</div>}
          <div style={{ fontSize: statFontSize, fontWeight: 800, lineHeight: 0.9, color: fg, letterSpacing: '-0.04em', whiteSpace: 'nowrap' }}>{stat || '2×'}</div>
          {statLabel && <div style={{ fontSize: Math.round(width * 0.028), fontWeight: 600, color: accentColor, marginTop: Math.round(height * 0.01), letterSpacing: '-0.01em' }}>{statLabel}</div>}
        </div>
        <div style={{ maxWidth: isLandscape ? '45%' : '80%' }}>
          {subheadline && <div style={{ fontSize: Math.round(width * 0.03), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 400, lineHeight: 1.6, color: fgSub }}>{subheadline}</div>}
          {cta && <div style={{ display: 'inline-flex', marginTop: Math.round(height * 0.025), backgroundColor: ctaBg, color: ctaText, borderRadius: 8, padding: `${Math.round(height * 0.016)}px ${Math.round(width * 0.04)}px`, fontSize: Math.round(width * 0.024), fontWeight: 700 }}>{cta}</div>}
        </div>
      </div>
    </div>
  )
}
