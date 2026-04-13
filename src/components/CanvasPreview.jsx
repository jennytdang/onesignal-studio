import { useRef, useEffect, useState } from 'react'
import HeadlineOnly from './templates/HeadlineOnly'
import StatCallout from './templates/StatCallout'
import Quote from './templates/Quote'
import EventPromo from './templates/EventPromo'
import { NewHireCover, NewHireGrid } from './templates/NewHire'

function TemplateRenderer({ template, fields, dimension, isDark, slideIndex, newHireSlides }) {
  if (template === 'headline') return <HeadlineOnly fields={fields} dimension={dimension} isDark={isDark} />
  if (template === 'stat')     return <StatCallout fields={fields} dimension={dimension} isDark={isDark} />
  if (template === 'quote')    return <Quote fields={fields} dimension={dimension} isDark={isDark} />
  if (template === 'event')    return <EventPromo fields={fields} dimension={dimension} isDark={isDark} />
  if (template === 'newhire') {
    if (slideIndex === 0) return <NewHireCover fields={fields} dimension={dimension} isDark={isDark} />
    const gridPeople = newHireSlides[slideIndex - 1] || []
    return <NewHireGrid people={gridPeople} dimension={dimension} isDark={isDark} slideIndex={slideIndex} totalSlides={newHireSlides.length + 1} />
  }
  return null
}
export { TemplateRenderer }

export default function CanvasPreview({
  template, fields, dimension, background, pixelOverlay,
  slideIndex, newHireSlides, setSlideIndex, totalSlides,
}) {
  const containerRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [zoom, setZoom] = useState(1)

  const { width: cw, height: ch } = dimension

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const { width, height } = el.getBoundingClientRect()
      setScale(Math.min((width - 120) / cw, (height - 120) / ch, 1))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [cw, ch])

  const isDark = background?.isDark ?? false
  const bgStyle = background?.style || { backgroundColor: '#FFFFFF' }

  const navBtn = (disabled) => ({
    padding: '6px 16px', borderRadius: 6,
    background: disabled ? '#F3F4F5' : '#FFFFFF',
    color: disabled ? '#98A1A9' : '#051B2C',
    border: '1px solid #E5E7E9',
    cursor: disabled ? 'default' : 'pointer',
    fontSize: 13, fontFamily: "'Epilogue', sans-serif", fontWeight: 600,
  })

  const effectiveScale = scale * zoom

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 16, minHeight: 0, padding: 32, position: 'relative',
        background: '#F3F4F5',
        backgroundImage: 'radial-gradient(circle, #C7CCD1 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        overflow: 'auto',
      }}
    >
      {/* Zoom controls */}
      <div style={{
        position: 'absolute', top: 12, right: 16, display: 'flex',
        alignItems: 'center', gap: 6, zIndex: 10,
        background: '#fff', border: '1px solid #E5E7E9', borderRadius: 8,
        padding: '4px 8px',
      }}>
        <button
          onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#051B2C', lineHeight: 1, padding: '0 4px' }}
          title="Zoom out"
        >−</button>
        <span style={{ fontSize: 12, color: '#59626B', fontFamily: "'Nunito Sans', sans-serif", minWidth: 40, textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(z => Math.min(2, z + 0.25))}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#051B2C', lineHeight: 1, padding: '0 4px' }}
          title="Zoom in"
        >+</button>
        <button
          onClick={() => setZoom(1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#98A1A9', fontFamily: "'Nunito Sans', sans-serif", padding: '0 2px' }}
          title="Reset zoom"
        >↺</button>
      </div>

      {/* Canvas preview */}
      <div style={{
        width: cw * effectiveScale,
        height: ch * effectiveScale,
        position: 'relative', flexShrink: 0, borderRadius: 4, overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(5,27,44,0.1), 0 1px 4px rgba(5,27,44,0.08)',
      }}>
        <div
          id="canvas-root"
          className="canvas-root"
          style={{
            width: cw, height: ch,
            transformOrigin: 'top left',
            transform: `scale(${effectiveScale})`,
            position: 'relative', overflow: 'hidden',
            ...bgStyle,
          }}
        >
          {/* Pixel overlay */}
          {pixelOverlay && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
              backgroundImage: 'repeating-conic-gradient(rgba(0,0,0,0.04) 0% 25%, rgba(255,255,255,0.04) 0% 50%)',
              backgroundSize: '8px 8px',
            }} />
          )}
          <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
            <TemplateRenderer
              template={template} fields={fields} dimension={dimension}
              isDark={isDark} slideIndex={slideIndex} newHireSlides={newHireSlides}
            />
          </div>
        </div>
      </div>

      {/* New hire slide nav */}
      {template === 'newhire' && totalSlides > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSlideIndex(Math.max(0, slideIndex - 1))} disabled={slideIndex === 0} style={navBtn(slideIndex === 0)}>← Prev</button>
          <span style={{ color: '#59626B', fontSize: 13, fontFamily: "'Nunito Sans', sans-serif" }}>Slide {slideIndex + 1} of {totalSlides}</span>
          <button onClick={() => setSlideIndex(Math.min(totalSlides - 1, slideIndex + 1))} disabled={slideIndex === totalSlides - 1} style={navBtn(slideIndex === totalSlides - 1)}>Next →</button>
        </div>
      )}

      {/* Dimension label */}
      <div style={{
        position: 'absolute', bottom: 12, left: 16,
        fontSize: 11, color: '#98A1A9', fontFamily: "'Nunito Sans', sans-serif", letterSpacing: '0.04em',
      }}>{cw} × {ch}</div>
    </div>
  )
}
