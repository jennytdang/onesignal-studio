  const COLORS = { purple600: '#4E50D1', purple500: '#7274DA', purple400: '#9799E4', purple100: '#E5E6F8', purple50: '#F3F3FC', black: '#051B2C', white: '#FFFFFF', gray50: '#F3F4F5', gray100: '#E5E7E9', gray400: '#98A1A9', gray600: '#59626B', gray700: '#40464C', blue400: '#4DA6EF', cyan300: '#31E1DE', yellow300: '#FFC072', }
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
