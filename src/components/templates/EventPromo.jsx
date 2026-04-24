import { COLORS } from '../../constants/brand'

function CanvasLogo({ isDark, height = 60, align = 'left' }) {
  const src = isDark ? '/OneSignal-Logo-White.png' : '/OneSignal-Logo-Black.png'
  return (
    <div style={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
      <img src={src} alt="OneSignal" style={{ height, width: 'auto', display: 'block' }} />
    </div>
  )
}

function SpeakerCard({ speaker, isDark, avatarSz, nameSize, subSize, gap, nameMarginBottom }) {
  const fg = isDark ? COLORS.white : COLORS.black
  const fgSub = isDark ? 'rgba(255,255,255,0.65)' : COLORS.gray600
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      <div style={{ width: avatarSz, height: avatarSz, borderRadius: '50%', overflow: 'hidden', backgroundColor: COLORS.purple100, flexShrink: 0, border: `2px solid ${isDark ? 'rgba(255,255,255,0.15)' : COLORS.gray100}` }}>
        {speaker.photo
          ? <img src={speaker.photo} alt={speaker.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(avatarSz * 0.38), color: COLORS.purple600, fontWeight: 700 }}>{speaker.name ? speaker.name.charAt(0) : '?'}</div>}
      </div>
      <div>
        <div style={{ fontSize: nameSize, fontWeight: 700, color: fg, fontFamily: "'Epilogue', sans-serif", lineHeight: 1.2, marginBottom: nameMarginBottom }}>{speaker.name}</div>
        <div style={{ fontSize: subSize, color: fgSub, fontFamily: "'Nunito Sans', sans-serif", lineHeight: 1.3 }}>{[speaker.title, speaker.company].filter(Boolean).join(', ')}</div>
      </div>
    </div>
  )
}

export default function EventPromo({ fields, dimension, isDark, logoAlign = 'left', backgroundId }) {
  const { pill, headline, eventDate, eventLocation, cta, speakers = [] } = fields
  const { width, height, id } = dimension
  const isLandscape = width > height
  const isStory = height > 1400
  const fg = isDark ? COLORS.white : COLORS.black
  const dateColor = (backgroundId === 'grad-1' || backgroundId === 'grad-4') ? '#24272B' : (backgroundId === 'grad-2' || backgroundId === 'grad-3' || backgroundId === 'purple600' || backgroundId === 'purple500' || backgroundId === 'black') ? '#D7D8F5' : isDark ? COLORS.cyan300 : COLORS.purple600
  const pillBorder = isDark ? 'rgba(255,255,255,0.5)' : COLORS.purple600
  const pillText = isDark ? COLORS.white : COLORS.purple600
  const ctaBg = backgroundId === 'purple600' || backgroundId === 'purple500' || backgroundId === 'grad-2' || backgroundId === 'grad-3' ? COLORS.black
    : backgroundId === 'black' ? COLORS.purple600
    : isDark ? COLORS.white : COLORS.black
  const ctaText = backgroundId === 'purple600' || backgroundId === 'purple500' || backgroundId === 'grad-2' || backgroundId === 'grad-3' || backgroundId === 'black' ? COLORS.white
    : isDark ? COLORS.black : COLORS.white
  const dividerColor = isDark ? 'rgba(255,255,255,0.12)' : COLORS.gray100

  const pad = isLandscape ? Math.round(height * 0.0926) : Math.round(width * 0.074)
  const logoH = isLandscape ? 80 : Math.round(height * 0.055)
  const pillPadH = isLandscape ? 32 : Math.round(width * 0.022)

  const headlineSize = id === 'landscape' ? Math.round(height * 0.0870)
    : id === 'story'   ? Math.round(width * 0.0907)
    : id === 'portrait' ? 48
    : 80)

  const dateSize = id === 'landscape' ? Math.round(height * 0.0370)
    : id === 'story'   ? Math.round(width * 0.0407)
    : id === 'portrait' ? Math.round(width * 0.0352)
    : Math.round(width * 0.0296)

  const ctaFontSize = id === 'landscape' ? 40 : id === 'story' ? 44 : id === 'portrait' ? 38 : 32
  const ctaPadV     = id === 'landscape' ? 34 : id === 'story' ? 38 : id === 'portrait' ? 32 : 28
  const ctaPadH     = id === 'landscape' ? 40 : id === 'portrait' ? 48 : id === 'square' ? 40 : 44

  const avatarSz          = id === 'landscape' ? 148 : id === 'story' ? 124 : 112
  const speakerNameSize   = id === 'landscape' || id === 'story' ? 38 : id === 'portrait' ? 34 : 28
  const speakerNameMargin = id === 'landscape' || id === 'story' ? 8  : 6
  const speakerSubSize    = id === 'landscape' || id === 'story' ? 32 : id === 'portrait' ? 30 : 24
  const speakerGap        = id === 'landscape' ? 34 : id === 'square' ? 28 : 32

  const validSpeakers = speakers.filter(s => s.name)
  const hasSpeakers = validSpeakers.length > 0

  if (isLandscape && hasSpeakers) return (
    <div style={{ width, height, display: 'flex', fontFamily: "'Epilogue', sans-serif" }}>
      <div style={{ flex: '0 0 58%', display: 'flex', flexDirection: 'column', padding: pad, gap: Math.round(height * 0.035) }}>
        <CanvasLogo isDark={isDark} height={logoH} align={logoAlign} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: Math.round(height * 0.028) }}>
          {pill && <div style={{ display: 'inline-flex', alignSelf: 'flex-start', border: `1.5px solid ${pillBorder}`, borderRadius: 6, padding: `${Math.round(height * 0.012)}px ${pillPadH}px`, color: pillText, fontSize: Math.round(height * 0.024), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600 }}>{pill}</div>}
          <div style={{ fontSize: headlineSize, fontWeight: 800, lineHeight: 1.05, color: fg, letterSpacing: '-0.02em' }}>{headline || 'Event Title'}</div>
          {eventDate && <div style={{ fontSize: dateSize, fontWeight: 700, marginTop: id==='story'?48:id==='square'?28:id==='portrait'?32:0, color: dateColor, fontFamily: "'Nunito Sans', sans-serif" }}>{eventDate}{eventLocation ? ` · ${eventLocation}` : ''}</div>}
          {cta && <div style={{ display: 'inline-flex', alignSelf: 'flex-start', marginTop: id==='landscape'?40:id==='story'?60:id==='square'?40:id==='portrait'?40:0, backgroundColor: ctaBg, color: ctaText, borderRadius: 8, padding: `${ctaPadV}px ${ctaPadH}px`, fontSize: ctaFontSize, fontWeight: 700 }}>{cta}</div>}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${pad}px ${pad}px ${pad}px 0px`, gap: id==='square'?24:Math.round(height * 0.045) }}>
        {validSpeakers.map((s, i) => <SpeakerCard key={i} speaker={s} isDark={isDark} avatarSz={avatarSz} nameSize={speakerNameSize} subSize={speakerSubSize} gap={speakerGap} nameMarginBottom={speakerNameMargin} />)}
      </div>
    </div>
  )

  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column', padding: pad, fontFamily: "'Epilogue', sans-serif", gap: Math.round(height * 0.035) }}>
      <CanvasLogo isDark={isDark} height={logoH} align={logoAlign} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: Math.round(height * 0.028) }}>
        {pill && <div style={{ display: 'inline-flex', alignSelf: 'flex-start', border: `1.5px solid ${pillBorder}`, borderRadius: 6, padding: `${Math.round(height * 0.009)}px ${pillPadH}px`, color: pillText, fontSize: Math.round(width * 0.022), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600 }}>{pill}</div>}
        <div style={{ fontSize: headlineSize, fontWeight: 800, lineHeight: 1.05, color: fg, letterSpacing: '-0.02em' }}>{headline || 'Event Title'}</div>
        {eventDate && <div style={{ fontSize: dateSize, fontWeight: 700, color: dateColor, fontFamily: "'Nunito Sans', sans-serif" }}>{eventDate}{eventLocation ? ` · ${eventLocation}` : ''}</div>}
        {cta && <div style={{ display: 'inline-flex', alignSelf: 'flex-start', backgroundColor: ctaBg, color: ctaText, borderRadius: 8, padding: `${ctaPadV}px ${ctaPadH}px`, fontSize: ctaFontSize, fontWeight: 700 }}>{cta}</div>}
        {hasSpeakers && <div><div style={{ height: 0 }} /><div style={{ display: 'grid', gridTemplateColumns: `repeat(${!isStory && validSpeakers.length > 2 ? 2 : 1}, 1fr)`, gap: Math.round(height * 0.028) }}>{validSpeakers.map((s, i) => <SpeakerCard key={i} speaker={s} isDark={isDark} avatarSz={avatarSz} nameSize={speakerNameSize} subSize={speakerSubSize} gap={speakerGap} nameMarginBottom={speakerNameMargin} />)}</div></div>}
      </div>
    </div>
  )
}
