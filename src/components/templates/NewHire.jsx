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
    : ['black','purple600','purple500','grad-1','grad-2','grad-3','grad-4'].includes(backgroundId) ? '#051B2C'
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
  const hGap   = isLandscape ? Math.round(width * 0.022) : Math.round(width * 0.020)
  const rowGap = isLandscape ? Math.round(height * 0.04) : Math.round(height * 0.028)

  function makeRows(n, max) {
    if (!isLandscape && n === 5) return [3, 2]
    if (n <= max) return [n]
    const rows = []; let left = n
    while (left > 0) { rows.push(Math.min(max, left)); left -= Math.min(max, left) }
    return rows
  }
  const rowDist = n > 0 ? makeRows(n, maxPerRow) : [1]
  const nRows   = rowDist.length
  const maxCols = Math.max(...rowDist)

  const availW = width - pad * 2
  const cardWidth = Math.floor((availW - (maxCols - 1) * hGap) / maxCols)
  const availH = height - padV * 2 - logoH - logoMB - Math.round(height * 0.055)

  function cardH(av) {
    const tg = Math.max(Math.round(height * 0.008), Math.round(av * 0.10))
    const ns = Math.max(Math.round(height * 0.013), Math.min(Math.round(height * 0.020), Math.round(av * 0.16)))
    const ts = Math.max(Math.round(height * 0.011), Math.min(Math.round(height * 0.016), Math.round(av * 0.13)))
    const lg = Math.max(Math.round(height * 0.004), Math.round(av * 0.04))
    return av + tg + Math.ceil(ns * 1.5) + lg + Math.ceil(ts * 1.5)
  }

  let lo = 20, hi = Math.max(width, height)
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2)
    if (nRows * cardH(mid) + (nRows - 1) * rowGap <= availH) lo = mid; else hi = mid
  }
  const avH = lo

  // Per-count exact specs: { av, ns, tg, ts, lg, lh }
  const spec =
    n === 1 ? (
      id === 'square'    ? { av:300, ns:32, tg:28, ts:28, lg:8, lh:1.5  } :
      id === 'portrait'  ? { av:418, ns:48, tg:48, ts:36, lg:8, lh:1.5  } :
      id === 'landscape' ? { av:428, ns:50, tg:48, ts:42, lg:8, lh:1.5  } :
                           { av:500, ns:56, tg:48, ts:48, lg:8, lh:1.5  }
    ) : n === 2 ? (
      id === 'square'    ? { av:300, ns:32, tg:32, ts:24, lg:8, lh:1.5  } :
      id === 'portrait'  ? { av:418, ns:34, tg:32, ts:28, lg:8, lh:1.5  } :
      id === 'landscape' ? { av:428, ns:44, tg:32, ts:36, lg:8, lh:1.5  } :
                           { av:380, ns:40, tg:48, ts:36, lg:8, lh:1.5  }
    ) : n === 3 ? (
      id === 'square'    ? { av:260, ns:28, tg:24, ts:22, lg:8, lh:1.5  } :
      id === 'portrait'  ? { av:230, ns:30, tg:32, ts:26, lg:8, lh:1.5  } :
      id === 'landscape' ? { av:360, ns:42, tg:48, ts:34, lg:8, lh:1.5  } :
                           { av:260, ns:38, tg:48, ts:34, lg:8, lh:1.5  }
    ) : n === 4 ? (
      id === 'square'    ? { av:200, ns:26, tg:36, ts:22, lg:6, lh:1.35 } :
      id === 'portrait'  ? { av:230, ns:32, tg:36, ts:26, lg:6, lh:1.35 } :
      id === 'landscape' ? { av:340, ns:36, tg:42, ts:32, lg:6, lh:1.35 } :
                           { av:260, ns:36, tg:36, ts:30, lg:6, lh:1.35 }
    ) : n <= 6 ? (
      id === 'square'    ? { av:200, ns:26, tg:36, ts:22, lg:6, lh:1.35 } :
      id === 'portrait'  ? { av:230, ns:32, tg:36, ts:26, lg:6, lh:1.35 } :
      id === 'landscape' ? { av:240, ns:32, tg:32, ts:26, lg:6, lh:1.35 } :
                           { av:260, ns:36, tg:36, ts:30, lg:6, lh:1.35 }
    ) : (
      id === 'landscape' ? { av:240, ns:32, tg:32, ts:26, lg:6, lh:1.35 } : null
    )

  const finalAv = spec ? Math.min(spec.av, cardWidth) : Math.min(avH, cardWidth)
  const lineH = spec?.lh ?? 1.5
  const tg = spec?.tg ?? Math.max(Math.round(height * 0.008), Math.round(finalAv * 0.10))
  const ns = spec?.ns ?? Math.max(Math.round(height * 0.013), Math.min(Math.round(height * 0.020), Math.round(finalAv * 0.16)))
  const ts = spec?.ts ?? Math.max(Math.round(height * 0.011), Math.min(Math.round(height * 0.016), Math.round(finalAv * 0.13)))
  const lg = spec?.lg ?? Math.max(Math.round(height * 0.004), Math.round(finalAv * 0.04))

  const showDots = totalSlides > 2

  return (
    <div style={{ width, height, display:'flex', flexDirection:'column', padding:`${padV}px ${pad}px`, overflow:'hidden' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0, marginBottom:logoMB }}>
        <img src="/OneSignal-Logomark.svg" alt="OneSignal" style={{ height:logoH, width:'auto', filter:logomarkFilter }} />
        {showDots && (
          <div style={{ display:'flex', gap:Math.round(width*0.008) }}>
            {Array.from({ length: totalSlides - 1 }).map((_, i) => (
              <div key={i} style={{ width:Math.round(width*0.010), height:Math.round(width*0.010), borderRadius:'50%', background: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.2)', transform: i+1===slideIndex ? 'scale(1.3)' : 'scale(1)', transition:'transform 0.2s' }} />
            ))}
          </div>
        )}
      </div>
      <div style={{ flex:1, minHeight:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:rowGap, width:availW }}>
          {(() => {
            let idx = 0
            return rowDist.map((count, ri) => (
              <div key={ri} style={{ display:'flex', alignItems:'flex-start', justifyContent:'center', gap:hGap, width:'100%' }}>
                {Array.from({ length: count }).map((_, ci) => {
                  const person = validPeople[idx++]
                  if (!person) return null
                  return (
                    <div key={ci} style={{ display:'flex', flexDirection:'column', alignItems:'center', width:cardWidth, flexShrink:0 }}>
                      <div style={{ width:finalAv, height:finalAv, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:`2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}>
                        {person.photo
                          ? <img src={person.photo} alt={person.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                          : <div style={{ width:'100%', height:'100%', background: isDark ? COLORS.purple600 : COLORS.purple100, display:'flex', alignItems:'center', justifyContent:'center', fontSize:Math.round(finalAv*0.35), fontWeight:700, color: isDark ? COLORS.white : COLORS.purple600, fontFamily:"'Epilogue', sans-serif" }}>{person.name.charAt(0)}</div>
                        }
                      </div>
                      <div style={{ color:nameColor, fontWeight:700, fontSize:ns, fontFamily:"'Epilogue', sans-serif", lineHeight:lineH, marginTop:tg, width:cardWidth, textAlign:'center', whiteSpace:'normal', wordBreak:'break-word' }}>{person.name}</div>
                      <div style={{ color:fgSub, fontSize:ts, fontFamily:"'Nunito Sans', sans-serif", lineHeight:lineH, marginTop:lg, width:cardWidth, textAlign:'center', whiteSpace:'normal', wordBreak:'break-word' }}>{[person.title, person.company].filter(Boolean).join(', ')}</div>
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
