import { COLORS } from '../../constants/brand'

function CanvasLogo({ isDark, height = 60, align = 'left' }) {
  const src = isDark ? '/OneSignal-Logo-White.png' : '/OneSignal-Logo-Black.png'
  return (
    <div style={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
      <img src={src} alt="OneSignal" style={{ height, width: 'auto', display: 'block' }} />
    </div>
  )
}
function CanvasLogomark({ height = 40, isDark = false }) {
  return <img src="/OneSignal-Logomark.svg" alt="OneSignal" style={{ height, width: 'auto', display: 'block', filter: isDark ? 'brightness(0) invert(1)' : 'none' }} />
}

export function NewHireCover({ fields, dimension, isDark, logoAlign = 'left', backgroundId }) {
  const { headline, subheadline } = fields
  const { width, height, id } = dimension
  const fg = isDark ? COLORS.white : COLORS.black
  const logoH = id === 'landscape' ? 80 : Math.round(height * 0.055)

  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column', padding: `${id==='landscape'?Math.round(height*0.0926):id==='story'?Math.round(height*0.052):Math.round(height*0.074)}px ${id==='landscape'?Math.round(width*0.052):id==='story'?Math.round(width*0.0815):Math.round(width*0.074)}px`, fontFamily: "'Epilogue', sans-serif", gap: Math.round(height * 0.05) }}>
      <CanvasLogo isDark={isDark} height={logoH} align={logoAlign} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: logoAlign === 'center' ? 'center' : 'flex-start', justifyContent: 'center', gap: id==='story'?Math.round(height*0.025):Math.round(height*0.04), textAlign: logoAlign === 'center' ? 'center' : 'left' }}>
        <div style={{ fontSize: id==='landscape'?Math.round(width*0.074):id==='story'?Math.round(width*0.1222):Math.round(width*0.1), fontWeight: 800, lineHeight: 1.05, color: fg, letterSpacing: '-0.03em' }}>{headline || 'Meet our newest members!'}</div>
        {subheadline && <div style={{ fontSize: id==='story'?Math.round(width*0.0463):Math.round(width*0.032), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 400, lineHeight: 1.5, color: fg, opacity: 0.75 }}>{subheadline}</div>}
      </div>
    </div>
  )
}

export function NewHireGrid({ people, dimension, isDark, slideIndex, totalSlides, logoAlign = 'left', backgroundId }) {
  const { width, height, id } = dimension
  const isLandscape = id === 'landscape'
  const fg    = isDark ? COLORS.white : COLORS.black
  const fgSub = isDark ? 'rgba(255,255,255,0.7)' : COLORS.gray600
  const nameColor = backgroundId === 'white' ? '#4E50D1'
    : backgroundId === 'black' || backgroundId === 'purple600' || backgroundId === 'purple500' || backgroundId === 'grad-1' || backgroundId === 'grad-2' || backgroundId === 'grad-3' || backgroundId === 'grad-4' ? '#051B2C'
    : isDark ? COLORS.cyan300 : COLORS.blue400
  const logomarkFilter = isDark ? 'brightness(0) invert(1)' : 'none'

  const allValid   = people.filter(p => p.name)
  const validPeople = isLandscape ? allValid.slice(0, 8) : allValid
  const n = validPeople.length

  const pad  = isLandscape ? Math.round(width * 0.052)  : Math.round(width * 0.074)
  const padV = isLandscape ? Math.round(height * 0.0926) : Math.round(height * 0.074)
  const logoH  = id === 'landscape' ? 80 : Math.round(height * 0.055)
  const logoMB = Math.round(height * 0.025)

  const maxPerRow = isLandscape ? 4 : 3
  const hGap   = isLandscape ? Math.round(width * 0.022)  : Math.round(width * 0.020)
  const rowGap = isLandscape ? Math.round(height * 0.04)  : Math.round(height * 0.028)

  function makeRows(n, max) {
    if (n <= max) return [n]
    const rows = []; let left = n
    while (left > 0) { rows.push(Math.min(max, left)); left -= Math.min(max, left) }
    return rows
  }
  const rowDist = n > 0 ? makeRows(n, maxPerRow) : [1]
  const nRows   = rowDist.length
  const maxCols = Math.max(...rowDist)

  // Card width fills the full available width regardless of avatar size
  const availW = width  - pad * 2
  const cardWidth = Math.floor((availW - (maxCols - 1) * hGap) / maxCols)

  // Available height for grid (with generous safety buffer)
  const availH = height - padV * 2 - logoH - logoMB - Math.round(height * 0.055)

  // Single-line card height (avatar + text below, 1.5 line-height, no wrapping)
  function cardH(av) {
    const tg = Math.max(Math.round(height * 0.008), Math.round(av * 0.10))
    const ns = Math.max(Math.round(height * 0.013), Math.min(Math.round(height * 0.020), Math.round(av * 0.16)))
    const ts = Math.max(Math.round(height * 0.011), Math.min(Math.round(height * 0.016), Math.round(av * 0.13)))
    const lg = Math.max(Math.round(height * 0.004), Math.round(av * 0.04))
    return av + tg + Math.ceil(ns * 1.5) + lg + Math.ceil(ts * 1.5)
  }

  // Height binary search: max av where all rows fit in availH
  let lo = 20, hi = Math.max(width, height)
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2)
    const total = nRows * cardH(mid) + (nRows - 1) * rowGap
    if (total <= availH) lo = mid; else hi = mid
  }
  const avH = lo

  // Avatar caps: proportion of canvas height — prevents single-row layouts from being huge
  const avHeightCap = n <= 1 ? Math.round(height * 0.25)
    : n <= 2 ? Math.round(height * 0.21)
    : n <= 3 ? Math.round(height * 0.17)
    : n <= 4 ? Math.round(height * 0.15)
    : Infinity

  // Avatar constrained by: height binary search + proportional height cap + card width
  // Card width constraint prevents avatar from overflowing its column
  const av = Math.max(36, Math.floor(Math.min(avH, avHeightCap, cardWidth)))

  // Final text metrics derived from avatar size
  const tg = Math.max(Math.round(height * 0.008), Math.round(av * 0.10))
  const ns = Math.max(Math.round(height * 0.013), Math.min(Math.round(height * 0.020), Math.round(av * 0.16)))
  const ts = Math.max(Math.round(height * 0.011), Math.min(Math.round(height * 0.016), Math.round(av * 0.13)))
  const lg = Math.max(Math.round(height * 0.004), Math.round(av * 0.04))

  const showDots = totalSlides > 2

  return (
    <div style={{ width, height, display: 'flex', flexDirection: 'column', padding: `${padV}px ${pad}px`, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: logoMB }}>
        <img src="/OneSignal-Logomark.svg" alt="OneSignal" style={{ height: logoH, width: 'auto', filter: logomarkFilter }} />
        {showDots && (
          <div style={{ display: 'flex', gap: Math.round(width * 0.008) }}>
            {Array.from({ length: totalSlides - 1 }).map((_, i) => (
              <div key={i} style={{ width: Math.round(width * 0.010), height: Math.round(width * 0.010), borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.2)', transform: i + 1 === slideIndex ? 'scale(1.3)' : 'scale(1)', transition: 'transform 0.2s' }} />
            ))}
          </div>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: rowGap, width: availW }}>
          {(() => {
            let idx = 0
            return rowDist.map((count, ri) => (
              <div key={ri} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: hGap, width: '100%' }}>
                {Array.from({ length: count }).map((_, ci) => {
                  const person = validPeople[idx++]
                  if (!person) return null
                  return (
                    <div key={ci} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: cardWidth, flexShrink: 0 }}>
                      <div style={{ width: av, height: av, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
                        {person.photo
                          ? <img src={person.photo} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', background: isDark ? COLORS.purple600 : COLORS.purple100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(av * 0.35), fontWeight: 700, color: isDark ? COLORS.white : COLORS.purple600, fontFamily: "'Epilogue', sans-serif" }}>{person.name.charAt(0)}</div>
                        }
                      </div>
                      <div style={{ color: nameColor, fontWeight: 700, fontSize: ns, fontFamily: "'Epilogue', sans-serif", lineHeight: 1.5, marginTop: tg, width: av, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{person.name}</div>
                      <div style={{ color: fgSub, fontSize: ts, fontFamily: "'Nunito Sans', sans-serif", lineHeight: 1.5, marginTop: lg, width: av, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{[person.title, person.company].filter(Boolean).join(', ')}</div>
                    </div>
                  )
                })}
              </div>
            ))
          })()}
        </div>
      </div>
    </div>
  )
}
