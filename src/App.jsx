import { useState, useCallback, useRef, useEffect } from 'react'
import CanvasPreview from './components/CanvasPreview'
import { useExport } from './hooks/useExport'
import { COLORS, DIMENSIONS, BACKGROUNDS, TEMPLATES, PILL_PRESETS, COVER_EMOJIS } from './constants/brand'

const T = { bg:'#FFFFFF', bgPage:'#F3F4F5', bgSurface:'#FFFFFF', bgInput:'#FFFFFF', bgHover:'#F3F4F5', border:'#E5E7E9', borderFocus:'#4E50D1', text:'#051B2C', textSub:'#59626B', textMuted:'#98A1A9', purple:'#4E50D1', purple50:'#F3F3FC', white:'#FFFFFF' }

const emptyPerson = () => ({ name:'', title:'', company:'', photo:'' })

const TEMPLATE_DEFAULTS = {
  headline: { pill:'New Product Feature', headline:'Introducing OneSignal Events', subheadline:'Act on every moment that matters', cta:'Learn more about Events', stat:'', statLabel:'', authorName:'', authorTitle:'', authorCompany:'', showHeadshot:false, headshotUrl:'', eventDate:'', eventLocation:'', speakers:[{name:'',title:'',company:'',photo:''}], emoji:'\uD83C\uDF89' },
  stat:     { pill:'', headline:'', subheadline:'An eye-opening look at what happens when you stop emailing disengaged users', cta:'Read the case study', stat:'+67%', statLabel:'Boost in email opens', authorName:'', authorTitle:'', authorCompany:'', showHeadshot:false, headshotUrl:'', eventDate:'', eventLocation:'', speakers:[{name:'',title:'',company:'',photo:''}], emoji:'\uD83C\uDF89' },
  quote:    { pill:'', headline:'We were able to generate more engagement with the product and were able to attribute some transactional messages to these campaigns, which we consider a huge success.', subheadline:'', cta:'', stat:'', statLabel:'', authorName:'Daria Dovzhikova', authorTitle:'Growth Product Manager', authorCompany:'Bitcoin.com', showHeadshot:false, headshotUrl:'', eventDate:'', eventLocation:'', speakers:[{name:'',title:'',company:'',photo:''}], emoji:'\uD83C\uDF89' },
  event:    { pill:'Webinar', headline:'The 2026 State of Customer Engagement', subheadline:'', cta:'Save your spot now', stat:'', statLabel:'', authorName:'', authorTitle:'', authorCompany:'', showHeadshot:false, headshotUrl:'', eventDate:'Thursday, March 26 @ 9:00AM PDT', eventLocation:'', speakers:[{name:'Baris Girgin',title:'Associate Director UA',company:'Zynga',photo:''},{name:'',title:'',company:'',photo:''}], emoji:'\uD83C\uDF89' },
  newhire:  { pill:'', headline:'Meet our newest members!', subheadline:'', cta:'', stat:'', statLabel:'', authorName:'', authorTitle:'', authorCompany:'', showHeadshot:false, headshotUrl:'', eventDate:'', eventLocation:'', speakers:[{name:'',title:'',company:'',photo:''}], emoji:'\uD83C\uDF89' },
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
        <input type="text" value={fields.pill} onChange={e=>update('pill',e.target.value)} placeholder="e.g. Webinar, New Feature\u2026" onFocus={()=>setPillOpen(true)} onBlur={()=>setTimeout(()=>setPillOpen(false),150)} style={{width:'100%',background:T.bgInput,border:`1px solid ${T.border}`,borderRadius:2,padding:'9px 12px',color:T.text,fontSize:13,fontFamily:"'Nunito Sans', sans-serif",outline:'none',boxSizing:'border-box'}}/>
        {pillOpen && <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:50,background:T.bgSurface,border:`1px solid ${T.border}`,borderRadius:2,marginTop:4,overflow:'hidden',boxShadow:'0 4px 16px rgba(5,27,44,0.08)'}}>
          {PILL_PRESETS.filter(p=>!fields.pill||p.toLowerCase().includes(fields.pill.toLowerCase())).map(p=><div key={p} onMouseDown={()=>update('pill',p)} style={{padding:'9px 12px',fontSize:13,color:T.text,cursor:'pointer',fontFamily:"'Nunito Sans', sans-serif"}} onMouseEnter={e=>e.currentTarget.style.background=T.bgHover} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>{p}</div>)}
        </div>}
      </div>
    </div>
  )
}

function HeadlineFields({ fields, update }) { return (<><CommonFields fields={fields} update={update}/><Input label="Headline *" value={fields.headline} onChange={v=>update('headline',v)} placeholder="Your bold headline"/><Input label="Subheadline" value={fields.subheadline} onChange={v=>update('subheadline',v)} placeholder="Supporting copy" multiline rows={2}/><Input label="CTA Button" value={fields.cta} onChange={v=>update('cta',v)} placeholder="e.g. Learn more"/></>) }
function StatFields({ fields, update }) { return (<><CommonFields fields={fields} update={update}/><Input label="Stat / Number *" value={fields.stat} onChange={v=>update('stat',v)} placeholder="e.g. 2\u00d7, 98%, 10M"/><Input label="Stat Label" value={fields.statLabel} onChange={v=>update('statLabel',v)} placeholder="e.g. faster delivery"/><Input label="Supporting Copy" value={fields.subheadline} onChange={v=>update('subheadline',v)} placeholder="Context for the stat\u2026" multiline rows={3}/><Input label="CTA Button" value={fields.cta} onChange={v=>update('cta',v)} placeholder="e.g. Read the report"/></>) }
function QuoteFields({ fields, update }) { return (<><CommonFields fields={fields} update={update}/><Input label="Quote *" value={fields.headline} onChange={v=>update('headline',v)} placeholder="The quote text goes here\u2026" multiline rows={4}/><Divider/><SectionLabel>Attribution</SectionLabel><Toggle label="Show headshot" checked={fields.showHeadshot} onChange={v=>update('showHeadshot',v)}/>{fields.showHeadshot&&<PhotoUpload label="Headshot" value={fields.headshotUrl} onChange={v=>update('headshotUrl',v)}/>}<Input label="Author Name" value={fields.authorName} onChange={v=>update('authorName',v)} placeholder="Jane Smith"/><Input label="Author Title" value={fields.authorTitle} onChange={v=>update('authorTitle',v)} placeholder="VP of Marketing"/><Input label="Company" value={fields.authorCompany} onChange={v=>update('authorCompany',v)} placeholder="Acme Corp"/><Input label="CTA Button" value={fields.cta} onChange={v=>update('cta',v)} placeholder="e.g. Read case study"/></>) }

function EventFields({ fields, update }) {
  const upd=(i,k,v)=>{const s=[...(fields.speakers||[])];s[i]={...s[i],[k]:v};update('speakers',s)}
  const add=()=>{if((fields.speakers||[]).length>=6)return;update('speakers',[...(fields.speakers||[]),emptyPerson()])}
  const rem=i=>{const s=[...(fields.speakers||[])];s.splice(i,1);update('speakers',s)}
  const spk=fields.speakers||[]
  return (<><CommonFields fields={fields} update={update}/><Input label="Headline *" value={fields.headline} onChange={v=>update('headline',v)} placeholder="Event title"/><Divider/><SectionLabel>Event Details</SectionLabel><Input label="Date & Time" value={fields.eventDate} onChange={v=>update('eventDate',v)} placeholder="March 26 @ 9:00AM PDT"/><Input label="Location" value={fields.eventLocation} onChange={v=>update('eventLocation',v)} placeholder="Virtual / San Francisco, CA"/><Input label="CTA Button" value={fields.cta} onChange={v=>update('cta',v)} placeholder="Save your spot now"/><Divider/><SectionLabel>Speakers</SectionLabel>{spk.map((s,i)=><div key={i} style={{background:T.bgPage,border:`1px solid ${T.border}`,borderRadius:2,padding:12,marginBottom:10}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><span style={{fontSize:12,color:T.textMuted,fontFamily:"'Nunito Sans', sans-serif"}}>Speaker {i+1}</span>{spk.length>1&&<button onClick={()=>rem(i)} style={{background:'none',border:'none',color:T.textMuted,cursor:'pointer',fontSize:16,padding:0}}>\u00d7</button>}</div><PhotoUpload value={s.photo} onChange={v=>upd(i,'photo',v)}/><Input value={s.name} onChange={v=>upd(i,'name',v)} placeholder="Name"/><Input value={s.title} onChange={v=>upd(i,'title',v)} placeholder="Title"/><Input value={s.company} onChange={v=>upd(i,'company',v)} placeholder="Company"/></div>)}{spk.length<6&&<button onClick={add} style={{width:'100%',background:'none',border:`1px dashed ${T.border}`,borderRadius:2,padding:'9px',color:T.textMuted,cursor:'pointer',fontSize:13,fontFamily:"'Nunito Sans', sans-serif"}}>+ Add speaker</button>}</>)
}

function NewHireFields({ fields, update, newHireSlides, setNewHireSlides }) {
  const updP=(si,pi,k,v)=>{const sl=newHireSlides.map((s,i)=>i!==si?s:s.map((p,j)=>j!==pi?p:{...p,[k]:v}));setNewHireSlides(sl)}
  const remP=(si,pi)=>{const sl=newHireSlides.map((s,i)=>i!==si?s:s.filter((_,j)=>j!==pi)).filter(s=>s.length>0);setNewHireSlides(sl)}
  const addP=()=>{const sl=[...newHireSlides];const last=[...sl[sl.length-1]];if(last.length<9){last.push(emptyPerson());sl[sl.length-1]=last}else{sl.push([emptyPerson()])};setNewHireSlides(sl)}
  const total=newHireSlides.flat().filter(p=>p.name).length
  return (<><SectionLabel>Cover Slide</SectionLabel><Input label="Headline" value={fields.headline} onChange={v=>update('headline',v)} placeholder="Meet our newest members!"/><div style={{marginBottom:12}}><div style={{fontSize:12,color:T.textSub,marginBottom:5,fontFamily:"'Nunito Sans', sans-serif"}}>Emoji</div><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{COVER_EMOJIS.map(e=><button key={e} onClick={()=>update('emoji',e)} style={{width:36,height:36,fontSize:20,borderRadius:2,cursor:'pointer',background:fields.emoji===e?T.purple50:'transparent',border:fields.emoji===e?`1px solid ${T.purple}`:`1px solid ${T.border}`}}>{e}</button>)}</div></div><Divider/><SectionLabel>New Hires ({total})</SectionLabel>{newHireSlides.map((slide,si)=><div key={si}>{newHireSlides.length>1&&<div style={{fontSize:11,color:T.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.08em'}}>Grid Slide {si+1}</div>}{slide.map((p,pi)=><div key={pi} style={{background:T.bgPage,border:`1px solid ${T.border}`,borderRadius:2,padding:12,marginBottom:8}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><span style={{fontSize:12,color:T.textMuted,fontFamily:"'Nunito Sans', sans-serif"}}>Person {pi+1}</span><button onClick={()=>remP(si,pi)} style={{background:'none',border:'none',color:T.textMuted,cursor:'pointer',fontSize:16}}>\u00d7</button></div><PhotoUpload value={p.photo} onChange={v=>updP(si,pi,'photo',v)}/><Input value={p.name} onChange={v=>updP(si,pi,'name',v)} placeholder="Full name"/><Input value={p.title} onChange={v=>updP(si,pi,'title',v)} placeholder="Job title"/></div>)}</div>)}{newHireSlides.flat().length<45&&<button onClick={addP} style={{width:'100%',background:'none',border:`1px dashed ${T.border}`,borderRadius:2,padding:'9px',color:T.textMuted,cursor:'pointer',fontSize:13,fontFamily:"'Nunito Sans', sans-serif",marginBottom:8}}>+ Add person</button>}</>)
}

function FieldsPanel({ template, fields, update, newHireSlides, setNewHireSlides }) {
  if (template === 'headline') return <HeadlineFields fields={fields} update={update}/>
  if (template === 'stat')     return <StatFields fields={fields} update={update}/>
  if (template === 'quote')    return <QuoteFields fields={fields} update={update}/>
  if (template === 'event')    return <EventFields fields={fields} update={update}/>
  if (template === 'newhire')  return <NewHireFields fields={fields} update={update} newHireSlides={newHireSlides} setNewHireSlides={setNewHireSlides}/>
  return null
}

export default function App() {
  const [template, setTemplate] = useState('headline')
  const [dimensionId, setDimensionId] = useState('square')
  const [backgroundId, setBackgroundId] = useState('white')
  const [logoAlign, setLogoAlign] = useState('left')
  const [slideIndex, setSlideIndex] = useState(0)
  const [newHireSlides, setNewHireSlides] = useState([[emptyPerson(),emptyPerson(),emptyPerson()]])
  const [exporting, setExporting] = useState(false)
  const [allFields, setAllFields] = useState({ ...TEMPLATE_DEFAULTS })
  const { btnRef, gridRef } = usePixelTrail()

  const fields = allFields[template]
  const update = useCallback((k, v) => {
    setAllFields(prev => ({ ...prev, [template]: { ...prev[template], [k]: v } }))
  }, [template])

  const dimension = DIMENSIONS[dimensionId]
  const allBgs = [...BACKGROUNDS.solids, ...BACKGROUNDS.gradients]
  const background = allBgs.find(b=>b.id===backgroundId)||BACKGROUNDS.solids[4]
  const totalSlides = template==='newhire'?newHireSlides.length+1:1
  const { exportJpg, exportPdf } = useExport({ template, fields, dimension, background, pixelOverlay:false, newHireSlides, isDark: background.isDark })
  const handleExport = async()=>{setExporting(true);try{template==='newhire'?await exportPdf():await exportJpg()}catch(e){console.error(e);alert('Export failed')}finally{setExporting(false)}}
  const handleTemplateSwitch = (id) => { setTemplate(id); setSlideIndex(0) }
  const tmplBtn = (active) => ({ background: active?T.purple50:'transparent', border:`1px solid ${active?T.purple:T.border}`, borderRadius:2, padding:'10px', cursor:'pointer', textAlign:'left', transition:'all 0.15s' })

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden',fontFamily:"'Epilogue', sans-serif",background:T.bgPage}}>
      <div style={{width:252,flexShrink:0,display:'flex',flexDirection:'column',background:T.bgSurface,borderRight:`1px solid ${T.border}`,height:'100vh',overflow:'hidden'}}>
        <div style={{height:44,padding:'0 16px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',flexShrink:0}}>
          <img src="/OneSignal-Studio-Logo.png" height={36} style={{display:"block"}} />
        </div>
        <div className="sidebar-scroll" style={{flex:1,overflowY:'auto',padding:'14px 14px 24px'}}>
          <SectionLabel>Template</SectionLabel>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginBottom:16}}>
            {TEMPLATES.map(t=><button key={t.id} onClick={()=>handleTemplateSwitch(t.id)} style={tmplBtn(template===t.id)}><div style={{fontSize:11,fontWeight:600,color:template===t.id?T.purple:T.textSub,marginBottom:2}}>{t.label}</div><div style={{fontSize:10,color:T.textMuted,fontFamily:"'Nunito Sans', sans-serif",lineHeight:1.3}}>{t.description}</div></button>)}
          </div>
          <Divider/>
          <SectionLabel>Canvas Size</SectionLabel>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4,marginBottom:14}}>
            {Object.values(DIMENSIONS).map(d=><button key={d.id} onClick={()=>setDimensionId(d.id)} style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,padding:'10px 6px',border:`1px solid ${dimensionId===d.id?T.purple:T.border}`,background:dimensionId===d.id?T.purple50:'transparent',borderRadius:2,cursor:'pointer',textAlign:'center',transition:'all 0.15s'}}><span style={{fontSize:12,fontWeight:dimensionId===d.id?600:400,color:dimensionId===d.id?T.purple:T.text,fontFamily:"'Epilogue', sans-serif"}}>{d.sublabel}</span><span style={{fontSize:10,color:dimensionId===d.id?T.purple:T.textMuted,opacity:0.8,fontFamily:"'Nunito Sans', sans-serif"}}>{d.label}</span></button>)}
          </div>
          <Divider/>
          <SectionLabel>Background</SectionLabel>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,color:T.textMuted,marginBottom:6,fontFamily:"'Nunito Sans', sans-serif"}}>Solid</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:4,marginBottom:10}}>
              {BACKGROUNDS.solids.map(bg=>{
                const selected = backgroundId===bg.id
                const isLight = bg.id==='white'||bg.id==='lavender'
                return <button key={bg.id} onClick={()=>setBackgroundId(bg.id)} title={bg.label} style={{aspectRatio:'1',borderRadius:2,cursor:'pointer',...bg.style,border:'none',outline:selected?'1px solid #4E50D1':isLight?'0.5px solid #E5E7E9':'none',outlineOffset:selected?'1px':'0',boxSizing:'border-box'}}/>
              })}
            </div>
            <div style={{fontSize:11,color:T.textMuted,marginBottom:6,fontFamily:"'Nunito Sans', sans-serif"}}>Gradient</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4,marginBottom:10}}>
              {BACKGROUNDS.gradients.map(bg=>{
                const selected = backgroundId===bg.id
                return <button key={bg.id} onClick={()=>setBackgroundId(bg.id)} title={bg.label} style={{aspectRatio:'1',borderRadius:2,cursor:'pointer',...bg.style,border:'none',outline:selected?'1px solid #4E50D1':'none',outlineOffset:selected?'1px':'0',boxSizing:'border-box'}}/>
              })}
            </div>
          </div>
          <Divider/>
          <SectionLabel>Logo Placement</SectionLabel>
          <div style={{display:'flex',gap:4,marginBottom:14}}>
            {['left','center'].map(a=><button key={a} onClick={()=>setLogoAlign(a)} style={{flex:1,padding:'8px',borderRadius:2,border:`1px solid ${logoAlign===a?T.purple:T.border}`,background:logoAlign===a?T.purple50:'transparent',cursor:'pointer',fontSize:12,fontWeight:logoAlign===a?600:400,color:logoAlign===a?T.purple:T.textSub,fontFamily:"'Epilogue', sans-serif",textTransform:'capitalize'}}>{a}</button>)}
          </div>
          <Divider/>
          <FieldsPanel template={template} fields={fields} update={update} newHireSlides={newHireSlides} setNewHireSlides={setNewHireSlides}/>
        </div>
        <div style={{padding:14,borderTop:`1px solid ${T.border}`}}>
          <button
            ref={btnRef}
            onClick={exporting?undefined:handleExport}
            disabled={exporting}
            style={{width:'100%',position:'relative',display:'flex',alignItems:'center',justifyContent:'center',background:exporting?T.border:'#051B2C',color:exporting?T.textMuted:'#fff',border:'none',borderRadius:4,padding:'12px 0',fontSize:14,fontWeight:700,cursor:exporting?'wait':'pointer',fontFamily:"'Epilogue', sans-serif",letterSpacing:'-0.01em',overflow:'hidden',isolation:'isolate'}}
          >
            <div ref={gridRef} style={{position:'absolute',inset:0,display:'grid',gridTemplateColumns:`repeat(${PX_COLS},1fr)`,gridTemplateRows:`repeat(${PX_ROWS},1fr)`,pointerEvents:'none',zIndex:1}}/>
            <span style={{position:'relative',zIndex:2}}>{exporting?'Exporting\u2026':template==='newhire'?'\u2193 Export PDF Carousel':'\u2193 Export JPG'}</span>
          </button>
          <div style={{textAlign:'center',marginTop:6,fontSize:11,color:T.textMuted,fontFamily:"'Nunito Sans', sans-serif"}}>{template==='newhire'?`${totalSlides} slides \u00b7 LinkedIn carousel`:`${dimension.width} \u00d7 ${dimension.height}px \u00b7 JPG`}</div>
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',background:T.bgPage,overflow:'hidden'}}>
        <div style={{height:44,borderBottom:`1px solid ${T.border}`,background:T.bgSurface,display:'flex',alignItems:'center',padding:'0 20px',flexShrink:0}}>
          <div style={{fontSize:12,color:T.textMuted,fontFamily:"'Nunito Sans', sans-serif"}}>
            {TEMPLATES.find(t=>t.id===template)?.label}<span style={{margin:'0 6px',color:T.border}}>\u00b7</span>{dimension.sublabel}<span style={{margin:'0 6px',color:T.border}}>\u00b7</span>{background.label}
          </div>
        </div>
        <CanvasPreview template={template} fields={fields} dimension={dimension} background={background} pixelOverlay={false} logoAlign={logoAlign} slideIndex={slideIndex} newHireSlides={newHireSlides} setSlideIndex={setSlideIndex} totalSlides={totalSlides}/>
      </div>
    </div>
  )
}
