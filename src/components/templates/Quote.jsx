import { COLORS } from '../../constants/brand'

function CanvasLogo({ isDark, height = 60, align = 'left' }) {
  const src = isDark ? '/OneSignal-Logo-White.png' : '/OneSignal-Logo-Black.png'
  return (
    <div style={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
      <img src={src} alt="OneSignal" style={{ height, width: 'auto', display: 'block' }} />
    </div>
  )
}

export default function Quote({ fields, dimension, isDark, logoAlign = 'left' }) {
  const { pill, headline: quoteText, authorName, authorTitle, authorCompany, showHeadshot, headshotUrl, cta } = fields
  const { width, height } = dimension
  const isLandscape = width > height
  const fg = isDark ? COLORS.white : COLORS.black
  const fgSub = isDark ? 'rgba(255,255,255,0.65)' : COLORS.gray600
  const pillBorder = isDark ? 'rgba(255,255,255,0.5)' : COLORS.purple600
  const pillText = isDark ? COLORS.white : COLORS.purple600
  const quoteMark = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(78,80,209,0.1)'
  const ctaBg = isDark ? COLORS.white : COLORS.black
  const ctaText = isDark ? COLORS.black : COLORS.white
  const pad = Math.round(width * 0.074)
  const quoteSize = height > 1400 ? Math.round(width * 0.052) : isLandscape ? Math.round(height * 0.056) : Math.round(width * 0.052)
  const avatarSize = Math.round(width * 0.1)
  const logoH = Math.round(height * 0.055)

  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column', padding: pad, fontFamily: "'Epilogue', sans-serif", gap: Math.round(height * 0.04) }}>
      <CanvasLogo isDark={isDark} height={logoH} align={logoAlign} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: Math.round(height * 0.04) }}>
        {pill && <div style={{ display: 'inline-flex', alignSelf: 'flex-start', border: `1.5px solid ${pillBorder}`, borderRadius: 6, padding: `${Math.round(height * 0.009)}px ${Math.round(width * 0.022)}px`, color: pillText, fontSize: Math.round(width * 0.022), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600 }}>{pill}</div>}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: -Math.round(height * 0.04), left: -Math.round(width * 0.01), fontSize: Math.round(width * 0.22), lineHeight: 1, color: quoteMark, fontFamily: 'Georgia, serif', fontWeight: 700, userSelect: 'none', zIndex: 0 }}>“</div>
          <div style={{ position: 'relative', zIndex: 1, fontSize: quoteSize, fontFamily: "'Nunito Sans', sans-serif", fontStyle: 'italic', fontWeight: 400, lineHeight: 1.5, color: fg, maxWidth: isLandscape ? '75%' : '100%' }}>{quoteText || 'Add your quote text here.'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: isLandscape ? 'row' : 'column', alignItems: isLandscape ? 'center' : 'flex-start', gap: Math.round(width * 0.025) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(width * 0.025) }}>
            {showHeadshot && (
              <div style={{ width: avatarSize, height: avatarSize, borderRadius: '50%', overflow: 'hidden', backgroundColor: COLORS.purple100, flexShrink: 0, border: `2px solid ${isDark ? 'rgba(255,255,255,0.2)' : COLORS.gray100}` }}>
                {headshotUrl ? <img src={headshotUrl} alt={authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(avatarSize * 0.4), color: COLORS.purple600, fontWeight: 700 }}>{authorName ? authorName.charAt(0).toUpperCase() : '?'}</div>}
              </div>
            )}
            <div>
              {authorName && <div style={{ fontSize: Math.round(width * 0.028), fontWeight: 700, color: fg, letterSpacing: '-0.01em' }}>{authorName}</div>}
              {(authorTitle || authorCompany) && <div style={{ fontSize: Math.round(width * 0.022), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 400, color: fgSub, marginTop: 2 }}>{[authorTitle, authorCompany].filter(Boolean).join(', ')}</div>}
            </div>
          </div>
          {cta && <div style={{ display: 'inline-flex', marginLeft: isLandscape ? 'auto' : 0, backgroundColor: ctaBg, color: ctaText, borderRadius: 8, padding: `${Math.round(height * 0.016)}px ${Math.round(width * 0.04)}px`, fontSize: Math.round(width * 0.024), fontWeight: 700 }}>{cta}</div>}
        </div>
      </div>
    </div>
  )
}
