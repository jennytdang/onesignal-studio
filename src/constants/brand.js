export const COLORS = { purple600: '#4E50D1', purple500: '#7274DA', purple400: '#9799E4', purple100: '#E5E6F8', purple50: '#F3F3FC', black: '#051B2C', white: '#FFFFFF', gray50: '#F3F4F5', gray100: '#E5E7E9', gray400: '#98A1A9', gray600: '#59626B', gray700: '#40464C', blue400: '#4DA6EF', cyan300: '#31E1DE', yellow300: '#FFC072', }

export const FONTS = { heading: "'Epilogue', sans-serif", body: "'Nunito Sans', sans-serif" }

export const DIMENSIONS = {
  square:    { id: 'square',    label: '1080 × 1080', sublabel: 'Square',    width: 1080, height: 1080 },
  portrait:  { id: 'portrait',  label: '1080 × 1350', sublabel: 'Portrait',  width: 1080, height: 1350 },
  story:     { id: 'story',     label: '1080 × 1920', sublabel: 'Story',     width: 1080, height: 1920 },
  landscape: { id: 'landscape', label: '1920 × 1080', sublabel: 'Landscape', width: 1920, height: 1080 },
}

export const BACKGROUNDS = {
  solids: [
    { id: 'black',    label: 'Black',      isDark: true,  style: { backgroundColor: '#051B2C' } },
    { id: 'purple600',label: 'Purple',     isDark: true,  style: { backgroundColor: '#4E50D1' } },
    { id: 'purple500',label: 'Purple 500', isDark: true,  style: { backgroundColor: '#7274DA' } },
    { id: 'purple100',label: 'Lavender',   isDark: false, style: { backgroundColor: '#E5E6F8' } },
    { id: 'white',    label: 'White',      isDark: false, style: { backgroundColor: '#FFFFFF' } },
  ],
  gradients: [
    { id: 'grad-1', label: 'Aurora Mist',   isDark: false, useImage: true, src: '/onesignal-gradient-1.png', style: { backgroundImage: 'url(/onesignal-gradient-1.png)', backgroundSize: 'cover', backgroundPosition: 'center' } },
    { id: 'grad-2', label: 'Tropical Flux', isDark: true,  useImage: true, src: '/onesignal-gradient-2.png', style: { backgroundImage: 'url(/onesignal-gradient-2.png)', backgroundSize: 'cover', backgroundPosition: 'center' } },
    { id: 'grad-3', label: 'Ocean Dusk',    isDark: true,  useImage: true, src: '/onesignal-gradient-3.png', style: { backgroundImage: 'url(/onesignal-gradient-3.png)', backgroundSize: 'cover', backgroundPosition: 'center' } },
    { id: 'grad-4', label: 'Indigo Drift',  isDark: true,  useImage: true, src: '/onesignal-gradient-4.png', style: { backgroundImage: 'url(/onesignal-gradient-4.png)', backgroundSize: 'cover', backgroundPosition: 'center' } },
  ],
}

export const LOGO_ALIGN = { left: 'left', center: 'center' }

export const TEMPLATES = [
  { id: 'headline', label: 'Headline',       icon: '✦', description: 'Bold statement, minimal layout' },
  { id: 'stat',     label: 'Stat Callout',   icon: '2×', description: 'Big number with supporting copy' },
  { id: 'quote',    label: 'Quote',          icon: '"', description: 'Customer or internal quote' },
  { id: 'event',    label: 'Event / Webinar', icon: '◷', description: 'Date, speakers, CTA' },
  { id: 'newhire',  label: 'New Hire',       icon: '✦', description: 'Team welcome carousel' },
]

export const PILL_PRESETS = [
  'Webinar', 'In-Person Event', 'New Feature', 'Report', 'New Hire',
  'Case Study', 'Partnership', 'Announcement', 'Blog',
]

export const COVER_EMOJIS = ['🎉', '🙌', '👋', '🚀', '✨', '🎊', '💜', '⚡']
