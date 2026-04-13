import { COLORS } from '../../constants/brand'

function CanvasLogo({ isDark, height = 60, align = 'left' }) {
  const src = isDark ? '/OneSignal-Logo-White.png' : '/OneSignal-Logo-Black.png'
  return (
    <div style={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
      <img src={src} alt="OneSignal" style={{ height, width: 'auto', display: 'block' }} />
    </div>
  )
}

export default function HeadlineOnly({ fields, dimension, isDark, logoAlign = 'left' }) {
  const { pill, headline, subheadline, cta } = fields
  const { width, height } = dimension
  const isLandscape = width > height
  const isStory = height > 1400
  const fg = isDark ? COLORS.white : COLORS.black
  const fgSub = isDark ? 'rgba(255,255,255,0.75)' : COLORS.gray600
  const pillBorder = isDark ? 'rgba(255,255,255,0.5)' : COLORS.purple600
  const pillText = isDark ? COLORS.white : COLORS.purple600
  const ctaBg = isDark ? COLORS.white : COLORS.black
  const ctaText = isDark ? COLORS.black : COLORS.white
  const pad = Math.round(width * 0.074)
  const headlineSize = isStory ? Math.round(width * 0.088) : isLandscape ? Math.round(height * 0.1) : Math.round(width * 0.088)
  const logoH = Math.round(height * 0.055)

  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column', padding: pad, fontFamily: "'Epilogue', sans-serif", gap: Math.round(height * 0.035) }}>
      <CanvasLogo isDark={isDark} height={logoH} align={logoAlign} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: Math.round(height * 0.03) }}>
        {pill && <div style={{ display: 'inline-flex', alignSelf: 'flex-start', border: `1.5px solid ${pillBorder}`, borderRadius: 6, padding: `${Math.round(height * 0.009)}px ${Math.round(width * 0.022)}px`, color: pillText, fontSize: Math.round(width * 0.022), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600 }}>{pill}</div>}
        <div style={{ fontSize: headlineSize, fontWeight: 800, lineHeight: 1.05, color: fg, letterSpacing: '-0.02em', maxWidth: isLandscape ? '65%' : '100%' }}>{headline || 'Your headline here'}</div>
        {subheadline && <div style={{ fontSize: Math.round(width * 0.026), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 400, lineHeight: 1.55, color: fgSub, maxWidth: isLandscape ? '55%' : '85%' }}>{subheadline}</div>}
        {cta && <div style={{ display: 'inline-flex', alignSelf: logoAlign === 'center' ? 'center' : 'flex-start', backgroundColor: ctaBg, color: ctaText, borderRadius: 8, padding: `${Math.round(height * 0.018)}px ${Math.round(width * 0.044)}px`, fontSize: Math.round(width * 0.025), fontWeight: 700, fontFamily: "'Epilogue', sans-serif" }}>{cta}</div>}
      </div>
    </div>
  )
}
