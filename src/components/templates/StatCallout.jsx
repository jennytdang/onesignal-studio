import OsLogo from '../OsLogo'
import { COLORS } from '../../constants/brand'

export default function StatCallout({ fields, dimension, isDark }) {
  const { pill, stat, statLabel, subheadline, cta } = fields
  const { width, height } = dimension
  const isLandscape = width > height
  const fg = isDark ? COLORS.white : COLORS.black
  const fgSub = isDark ? 'rgba(255,255,255,0.75)' : COLORS.gray600
  const accentColor = isDark ? COLORS.cyan300 : COLORS.purple600
  const pillBorder = isDark ? 'rgba(255,255,255,0.5)' : COLORS.purple600
  const pillText = isDark ? COLORS.white : COLORS.purple600
  const ctaBg = isDark ? COLORS.white : COLORS.black
  const ctaText = isDark ? COLORS.black : COLORS.white
  const pad = Math.round(width * 0.074)
  const statFontSize = height > 1400 ? Math.round(width * 0.26) : isLandscape ? Math.round(height * 0.28) : Math.round(width * 0.26)

  return (
    <div style={{ width, height, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: pad, fontFamily: "'Epilogue', sans-serif" }}>
      <OsLogo color={fg} height={Math.round(height * 0.034)} useImg={true} />
      <div style={{ flex: 1, display: 'flex', flexDirection: isLandscape ? 'row' : 'column', alignItems: isLandscape ? 'center' : 'flex-start', gap: isLandscape ? Math.round(width * 0.06) : Math.round(height * 0.03), justifyContent: 'center' }}>
        <div>
          {pill && <div style={{ display: 'inline-flex', marginBottom: Math.round(height * 0.02), border: `1.5px solid ${pillBorder}`, borderRadius: 999, padding: `${Math.round(height * 0.009)}px ${Math.round(width * 0.022)}px`, color: pillText, fontSize: Math.round(width * 0.022), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600 }}>{pill}</div>}
          <div style={{ fontSize: statFontSize, fontWeight: 800, lineHeight: 0.9, color: fg, letterSpacing: '-0.04em', whiteSpace: 'nowrap' }}>{stat || '2×'}</div>
          {statLabel && <div style={{ fontSize: Math.round(width * 0.028), fontWeight: 600, color: accentColor, marginTop: Math.round(height * 0.01), letterSpacing: '-0.01em' }}>{statLabel}</div>}
        </div>
        <div style={{ maxWidth: isLandscape ? '45%' : '80%' }}>
          {subheadline && <div style={{ fontSize: Math.round(width * 0.03), fontFamily: "'Nunito Sans', sans-serif", fontWeight: 400, lineHeight: 1.6, color: fgSub }}>{subheadline}</div>}
          {cta && <div style={{ display: 'inline-flex', marginTop: Math.round(height * 0.025), backgroundColor: ctaBg, color: ctaText, borderRadius: 999, padding: `${Math.round(height * 0.016)}px ${Math.round(width * 0.04)}px`, fontSize: Math.round(width * 0.024), fontWeight: 700 }}>{cta}</div>}
        </div>
      </div>
    </div>
  )
}
