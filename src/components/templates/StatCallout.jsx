import { COLORS, SCALE } from '../../constants/brand'

function CanvasLogo({ isDark, height = 60, align = 'left' }) {
  const src = isDark ? '/OneSignal-Logo-White.png' : '/OneSignal-Logo-Black.png'
  return (
    <div style={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
      <img src={src} alt="OneSignal" style={{ height, width: 'auto', display: 'block' }} />
    </div>
  )
}

export default function StatCallout({ fields, dimension, isDark, logoAlign = 'left', backgroundId }) {
  const { pill, stat, statLabel, subheadline, cta } = fields
  const { width, height, id } = dimension
  const S = SCALE[id] || SCALE.square

  const fg          = isDark ? COLORS.white : COLORS.black
  const fgSub       = isDark ? 'rgba(255,255,255,0.75)' : COLORS.gray600
  const accentColor = backgroundId === 'purple600' || backgroundId === 'purple500' || backgroundId === 'black' || backgroundId === 'grad-2' || backgroundId === 'grad-3' ? '#D7D8F5' : isDark ? COLORS.cyan300 : COLORS.purple600
  const pillBorder  = isDark ? '#ffffff' : COLORS.purple600
  const pillText    = isDark ? '#ffffff' : COLORS.purple600
  const ctaBg       = backgroundId === 'purple600' || backgroundId === 'purple500' || backgroundId === 'grad-2' || backgroundId === 'grad-3' ? COLORS.black
    : backgroundId === 'black' ? COLORS.purple600
    : isDark ? COLORS.white : COLORS.black
  const ctaText     = backgroundId === 'purple600' || backgroundId === 'purple500' || backgroundId === 'grad-2' || backgroundId === 'grad-3' || backgroundId === 'black' ? COLORS.white
    : isDark ? COLORS.black : COLORS.white
  const align       = logoAlign === 'center' ? 'center' : 'flex-start'

  const pad          = Math.round(S.pad(width, height))
  const logoH        = Math.round(S.logo(width, height))
  const pillSize     = Math.round(S.pill(width, height))
  const subSize      = id==='square'?32:id==='portrait'?38:id==='story'?44:40
  const ctaSize      = id==='square'?32:id==='portrait'?38:id==='story'?44:40
  const gap          = Math.round(S.gap(width, height))
  const statFontSize = Math.round(S.statSize(width, height))
  const ctaPadV = id==='square'?28:id==='portrait'?32:38
  const pillPadH = id==='landscape'?32:Math.round(width*0.022)

  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column', padding: pad, fontFamily: "'Epilogue', sans-serif", gap: Math.round(height * 0.04) }}>
      <CanvasLogo isDark={isDark} height={logoH} align={logoAlign} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: align, gap, justifyContent: 'center', overflow: 'hidden', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: align, maxWidth: '100%' }}>
          {pill && (
            <div style={{ display: 'inline-flex', marginBottom: 48, background: 'transparent', border: `1px solid ${pillBorder}`, borderRadius: 99, padding: `${Math.round(height * 0.009)}px ${pillPadH}px`, color: pillText, fontSize: pillSize, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600 }}>{pill}</div>
          )}
{id === 'landscape' ? (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18, justifyContent: logoAlign==='center'?'center':'flex-start', width: '100%' }}>
              <div style={{ fontSize: statFontSize, fontWeight: 800, lineHeight: 0.9, color: fg, letterSpacing: '-0.04em', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word', flexShrink: 0, textAlign: logoAlign==='center'?'center':'left' }}>{stat || 'XX%'}</div>
              {statLabel && <div style={{ fontSize: Math.round(height*0.05), fontWeight: 600, color: accentColor, letterSpacing: '-0.01em', wordBreak: 'break-word', overflowWrap: 'break-word', lineHeight: 1.1, flexShrink: 1 }}>{statLabel}</div>}
            </div>
          ) : (
            <>
              <div style={{ fontSize: statFontSize, fontWeight: 800, lineHeight: 0.9, color: fg, letterSpacing: '-0.04em', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%', textAlign: logoAlign==='center'?'center':'left' }}>{stat || '2×'}</div>
              {statLabel && (
                <div style={{ fontSize: id==='square'?42:id==='portrait'?50:id==='story'?58:Math.round(height*0.0537), fontWeight: 600, color: accentColor, marginTop: 48, letterSpacing: '-0.01em', textAlign: logoAlign==='center'?'center':'left', maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{statLabel}</div>
              )}
            </>
          )}
        </div>
        <div style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: align }}>
          {subheadline && (
            <div style={{ fontSize: subSize, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 400, lineHeight: 1.6, color: fgSub, whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word', textAlign: logoAlign==='center'?'center':'left' }}>{subheadline}</div>
          )}
          {cta && (
            <div style={{ display: 'inline-flex', marginTop: Math.round(height * 0.025), backgroundColor: ctaBg, color: ctaText, borderRadius: 8, padding: `${ctaPadV}px ${id==='square'?40:id==='portrait'?48:44}px`, fontSize: ctaSize, fontWeight: 700, fontFamily: "'Epilogue', sans-serif" }}>{cta}</div>
          )}
        </div>
      </div>
    </div>
  )
}
