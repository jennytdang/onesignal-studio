import { COLORS, SCALE } from '../../constants/brand'

function CanvasLogo({ isDark, height = 60, align = 'left' }) {
  const src = isDark ? '/OneSignal-Logo-White.png' : '/OneSignal-Logo-Black.png'
  return (
    <div style={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
      <img src={src} alt="OneSignal" style={{ height, width: 'auto', display: 'block' }} />
    </div>
  )
}

export default function HeadlineOnly({ fields, dimension, isDark, logoAlign = 'left', backgroundId }) {
  const { pill, headline, subheadline, cta } = fields
  const { width, height, id } = dimension
  const S = SCALE[id] || SCALE.square

  const fg    = isDark ? COLORS.white : COLORS.black
  const fgSub = isDark ? 'rgba(255,255,255,0.75)' : COLORS.gray600
  const pillBorder = isDark ? '#ffffff' : COLORS.purple600
  const pillText   = isDark ? '#ffffff' : COLORS.purple600
  const ctaBg  = backgroundId === 'purple600' || backgroundId === 'purple500' || backgroundId === 'grad-2' || backgroundId === 'grad-3' ? COLORS.black
    : backgroundId === 'black' ? COLORS.purple600
    : isDark ? COLORS.white : COLORS.black
  const ctaText = backgroundId === 'purple600' || backgroundId === 'purple500' || backgroundId === 'grad-2' || backgroundId === 'grad-3' || backgroundId === 'black' ? COLORS.white
    : isDark ? COLORS.black : COLORS.white
  const align  = logoAlign === 'center' ? 'center' : 'flex-start'

  const pad           = Math.round(S.pad(width, height))
  const logoH         = Math.round(S.logo(width, height))
  const headlineSize  = Math.round(S.headline(width, height))
  const subSize       = Math.round(S.sub(width, height))
  const pillSize      = Math.round(S.pill(width, height))
  const ctaSize       = Math.round(S.cta(width, height))
  const gap           = Math.round(S.gap(width, height))
  const ctaPadV = id==='square'?28:id==='portrait'?32:id==='story'?38:38
  const pillPadH = id==='landscape'?32:Math.round(width*0.022)

  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column', padding: pad, fontFamily: "'Epilogue', sans-serif", gap: Math.round(height * 0.035) }}>
      <CanvasLogo isDark={isDark} height={logoH} align={logoAlign} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap, alignItems: align, overflow: 'hidden', minHeight: 0 }}>
        {pill && (
          <div style={{ display: 'inline-flex', background: 'transparent', border: `1px solid ${pillBorder}`, borderRadius: 99, padding: `${Math.round(height * 0.009)}px ${Math.round(width * 0.022)}px`, color: pillText, fontSize: pillSize, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600 }}>{pill}</div>
        )}
        <div style={{ fontSize: headlineSize, fontWeight: 800, lineHeight: 1.05, color: fg, letterSpacing: '-0.01em', maxWidth: '100%', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word', textAlign: logoAlign === 'center' ? 'center' : 'left' }}>{headline || 'Your headline here'}</div>
        {subheadline && (
          <div style={{ fontSize: subSize, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 400, lineHeight: 1.55, color: fgSub, maxWidth: '90%', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word', textAlign: logoAlign === 'center' ? 'center' : 'left' }}>{subheadline}</div>
        )}
        {cta && (
          <div style={{ display: 'inline-flex', backgroundColor: ctaBg, color: ctaText, borderRadius: 8, padding: `${ctaPadV}px ${id==='square'?40:id==='portrait'?48:44}px`, fontSize: ctaSize, fontWeight: 700, fontFamily: "'Epilogue', sans-serif" }}>{cta}</div>
        )}
      </div>
    </div>
  )
}
