import { useState, useCallback, useRef, useEffect } from 'react'
import CanvasPreview from './components/CanvasPreview'
import StudioLogo from './components/StudioLogo'
import { useExport } from './hooks/useExport'
import { COLORS, DIMENSIONS, BACKGROUNDS, TEMPLATES, PILL_PRESETS, COVER_EMOJIS } from './constants/brand'

const T = { bg:'#FFFFFF', bgPage:'#F3F4F5', bgSurface:'#FFFFFF', bgInput:'#FFFFFF', bgHover:'#F3F4F5', border:'#E5E7E9', borderFocus:'#4E50D1', text:'#051B2C', textSub:'#59626B', textMuted:'#98A1A9', purple:'#4E50D1', purple50:'#F3F3FC', white:'#FFFFFF' }

const emptyPerson = () => ({ name:'', title:'', company:'', photo:'' })

const TEMPLATE_DEFAULTS = {
  headline: { pill:'New Product Feature', headline:'Introducing OneSignal Evens', subheadline:'Act on every moment that matters', cta:'Learn more about Events', stat:'', statLabel:'', authorName:'', authorTitle:'', authorCompany:'', showHeadshot:false, headshotUrl:'', eventDate:'', eventLocation:'', speakers:[{name:'',title:'',company:'',photo:''}], emoji:'🎉' },
  stat:     { pill:'', headline:'', subheadline:'An eye-opening look at what happens when you stop emailing disengaged users', cta:'Read the case study', stat:'+67%', statLabel:'Boost in email opens', authorName:'', authorTitle:'', authorCompany:'', showHeadshot:false, headshotUrl:'', eventDate:'', eventLocation:'', speakers:[{name:'',title:'',company:'',photo:''}], emoji:'🎉' },
  quote:    { pill:'', headline:'We were able to generate more engagement with the product and were able to attribute some transactional messages to these campaigns, which we consider a huge success.', subheadline:'', cta:'', stat:'', statLabel:'', authorName:'Daria Dovzhikova', authorTitle:'Growth Product Manager', authorCompany:'Bitcoin.com', showHeadshot:false, headshotUrl:'', eventDate:'', eventLocation:'', speakers:[{name:'',title:'',company:'',photo:''}], emoji:'🎉' },
  event:    { pill:'Webinar', headline:'The 2026 State of Customer Engagement', subheadline:'', cta:'Save your spot now', stat:'', statLabel:'', authorName:'', authorTitle:'', authorCompany:'', showHeadshot:false, headshotUrl:'', eventDate:'Thursday, March 26 @ 9:00AM PDT', eventLocation:'', speakers:[{name:'Baris Girgin',title:'Associate Director UA',company:'Zynga',photo:''},{name:'',title:'',company:'',photo:''}], emoji:'🎉' },
  newhire:  { pill:'', headline:'Meet our newest members!', subheadline:'', cta:'', stat:'', statLabel:'', authorName:'', authorTitle:'', authorCompany:'', showHeadshot:false, headshotUrl:'', eventDate:'', eventLocation:'', speakers:[{name:'',title:'',company:'',photo:''}], emoji:'🎉' },
}

const PX_COLS = 12, PX_ROWS = 4, PX_MAX_DELAY = 250
function usePixelTrail() {
  const btnRef = useRef(null)
  const cellEls = useRef([])
  const gridRef = useRef(null)
  useEffect(() => {
    const btn = btnRef.current
    const grid = gridRef.current
    if (!btn || !grid) return
    const cells = []
    for (let r = 0; r < PX_ROWS; r++) {
      for (let c = 0; c < PX_COLS; c++) {
        const el = document.createElement('div')
        el.style.cssText = 'background:#4E50D1;opacity:0;transition-property:opacity;transition-duration:0s;transition-delay:0s;'
        grid.appendChild(el)
        cells.push({ el, cx:(c+0.5)/PX_COLS, cy:(r+0.5)/PX_ROWS })
      }
    }
    cellEls.current = cells
    const onEnter = (e) => {
      const rect = btn.getBoundingClientRect()
      const ex = (e.clientX - rect.left) / rect.width
      const ey = (e.clientY - rect.top) / rect.height
      const dists = cells.map(({cx,cy}) => Math.sqrt((cx-ex)**2+(cy-ey)**2))
      const maxD = Math.max(...dists)
      cells.forEach(({el},i) => {
        const base = (dists[i]/maxD) * PX_MAX_DELAY
        const noise = (Math.random()-0.5) * PX_MAX_DELAY * 0.5
        const delay = Math.max(0, Math.min(PX_MAX_DELAY+30, base+noise))
        el.style.transitionDelay = delay.toFixed(1)+'ms'
        el.style.transitionDuration = '0s'
        el.style.opacity = '1'
      })
    }
    const onLeave = () => {
      cells.forEach(({el}) => { el.style.transitionDelay='0s'; el.style.transitionDuration='0s'; el.style.opacity='0' })
    }
    btn.addEventListener('mouseenter', onEnter)
    btn.addEventListener('mouseleave', onLeave)
    return () => { btn.removeEventListener('mouseenter', onEnter); btn.removeEventListener('mouseleave', onLeave) }
  }, [])
  return { btnRef, gridRef }
}

function SectionLabel({ children }) {
  return <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:T.textMuted, fontFamily:"'Epilogue', sans-serif", marginBottom:8 }}>{children}</div>
}
function Input({ label, value, onChange, placeholder, multiline, rows=3 }) {
  const [focused, setFocused] = useState(false)
  const style = { width:'100%', background:T.bgInput, border:`1px solid ${focused?T.borderFocus:T.border}`, borderRadius:2, padding:'9px 12px', color:T.text, fontSize:13, fontFamily:"'Nunito Sans', sans-serif", outline:'none', resize:multiline?'vertical':'none', lineHeight:1.5, boxSizing:'border-box', transition:'border-color 0.15s' }
  return (
    <div style={{marginBottom:12}}>
      {label && <div style={{fontSize:12,color:T.textSub,marginBottom:5,fontFamily:"'Nunito Sans', sans-serif"}}>{label}</div>}
      {multiline ? <textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} style={style}/> : <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} style={style}/>}
    </div>
  )
}
function Toggle({ label, checked, onChange }) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
      <span style={{fontSize:13,color:T.textSub,fontFamily:"'Nunito Sans', sans-serif"}}>{label}</span>
      <button onClick={()=>onChange(!checked)} style={{width:40,height:22,borderRadius:11,border:'none',cursor:'pointer',background:checked?T.purple:T.border,position:'relative',transition:'background 0.2s',flexShrink:0}}>
        <div style={{position:'absolute',top:3,left:checked?21:3,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.15)'}}/>
      </button>
    </div>
  )
}
function PhotoUpload({ label, value, onChange }) {
  const handleFile = e => { const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>onChange(ev.target.result); r.readAsDataURL(f) }
  return (
    <div style={{marginBottom:12}}>
      {label && <div style={{fontSize:12,color:T.textSub,marginBottom:5,fontFamily:"'Nunito Sans', sans-serif"}}>{label}</div>}
      <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',background:T.bgPage,border:`1px dashed ${T.border}`,borderRadius:2,padding:'10px 12px'}}>
        {value ? <img src={value} alt="" style={{width:32,height:32,borderRadius:'50%',objectFit:'cover'}}/> : <div style={{width:32,height:32,borderRadius:'50%',background:T.border,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:T.textMuted}}>+</div>}
        <span style={{fontSize:12,color:T.textMuted,fontFamily:"'Nunito Sans', sans-serif"}}>{value?'Change photo':'Upload photo'}</span>
        <input type="file" accept="image/*" onChange={handleFile} style={{display:'none'}}/>
      </label>
    </div>
  )
}
function Divider() { return <div style={{height:1,background:T.border,margin:'14px 0'}}/> }

function CommonFields({ fields, update }) {
  const [pillOpen, setPillOpen] = useState(false)
  return (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:12,color:T.textSub,marginBottom:5,fontFamily:"'Nunito Sans', sans-serif"}}>Pre-pill <span style={{color:T.textMuted}}>(optional)</span></div>
      <div style={{position:'relative'}}>
        <input type="text" value={fields.pill} onChange={e=>update('pill',e.target.value)} placeholder="e.g. Webinar, New Feature…" onFocus={()=>setPillOpen(true)} onBlur={()=>setTimeout(()=>setPillOpen(false),150)} style={{width:'100%',background:T.bgInput,border:`1px solid ${T.border}`,borderRadius:2,padding:'9px 12px',color:T.text,fontSize:13,fontFamily:"'Nunito Sans', sans-serif",outline:'none',boxSizing:'border-box'}}/>
        {pillOpen && <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:50,background:T.bgSurface,border:`1px solid ${T.border}`,borderRadius:2,marginTop:4,overflow:'hidden',boxShadow:'0 4px 16px rgba(5,27,44,0.08)'}}>
          {PILL_PRESETS.filter(p=>!fields.pill||p.toLowerCase().includes(fields.pill.toLowerCase())).map(p=><div key={p} onMouseDown={()=>update('pill',p)} style={{padding:'9px 12px',fontSize:13,color:T.text,cursor:'pointer',fontFamily:"'Nunito Sans', sans-serif"}} onMouseEnter={e=>e.currentTarget.style.background=T.bgHover} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>{p}</div>)}
        </div>}
      </div>
    </div>
  )
}

function HeadlineFields({ fields, update }) { return (<><CommonFields fields={fields} update={update}/><Input label="Headline *" value={fields.headline} onChange={v=>update('headline',v)} placeholder="Your bold headline"/><Input label="Subheadline" value={fields.subheadline} onChange={v=>update('subheadline',v)} placeholder="Supporting copy" multiline rows={2}/><Input label="CTA Button" value={fields.cta} onChange={v=>update('cta',v)} placeholder="e.g. Learn more"/></>) }
function StatFields({ fields, update }) { return (<><CommonFields fields={fields} update={update}/><Input label="Stat / Number *" value={fields.stat} onChange={v=>update('stat',v)} placeholder="e.g. 2×, 98%, 10M"/><Input label="Stat Label" value={fields.statLabel} onChange={v=>update('statLabel',v)} placeholder="e.g. faster delivery"/><Input label="Supporting Copy" value={fields.subheadline} onChange={v=>update('subheadline',v)} placeholder="Context for the stat…" multiline rows={3}/><Input label="CTA Button" value={fields.cta} onChange={v=>update('cta',v)} placeholder="e.g. Read the report"/></>) }
function QuoteFields({ fields, update }) { return (<><CommonFields fields={fields} update={update}/><Input label="Quote *" value={fields.headline} onChange={v=>update('headline',v)} placeholder="The quote text goes here…" multiline rows={4}/><Divider/><SectionLabel>Attribution</SectionLabel><Toggle label="Show headshot" checked={fields.showHeadshot} onChange={v=>update('showHeadshot',v)}/>{fields.showHeadshot&&<PhotoUpload label="Headshot" value={fields.headshotUrl} onChange={v=>update('headshotUrl',v)}/>}<Input label="Author Name" value={fields.authorName} onChange={v=>update('authorName',v)} placeholder="Jane Smith"/><Input label="Author Title" value={fields.authorTitle} onChange={v=>update('authorTitle',v)} placeholder="VP of Marketing"/><Input label="Company" value={fields.authorCompany} onChange={v=>update('authorCompany',v)} placeholder="Acme Corp"/><Input label="CTA Button" value={fields.cta} onChange={v=>update('cta',v)} placeholder="e.g. Read case study"/></>) }

function EventFields({ fields, update }) {
  const upd=(i,k,v)=>{const s=[...(fields.speakers||[])];s[i]={...s[i],[k]:v};update('speakers',s)}
  const add=()=>{if((fields.speakers||[]).length>=6)return;update('speakers',[...(fields.speakers||[]),emptyPerson()])}
  const rem=i=>{const s=[...(fields.speakers||[])];s.splice(i,1);update('speakers',s)}
  const spk=fields.speakers||[]
