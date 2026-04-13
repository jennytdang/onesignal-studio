import OsLogo from '../OsLogo'
import { OsIcon } from '../OsLogo'
import { COLORS } from '../../constants/brand'

export function NewHireCover({ fields, dimension, isDark }) {
  const { headline, emoji } = fields
  const { width, height } = dimension
  const fg = isDark ? COLORS.white : COLORS.black
  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: `${Math.round(height * 0.06)}px ${Math.round(width * 0.074)}px`, fontFamily: "'Epilogue', sans-serif", textAlign: 'center' }}>
      <OsLogo color={fg} height={Math.round(height * 0.04)} useImg={true} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(height * 0.04) }}>
        <div style={{ fontSize: Math.round(width * 0.1), fontWeight: 800, lineHeight: 1.05, color: fg, letterSpacing: '-0.03em' }}>{headline || 'Meet our newest members!'}</div>
        {emoji && <div style={{ fontSize: Math.round(width * 0.14) }}>{emoji}</div>}
      </div>
      <div />
    </div>
  )
}

export function NewHireGrid({ people, dimension, isDark, slideIndex, totalSlides }) {
  const { width, height } = dimension
  const fg = isDark ? COLORS.white : COLORS.black
  const nameColor = isDark ? COLORS.cyan300 : COLORS.blue400
  const fgSub = isDark ? 'rgba(255,255,255,0.7)' : COLORS.gray600
  const validPeople = people.filter(p => p.name)
  const cols = 3
  const rows = Math.ceil(validPeople.length / cols)
  const pad = Math.round(width * 0.074)
  const gridTop = Math.round(height * 0.12)
  const gridBottom = Math.round(height * 0.06)
  const cellHeight = (height - gridTop - gridBottom) / rows
  const cellWidth = (width - pad * 2) / cols
  const photoSize = Math.min(Math.round(cellHeight * 0.52), Math.round(cellWidth * 0.55))

  return (
    <div style={{ width, height, position: 'relative', fontFamily: "'Epilogue', sans-serif" }}>
      <div style={{ position: 'absolute', top: Math.round(height * 0.04), right: Math.round(width * 0.05) }}>
        <OsIcon color={fg} size={Math.round(height * 0.05)} useImg={true} />
      </div>
      <div style={{ position: 'absolute', top: gridTop, left: pad, right: pad, bottom: gridBottom, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: Math.round(height * 0.02) }}>
        {validPeople.map((person, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: Math.round(height * 0.012) }}>
            <div style={{ width: photoSize, height: photoSize, borderRadius: 12, overflow: 'hidden', backgroundColor: COLORS.purple100, flexShrink: 0 }}>
              {person.photo ? <img src={person.photo} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(photoSize * 0.35), color: COLORS.purple600, fontWeight: 700, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : COLORS.purple50 }}>{person.name.charAt(0).toUpperCase()}</div>}
            </div>
            <div style={{ fontSize: Math.round(width * 0.024), fontWeight: 700, color: nameColor, textAlign: 'center', lineHeight: 1.2 }}>{person.name}</div>
            {person.title && <div style={{ fontSize: Math.round(width * 0.018), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 400, color: fgSub, textAlign: 'center', lineHeight: 1.3 }}>{person.title}</div>}
          </div>
        ))}
      </div>
      {totalSlides > 1 && (
        <div style={{ position: 'absolute', bottom: Math.round(height * 0.025), left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div key={i} style={{ width: i === slideIndex ? 20 : 6, height: 6, borderRadius: 3, backgroundColor: i === slideIndex ? (isDark ? COLORS.white : COLORS.purple600) : (isDark ? 'rgba(255,255,255,0.3)' : COLORS.gray400), transition: 'width 0.3s' }} />
          ))}
        </div>
      )}
    </div>
  )
}
