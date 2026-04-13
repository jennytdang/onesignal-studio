import { COLORS } from '../../constants/brand'

function CanvasLogo({ isDark, height = 60, align = 'left' }) {
  const src = isDark ? '/OneSignal-Logo-White.png' : '/OneSignal-Logo-Black.png'
  return (
    <div style={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
      <img src={src} alt="OneSignal" style={{ height, width: 'auto', display: 'block' }} />
    </div>
  )
}

function SpeakerCard({ speaker, size, isDark, compact }) {
  const fg = isDark ? COLORS.white : COLORS.black
  const fgSub = isDark ? 'rgba(255,255,255,0.65)' : COLORS.gray600
  const avatarSize = compact ? size * 0.07 : size * 0.09
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(size * 0.018) }}>
      <div style={{ width: avatarSize, height: avatarSize, borderRadius: '50%', overflow: 'hidden', backgroundColor: COLORS.purple100, flexShrink: 0, border: `2px solid ${isDark ? 'rgba(255,255,255,0.15)' : COLORS.gray100}` }}>
        {speaker.photo ? <img src={speaker.photo} alt={speaker.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(avatarSize * 0.38), color: COLORS.purple600, fontWeight: 700 }}>{speaker.name ? speaker.name.charAt(0) : '?'}</div>}
      </div>
      <div>
        <div style={{ fontSize: Math.round(size * (compact ? 0.022 : 0.026)), fontWeight: 700, color: fg, fontFamily: "'Epilogue', sans-serif", lineHeight: 1.2 }}>{speaker.name}</div>
        <div style={{ fontSize: Math.round(size * 0.019), color: fgSub, fontFamily: "'Nunito Sans', sans-serif", lineHeight: 1.3 }}>{[speaker.title, speaker.company].filter(Boolean).join(', ')}</div>
      </div>
    </div>
  )
}

export default function EventPromo({ fields, dimension, isDark, logoAlign = 'left' }) {
  const { pill, headline, eventDate, eventLocation, cta, speakers = [] } = fields
  const { width, height } = dimension
  const isLandscape = width > height
  const isStory = height > 1400
  const fg = isDark ? COLORS.white : COLORS.black
  const dateColor = isDark ? COLORS.cyan300 : COLORS.purple600
  const pillBorder = isDark ? 'rgba(255,255,255,0.5)' : COLORS.purple600
  const pillText = isDark ? COLORS.white : COLORS.purple600
  const ctaBg = isDark ? COLORS.white : COLORS.black
  const ctaText = isDark ? COLORS.black : COLORS.white
  const dividerColor = isDark ? 'rgba(255,255,255,0.12)' : COLORS.gray100
  const pad = Math.round(width * 0.074)
  const headlineSize = isStory ? Math.round(width * 0.082) : isLandscape ? Math.round(height * 0.088) : Math.round(width * 0.082)
  const logoH = Math.round(height * 0.055)
  const validSpeakers = speakers.filter(s => s.name)
  const hasSpeakers = validSpeakers.length > 0

  if (isLandscape && hasSpeakers) return (
    <div style={{ width, height, display: 'flex', fontFamily: "'Epilogue', sans-serif" }}>
      <div style={{ flex: '0 0 58%', display: 'flex', flexDirection: 'column', padding: pad, gap: Math.round(height * 0.035) }}>
        <CanvasLogo isDark={isDark} height={logoH} align={logoAlign} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: Math.round(height * 0.028) }}>
          {pill && <div style={{ display: 'inline-flex', alignSelf: 'flex-start', border: `1.5px solid ${pillBorder}`, borderRadius: 6, padding: `${Math.round(height * 0.012)}px ${Math.round(width * 0.022)}px`, color: pillText, fontSize: Math.round(width * 0.018), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600 }}>{pill}</div>}
          <div style={{ fontSize: headlineSize, fontWeight: 800, lineHeight: 1.05, color: fg, letterSpacing: '-0.02em' }}>{headline || 'Event Title'}</div>
          {eventDate && <div style={{ fontSize: Math.round(width * 0.022), fontWeight: 700, color: dateColor, fontFamily: "'Nunito Sans', sans-serif" }}>{eventDate}{eventLocation ? ` · ${eventLocation}` : ''}</div>}
          {cta && <div style={{ display: 'inline-flex', alignSelf: 'flex-start', backgroundColor: ctaBg, color: ctaText, borderRadius: 8, padding: `${Math.round(height * 0.022)}px ${Math.round(width * 0.036)}px`, fontSize: Math.round(width * 0.022), fontWeight: 700 }}>{cta}</div>}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${pad}px ${pad}px ${pad}px ${Math.round(width * 0.04)}px`, gap: Math.round(height * 0.045), borderLeft: `1px solid ${dividerColor}` }}>
        {validSpeakers.map((s, i) => <SpeakerCard key={i} speaker={s} size={width} isDark={isDark} compact />)}
      </div>
    </div>
  )

  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column', padding: pad, fontFamily: "'Epilogue', sans-serif", gap: Math.round(height * 0.035) }}>
      <CanvasLogo isDark={isDark} height={logoH} align={logoAlign} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: Math.round(height * 0.028) }}>
        {pill && <div style={{ display: 'inline-flex', alignSelf: 'flex-start', border: `1.5px solid ${pillBorder}`, borderRadius: 6, padding: `${Math.round(height * 0.009)}px ${Math.round(width * 0.022)}px`, color: pillText, fontSize: Math.round(width * 0.022), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600 }}>{pill}</div>}
        <div style={{ fontSize: headlineSize, fontWeight: 800, lineHeight: 1.05, color: fg, letterSpacing: '-0.02em' }}>{headline || 'Event Title'}</div>
        {eventDate && <div style={{ fontSize: Math.round(width * 0.028), fontWeight: 700, color: dateColor, fontFamily: "'Nunito Sans', sans-serif" }}>{eventDate}{eventLocation ? ` · ${eventLocation}` : ''}</div>}
        {cta && <div style={{ display: 'inline-flex', alignSelf: 'flex-start', backgroundColor: ctaBg, color: ctaText, borderRadius: 8, padding: `${Math.round(height * 0.02)}px ${Math.round(width * 0.044)}px`, fontSize: Math.round(width * 0.027), fontWeight: 700 }}>{cta}</div>}
        {hasSpeakers && <div><div style={{ height: 1, backgroundColor: dividerColor, margin: `${Math.round(height * 0.01)}px 0 ${Math.round(height * 0.028)}px` }} /><div style={{ display: 'grid', gridTemplateColumns: `repeat(${!isStory && validSpeakers.length > 2 ? 2 : 1}, 1fr)`, gap: Math.round(height * 0.028) }}>{validSpeakers.map((s, i) => <SpeakerCard key={i} speaker={s} size={width} isDark={isDark} />)}</div></div>}
      </div>
    </div>
  )
}
