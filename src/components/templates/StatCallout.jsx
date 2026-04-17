import { COLORS, SCALE } from '../../constants/brand'

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
  const { width, height, id } = dimension
  const S = SCALE[id] || SCALE.square

  const fg          = isDark ? COLORS.white : COLORS.black
  const fgSub       = isDark ? 'rgba(255,255,255,0.75)' : COLORS.gray600
  const accentColor = isDark ? COLORS.cyan300 : COLORS.purple600
  const pillBorder  = isDark ? '#ffffff' : COLORS.purple600
  const pillText    = isDark ? '#ffffff' : COLORS.purple600
  const ctaBg       = isDark ? COLORS.white : COLORS.black
  const ctaText     = isDark ? COLORS.black : COLORS.white
  const align       = logoAlign === 'center' ? 'center' : 'flex-start'

  const pad          = Math.round(S.pad(width, height))
  const logoH        = Math.round(S.logo(width, height))
  const pillSize     = Math.round(S.pill(width, height))
  const subSize      = Math.round(S.sub(width, height))
  const ctaSize      = Math.round(S.cta(width, height))
  const gap          = Math.round(S.gap(width, height))
  const statFontSize = Math.round(S.statSize(width, height))
  const ctaPadV = id==='square'?22:id==='portrait'?24:id==='story'?32:24
  const pillPadH = id==='landscape'?32:Math.round(width*0.022)

  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column', padding: pad, fontFamily: "'Epilogue', sans-serif", gap: Math.round(height * 0.04) }}>
      <CanvasLogo isDark={isDark} height={logoH} align={logoAlign} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: align, gap, justifyContent: 'center', overflow: 'hidden', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: align }}>
          {pill && (
            <div style={{ display: 'inline-flex', marginBottom: Math.round(height * 0.02), background: 'transparent', border: `1px solid ${pillBorder}`, borderRadius: 99, padding: `${Math.round(height * 0.009)}px ${pillPadH}px`, color: pillText, fontSize: pillSize, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600 }}>{pill}</div>
          )}
          <div style={{ fontSize: statFontSize, fontWeight: 800, lineHeight: 0.9, color: fg, letterSpacing: '-0.04em', whiteSpace: 'nowrap' }}>{stat || '2\u00d7'}</div>
          {statLabel && (
            <div style={{ fontSize: Math.round(width * 0.028), fontWeight: 600, color: accentColor, marginTop: Math.round(height * 0.01), letterSpacing: '-0.01em' }}>{statLabel}</div>
          )}
        </div>
        <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: align }}>
          {subheadline && (
            <div style={{ fontSize: subSize, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 400, lineHeight: 1.6, color: fgSub, whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{subheadline}</div>
          )}
          {cta && (
            <div style={{ display: 'inline-flex', marginTop: Math.round(height * 0.025), backgroundColor: ctaBg, color: ctaText, borderRadius: 8, padding: `${ctaPadV}px ${id==='story'?44:32}px`, fontSize: ctaSize, fontWeight: 700, fontFamily: "'Epilogue', sans-serif" }}>{cta}</div>
          )}
        </div>
      </div>
    </div>
  )
}
