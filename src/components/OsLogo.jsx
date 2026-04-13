export default function OsLogo({ color = '#051B2C', height = 32 }) {
  return (
    <svg height={height} viewBox="0 0 180 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="OneSignal">
      <circle cx="17" cy="18" r="16" stroke={color} strokeWidth="2.5" fill="none"/>
      <path d="M17 9 C17 9, 24 13, 24 18 C24 23, 17 27, 17 27 C17 27, 10 23, 10 18 C10 13, 17 9, 17 9Z" fill={color} opacity="0.15"/>
      <circle cx="17" cy="18" r="5" fill={color}/>
      <path d="M17 10 A8 8 0 0 1 25 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M17 10 A8 8 0 0 0 9 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <text x="40" y="24" fontFamily="'Epilogue', sans-serif" fontWeight="700" fontSize="18" fill={color} letterSpacing="-0.3">OneSignal</text>
    </svg>
  )
}

export function OsIcon({ color = '#051B2C', size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16" stroke={color} strokeWidth="2.5" fill="none"/>
      <circle cx="18" cy="18" r="5" fill={color}/>
      <path d="M18 10 A8 8 0 0 1 26 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M18 10 A8 8 0 0 0 10 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    </svg>
  )
}
