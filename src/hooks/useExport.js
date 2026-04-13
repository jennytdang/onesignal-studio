import { useCallback } from 'react'

export function useExport({ template, fields, dimension, background, pixelOverlay, newHireSlides, isDark }) {

  const captureSlide = useCallback(async (slideIndex) => {
    const html2canvas = (await import('html2canvas')).default
    const { width, height } = dimension
    const { NewHireCover, NewHireGrid } = await import('../components/templates/NewHire')
    const HeadlineOnly = (await import('../components/templates/HeadlineOnly')).default
    const StatCallout = (await import('../components/templates/StatCallout')).default
    const Quote = (await import('../components/templates/Quote')).default
    const EventPromo = (await import('../components/templates/EventPromo')).default
    const React = (await import('react')).default
    const { createRoot } = await import('react-dom/client')

    const container = document.createElement('div')
    container.style.cssText = `position: fixed; top: -99999px; left: -99999px; width: ${width}px; height: ${height}px; overflow: hidden;`
    document.body.appendChild(container)

    const bgStyle = background?.style || { backgroundColor: '#FFFFFF' }

    let slideEl
    if (template === 'newhire') {
      if (slideIndex === 0) {
        slideEl = React.createElement(NewHireCover, { fields, dimension, isDark })
      } else {
        const people = newHireSlides[slideIndex - 1] || []
        slideEl = React.createElement(NewHireGrid, { people, dimension, isDark, slideIndex, totalSlides: newHireSlides.length + 1 })
      }
    } else {
      const componentMap = { headline: HeadlineOnly, stat: StatCallout, quote: Quote, event: EventPromo }
      const Comp = componentMap[template]
      slideEl = Comp ? React.createElement(Comp, { fields, dimension, isDark }) : null
    }

    const wrapper = document.createElement('div')
    wrapper.style.cssText = `width:${width}px;height:${height}px;position:relative;overflow:hidden;`
    Object.assign(wrapper.style, bgStyle)
    container.appendChild(wrapper)

    if (pixelOverlay) {
      const overlay = document.createElement('div')
      overlay.className = 'pixel-overlay'
      overlay.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;'
      wrapper.appendChild(overlay)
    }

    const contentDiv = document.createElement('div')
    contentDiv.style.cssText = 'position:relative;z-index:2;width:100%;height:100%;'
    wrapper.appendChild(contentDiv)

    const root = createRoot(contentDiv)
    await new Promise(resolve => { root.render(slideEl); setTimeout(resolve, 600) })

    const canvas = await html2canvas(wrapper, {
      width, height, scale: 1, useCORS: true, allowTaint: true, backgroundColor: null, logging: false,
    })

    root.unmount()
    document.body.removeChild(container)
    return canvas
  }, [template, fields, dimension, background, pixelOverlay, newHireSlides, isDark])

  const exportJpg = useCallback(async () => {
    const canvas = await captureSlide(0)
    const link = document.createElement('a')
    link.download = `onesignal-studio-${template}-${dimension.id}.jpg`
    link.href = canvas.toDataURL('image/jpeg', 0.95)
    link.click()
  }, [captureSlide, template, dimension])

  const exportPdf = useCallback(async () => {
    const { jsPDF } = await import('jspdf')
    const totalSlides = newHireSlides.length + 1
    const { width, height } = dimension
    const pdf = new jsPDF({ orientation: width > height ? 'landscape' : 'portrait', unit: 'px', format: [width, height], hotfixes: ['px_scaling'] })
    for (let i = 0; i < totalSlides; i++) {
      if (i > 0) pdf.addPage([width, height])
      const canvas = await captureSlide(i)
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, width, height, undefined, 'FAST')
    }
    pdf.save('onesignal-new-hire-carousel.pdf')
  }, [captureSlide, newHireSlides, dimension])

  return { exportJpg, exportPdf }
}
