import { COLORS, SCALE } from '../../constants/brand'

function CanvasLogo({ isDark, height = 60 }) {
  const src = isDark ? '/OneSignal-Logo-White.png' : '/OneSignal-Logo-Black.png'
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <img src={src} alt="OneSignal" style={{ height, width: 'auto', display: 'block' }} />
    </div>
  )
}

function QuoteMarkIcon({ size, isDark }) {
  const fill   = isDark ? '#ffffff' : COLORS.purple600
  const style  = isDark ? { opacity: 0.5, mixBlendMode: 'overlay' } : {}
  return (
    <svg width={size} height={size * 0.88} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, display: 'block', ...style }}>
      <path d="M9.02488 12.5736V21.5984H0V15.2279C0 12.7505 0.412903 10.4795 1.23871 8.41503C2.06452 6.35051 3.45069 4.34498 5.39723 2.39844L8.75945 5.05281C6.45899 7.58922 5.16129 10.0961 4.86636 12.5736H9.02488ZM23.7124 12.5736V21.5984H14.6876V15.2279C14.6876 12.7505 15.1005 10.4795 15.9263 8.41503C16.7521 6.35051 18.1382 4.34498 20.0848 2.39844L23.447 5.05281C21.1465 7.58922 19.8488 10.0961 19.5539 12.5736H23.7124Z" fill={fill}/>
    </svg>
  )
}

export default function Quote({ fields, dimension, isDark, logoAlign = 'left', backgroundId }) {
  const { pill, headline: quoteText, authorName, authorTitle, authorCompany, showHeadshot, headshotUrl, cta, quoteBlock } = fields
  const { width, height, id } = dimension
  const S = SCALE[id] || SCALE.square

  const fg          = isDark ? COLORS.white : COLORS.black
  const fgSub       = isDark ? 'rgba(255,255,255,0.65)' : COLORS.gray600
  const pillBorder  = isDark ? '#ffffff' : COLORS.purple600
  const pillText    = isDark ? '#ffffff' : COLORS.purple600
  const ctaBg       = isDark ? COLORS.white : COLORS.black
  const ctaText     = isDark ? COLORS.black : COLORS.white
  const borderColor = (() => {
    const darkBgs = ['purple600','purple500','grad-2','grad-3']
    const gradBgs = ['black','white']
    if (darkBgs.includes(backgroundId)) return '#FFFFFF'
    if (gradBgs.includes(backgroundId)) return 'linear-gradient(to bottom, #7274DA, #4DA6EF)'
    return isDark ? COLORS.purple400 : COLORS.purple600
  })()

  const pad          = Math.round(S.pad(width, height))
  const logoH        = Math.round(S.logo(width, height))
  const quoteSize    = Math.round(S.quoteSize(width, height))
  const pillSize     = Math.round(S.pill(width, height))
  const ctaSize      = Math.round(S.cta(width, height))
  const avatarSize   = Math.round(S.avatar(width, height))
  const authorNameSz = Math.round(S.authorName(width, height))
  const authorTitleSz= Math.round(S.authorTitle(width, height))
  const iconSize     = Math.round(S.quoteIcon(width, height))
  const borderWidth  = S.quoteBorder(width, height)
  const quoteGap     = S.quoteGap(width, height)
  const gap          = Math.round(S.gap(width, height))
  const ctaPadV = id==='square'?22:id==='portrait'?24:id==='story'?32:24

  // Block quote attribution: stacked, no headshot, no dash
  const blockAttribution = (
    <div style={{ flexShrink: 0 }}>
      {authorName && <div style={{ fontSize: authorNameSz, fontWeight: 700, color: fg, letterSpacing: '-0.01em', fontFamily: "'Epilogue', sans-serif" }}>{authorName}</div>}
      {(authorTitle || authorCompany) && <div style={{ fontSize: authorTitleSz, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 400, color: fgSub, marginTop: 8 }}>{[authorTitle, authorCompany].filter(Boolean).join(', ')}</div>}
    </div>
  )

  // Regular quote: stacked rows with optional headshot
  const attribution = (
    <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(width * 0.025), flexShrink: 0 }}>
      {showHeadshot && (
        <div style={{ width: avatarSize, height: avatarSize, borderRadius: '50%', overflow: 'hidden', backgroundColor: COLORS.purple100, flexShrink: 0, border: `2px solid ${isDark ? 'rgba(255,255,255,0.2)' : COLORS.gray100}` }}>
          {headshotUrl
            ? <img src={headshotUrl} alt={authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(avatarSize * 0.4), color: COLORS.purple600, fontWeight: 700 }}>{authorName ? authorName.charAt(0).toUpperCase() : '?'}</div>
          }
        </div>
      )}
      <div>
        {authorName && <div style={{ fontSize: authorNameSz, fontWeight: 700, color: fg, letterSpacing: '-0.01em', fontFamily: "'Epilogue', sans-serif" }}>{authorName}</div>}
        {(authorTitle || authorCompany) && <div style={{ fontSize: authorTitleSz, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 400, color: fgSub, marginTop: 8 }}>{[authorTitle, authorCompany].filter(Boolean).join(', ')}</div>}
      </div>
    </div>
  )

  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column', padding: pad, fontFamily: "'Epilogue', sans-serif", gap: Math.round(height * 0.04) }}>
      <CanvasLogo isDark={isDark} height={logoH} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap, alignItems: 'flex-start', overflow: 'hidden', minHeight: 0 }}>
        {pill && (
          <div style={{ display: 'inline-flex', background: 'transparent', border: `1px solid ${pillBorder}`, borderRadius: 99, padding: `${Math.round(height * 0.009)}px ${Math.round(width * 0.022)}px`, color: pillText, fontSize: pillSize, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600 }}>{pill}</div>
        )}

        {quoteBlock ? (
          <div style={{ display: 'flex', gap: quoteGap, width: '100%' }}>
            <div style={{ width: borderWidth, background: borderColor, borderRadius: 2, flexShrink: 0, alignSelf: 'stretch' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap }}>
              <div style={{ fontSize: quoteSize, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, lineHeight: 1.2, color: fg, whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{quoteText || 'Add your quote text here.'}</div>
              {blockAttribution}
              {cta && <div style={{ display: 'inline-flex', backgroundColor: ctaBg, color: ctaText, borderRadius: 8, padding: `${ctaPadV}px ${id==='story'?44:32}px`, fontSize: ctaSize, fontWeight: 700, fontFamily: "'Epilogue', sans-serif" }}>{cta}</div>}
            </div>
          </div>
        ) : (
          <>
            <QuoteMarkIcon size={iconSize} isDark={isDark} />
            <div style={{ fontSize: quoteSize, fontFamily: "'Nunito Sans', sans-serif", fontWeight: 700, lineHeight: 1.2, color: fg, whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word', width: '100%' }}>{quoteText || 'Add your quote text here.'}</div>
            {attribution}
            {cta && <div style={{ display: 'inline-flex', backgroundColor: ctaBg, color: ctaText, borderRadius: 8, padding: `${ctaPadV}px ${id==='story'?44:32}px`, fontSize: ctaSize, fontWeight: 700, fontFamily: "'Epilogue', sans-serif" }}>{cta}</div>}
          </>
        )}
      </div>
    </div>
  )
}
