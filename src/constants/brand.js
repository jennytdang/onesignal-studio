export const COLORS = { purple600: '#4E50D1', purple500: '#7274DA', purple400: '#9799E4', purple100: '#E5E6F8', purple50: '#F3F3FC', black: '#051B2C', white: '#FFFFFF', gray50: '#F3F4F5', gray100: '#E5E7E9', gray400: '#98A1A9', gray600: '#59626B', gray700: '#40464C', blue400: '#4DA6EF', cyan300: '#31E1DE', yellow300: '#FFC072', }

export const FONTS = { heading: "'Epilogue', sans-serif", body: "'Nunito Sans', sans-serif" }

export const DIMENSIONS = {
  square:    { id: 'square',    label: '1080 × 1080', sublabel: 'Square',    width: 1080, height: 1080 },
  portrait:  { id: 'portrait',  label: '1080 × 1350', sublabel: 'Portrait',  width: 1080, height: 1350 },
  story:     { id: 'story',     label: '1080 × 1920', sublabel: 'Story',     width: 1080, height: 1920 },
  landscape: { id: 'landscape', label: '1920 × 1080', sublabel: 'Landscape', width: 1920, height: 1080 },
}

export const SCALE = {
  square: {
    headline:    (w, h) => w * 0.088,
    sub:         (w, h) => w * 0.026,
    pill:        (w, h) => w * 0.022,
    cta:         (w, h) => w * 0.025,
    avatar:      (w, h) => w * 0.10,
    authorName:  (w, h) => w * 0.035,
    authorTitle: (w, h) => w * 0.024,
    logo:        (w, h) => h * 0.055,
    pad:         (w, h) => w * 0.074,
    gap:         (w, h) => h * 0.030,
    quoteSize:   (w, h) => w * 0.052,
    quoteIcon:   (w, h) => w * 0.075,
    quoteBorder: (w, h) => 8,
    quoteGap:    (w, h) => Math.round(w * 0.044),
    statSize:    (w, h) => w * 0.26,
  },
  portrait: {
    headline:    (w, h) => w * 0.082,
    sub:         (w, h) => w * 0.024,
    pill:        (w, h) => w * 0.020,
    cta:         (w, h) => w * 0.023,
    avatar:      (w, h) => w * 0.11,
    authorName:  (w, h) => w * 0.035,
    authorTitle: (w, h) => w * 0.024,
    logo:        (w, h) => h * 0.050,
    pad:         (w, h) => w * 0.074,
    gap:         (w, h) => h * 0.028,
    quoteSize:   (w, h) => w * 0.048,
    quoteIcon:   (w, h) => w * 0.070,
    quoteBorder: (w, h) => 8,
    quoteGap:    (w, h) => Math.round(w * 0.044),
    statSize:    (w, h) => w * 0.26,
  },
  story: {
    headline:    (w, h) => w * 0.105,
    sub:         (w, h) => w * 0.032,
    pill:        (w, h) => w * 0.026,
    cta:         (w, h) => w * 0.029,
    avatar:      (w, h) => w * 0.13,
    authorName:  (w, h) => w * 0.035,
    authorTitle: (w, h) => w * 0.024,
    logo:        (w, h) => h * 0.038,
    pad:         (w, h) => w * 0.080,
    gap:         (w, h) => h * 0.022,
    quoteSize:   (w, h) => w * 0.060,
    quoteIcon:   (w, h) => w * 0.090,
    quoteBorder: (w, h) => 8,
    quoteGap:    (w, h) => Math.round(w * 0.044),
    statSize:    (w, h) => w * 0.26,
  },
  landscape: {
    headline:    (w, h) => h * 0.095,
    sub:         (w, h) => h * 0.030,
    pill:        (w, h) => h * 0.024,
    cta:         (w, h) => h * 0.026,
    avatar:      (w, h) => h * 0.115,
    authorName:  (w, h) => h * 0.035,
    authorTitle: (w, h) => h * 0.024,
    logo:        (w, h) => h * 0.060,
    pad:         (w, h) => h * 0.0926,
    gap:         (w, h) => h * 0.028,
    quoteSize:   (w, h) => h * 0.056,
    quoteIcon:   (w, h) => h * 0.085,
    quoteBorder: (w, h) => 8,
    quoteGap:    (w, h) => Math.round(h * 0.044),
    statSize:    (w, h) => h * 0.28,
  },
}

export const BACKGROUNDS = {
  solids: [
    { id: 'black',    label: 'Black',      isDark: true,  sources: { square: '/black_1080x1080.png',        portrait: '/black_1080x1350.png',        story: '/black_1080x1920.png',        landscape: '/black_1920x1080.png'        } },
    { id: 'purple600',label: 'Purple',     isDark: true,  sources: { square: '/purple-600_1080x1080.png',   portrait: '/purple-600_1080x1350.png',   story: '/purple-600_1080x1920.png',   landscape: '/purple-600_1920x1080.png'   } },
    { id: 'purple500',label: 'Purple 500', isDark: true,  sources: { square: '/purple-500_1080x1080.png',  portrait: '/purple-500_1080x1350.png',   story: '/purple-500_1080x1920.png',            landscape: '/purple-500_1920x1080.png'   } },
    { id: 'white',    label: 'White',      isDark: false, sources: { square: '/white_1080x1080.png',        portrait: '/white_1080x1350.png',        story: '/white_1080x1920.png',        landscape: '/white_1920x1080.png'        } },
  ],
  gradients: [
    { id: 'grad-1', label: 'Aurora Mist',   isDark: false, sources: { square: '/grad-1_1080x1080.png',        portrait: '/grad-1_1080x1350.png',        story: '/grad-1_1080x1920.png',        landscape: '/grad-1_1920x1080.png'        } },
    { id: 'grad-2', label: 'Tropical Flux', isDark: true,  sources: { square: '/grad-2_1080x1080.png',  portrait: '/grad-2_1080x1350.png',        story: '/grad-2_1080x1920.png',        landscape: '/grad-2_1920x1080.png'        } },
    { id: 'grad-3', label: 'Ocean Dusk',    isDark: true,  sources: { square: '/grad-3_1080x1080.png',        portrait: '/grad-3_1080x1350.png',        story: '/grad-3_1080x1920.png',        landscape: '/grad-3_1920x1080.png'        } },
    { id: 'grad-4', label: 'Indigo Drift',  isDark: false,  sources: { square: '/grad-4_1080x1080.png',        portrait: '/grad-4_1080x1350.png',        story: '/grad-4_1080x1920.png',        landscape: '/grad-4_1920x1080.png'        } },
  ],
}

export const LOGO_ALIGN = { left: 'left', center: 'center' }

export const TEMPLATES = [
  { id: 'headline', label: 'Headline',       icon: '✦', description: 'Bold statement, minimal layout' },
  { id: 'stat',     label: 'Stat Callout',   icon: '2×', description: 'Big number with supporting copy' },
  { id: 'quote',    label: 'Quote',          icon: '"', description: 'Customer or internal quote' },
  { id: 'event',    label: 'Event / Webinar', icon: '◷', description: 'Date, speakers, optional CTA' },
  { id: 'newhire',  label: 'New Hire',       icon: '✦', description: 'Team welcome carousel' },
]

export const PILL_PRESETS = [
  'Webinar', 'In-Person Event', 'New Feature', 'Report', 'New Hire',
  'Case Study', 'Partnership', 'Announcement', 'Blog',
]

export const COVER_EMOJIS = ['🎉', '🙌', '👋', '🚀', '✨', '🎊', '💜', '⚡']
