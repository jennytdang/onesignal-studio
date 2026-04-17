import { useState, useCallback, useRef, useEffect } from 'react'
import CanvasPreview from './components/CanvasPreview'
import { useExport } from './hooks/useExport'
import { COLORS, DIMENSIONS, BACKGROUNDS, TEMPLATES, PILL_PRESETS, COVER_EMOJIS } from './constants/brand'

const T = { bg:'#FFFFFF', bgPage:'#F3F4F5', bgSurface:'#FFFFFF', bgInput:'#FFFFFF', bgHover:'#F3F4F5', border:'#E5E7E9', borderFocus:'#4E50D1', text:'#051B2C', textSub:'#59626B', textMuted:'#98A1A9', purple:'#4E50D1', purple50:'#F3F3FC', white:'#FFFFFF' }

const emptyPerson = () => ({ name:'', title:'', company:'', photo:'' })

const TEMPLATE_DEFAULTS = {
  headline: { pill:'New Product Feature', headline:'Introducing OneSignal Events', subheadline:'Act on every moment that matters', cta:'Learn more about Events', stat:'', statLabel:'', authorName:'', authorTitle:'', authorCompany:'', showHeadshot:false, headshotUrl:'', eventDate:'', eventLocation:'', speakers:[{name:'',title:'',company:'',photo:''}], emoji:'🎉', quoteBlock:false },
  stat:     { pill:'', headline:'', subheadline:'An eye-opening look at what happens when you stop emailing disengaged users', cta:'Read the case study', stat:'+67%', statLabel:'Boost in email opens', authorName:'', authorTitle:'', authorCompany:'', showHeadshot:false, headshotUrl:'', eventDate:'', eventLocation:'', speakers:[{name:'',title:'',company:'',photo:''}], emoji:'🎉', quoteBlock:false },
  quote:    { pill:'', headline:'We were able to generate more engagement with he product and were able to attribute some transactional messages to these campaigns, which we consider a huge success.', subheadline:'', cta:'', stat:'', statLabel:'', authorName:'George Deglin', authorTitle:'Co-Founder & CEO', authorCompany:'OneSignal', showHeadshot:false, headshotUrl:'', eventDate:'', eventLocation:'', speakers:[{name:'',title:'',company:'',photo:''}], emoji:'🎉', quoteBlock:false },
  event:    { pill:'', headline:'The 2026 State of Customer Engagement', subheadline:'', cta:'Save your spot now', stat:'', statLabel:'', authorName:'', authorTitle:'', authorCompany:'', showHeadshot:false, headshotUrl:'', eventDate:'Thursday, March 26 @ 9:00AM PDT', eventLocation:'', speakers:[{name:'George Deglin',title:'Co-Founder & CEO',company:'OneSignal',photo:''},{name:'',title:'',company:'',photo:''}], emoji:'🎉', quoteBlock:false },
  newhire:  { pill:'', headline:'Meet our newest members!', subheadline:'Welcome to the team! 🎉', cta:'', stat:'', statLabel:'', authorName:'', authorTitle:'', authorCompany:'', showHeadshot:false, headshotUrl:'', eventDate:'', eventLocation:'', speakers:[{name:'',title:'',company:'',photo:''}], emoji:'🎉', quoteBlock:false },
}

const PILL_LIMIT = 30
const CTA_LIMIT  = 40

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

function CharCount({ value, limit }) {
  const n = (value || '').length
  const color = n > limit ? '#A32D2D' : n > limit * 0.8 ? '#BA7517' : T.textMuted
  return <span style={{ fontSize:11, fontFamily:"'SF Mono','Fira Code','Cascadia Code',monospace", color }}>{n} / {limit}</span>
}

function SectionLabel({ children }) {
  return <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:T.textMuted, fontFamily:"'Epilogue', sans-serif", marginBottom:8 }}>{children}</div>
}

function Input({ label, value, onChange, placeholder, multiline, rows=3, limit }) {
  const [focused, setFocused] = useState(false)
  const style = { width:'100%', background:T.bgInput, border:`1px solid ${focused?T.borderFocus:T.border}`, borderRadius:2, padding:'9px 12px', color:T.text, fontSize:13, fontFamily:"'Nunito Sans', sans-serif", outline:'none', resize:multiline?'vertical':'none', lineHeight:1.5, boxSizing:'border-box', transition:'border-color 0.15s' }
  return (
    <div style={{marginBottom:12}}>
      {label && (
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
          <div style={{fontSize:12,color:T.textSub,fontFamily:"'Nunito Sans', sans-serif"}}>{label}</div>
          {limit !== undefined && <CharCount value={value} limit={limit} />}
        </div>
      )}
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
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
        <div style={{fontSize:12,color:T.textSub,fontFamily:"'Nunito Sans', sans-serif"}}>Pre-pill <span style={{color:T.textMuted}}>(optional)</span></div>
        <CharCount value={fields.pill} limit={PILL_LIMIT} />
      </div>
      <div style={{position:'relative'}}>
        <input type="text" value={fields.pill} onChange={e=>update('pill',e.target.value)} placeholder="e.g. Webinar, New Feature…" onFocus={()=>setPillOpen(true)} onBlur={()=>setTimeout(()=>setPillOpen(false),150)} style={{width:'100%',background:T.bgInput,border:`1px solid ${T.border}`,borderRadius:2,padding:'9px 12px',color:T.text,fontSize:13,fontFamily:"'Nunito Sans', sans-serif",outline:'none',boxSizing:'border-box'}}/>
        {pillOpen && <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:50,background:T.bgSurface,border:`1px solid ${T.border}`,borderRadius:2,marginTop:4,overflow:'hidden',boxShadow:'0 4px 16px rgba(5,27,44,0.08)'}}>
          {PILL_PRESETS.filter(p=>!fields.pill||p.toLowerCase().includes(fields.pill.toLowerCase())).map(p=><div key={p} onMouseDown={()=>update('pill',p)} style={{padding:'9px 12px',fontSize:13,color:T.text,cursor:'pointer',fontFamily:"'Nunito Sans', sans-serif"}} onMouseEnter={e=>e.currentTarget.style.background=T.bgHover} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>{p}</div>)}
        </div>}
      </div>
    </div>
  )
}

function HeadlineFields({ fields, update }) { return (<><CommonFields fields={fields} update={update}/><Input label="Headline *" value={fields.headline} onChange={v=>update('headline',v)} placeholder="Your bold headline"/><Input label="Subheadline" value={fields.subheadline} onChange={v=>update('subheadline',v)} placeholder="Supporting copy" multiline rows={2}/><Input label="CTA Button" value={fields.cta} onChange={v=>update('cta',v)} placeholder="e.g. Learn more" limit={CTA_LIMIT}/></>) }
function StatFields({ fields, update }) { return (<><CommonFields fields={fields} update={update}/><Input label="Stat / Number *" value={fields.stat} onChange={v=>update('stat',v)} placeholder="e.g. 2×, 98%, 10M"/><Input label="Stat Label" value={fields.statLabel} onChange={v=>update('statLabel',v)} placeholder="e.g. faster delivery"/><Input label="Supporting Copy" value={fields.subheadline} onChange={v=>update('subheadline',v)} placeholder="Context for the stat…" multiline rows={3}/><Input label="CTA Button" value={fields.cta} onChange={v=>update('cta',v)} placeholder="e.g. Read the report" limit={CTA_LIMIT}/></>) }

function QuoteFields({ fields, update }) {
  return (<>
    <CommonFields fields={fields} update={update}/>
    <Input label="Quote *" value={fields.headline} onChange={v=>update('headline',v)} placeholder="The quote text goes here…" multiline rows={4}/>
    <Divider/>
    <SectionLabel>Quote Options</SectionLabel>
    <Toggle label="Quote block" checked={!!fields.quoteBlock} onChange={v=>update('quoteBlock',v)}/>
    <Divider/>
    <SectionLabel>Attribution</SectionLabel>
    <Toggle label="Show headshot" checked={fields.showHeadshot} onChange={v=>update('showHeadshot',v)}/>
    {fields.showHeadshot&&<PhotoUpload label="Headshot" value={fields.headshotUrl} onChange={v=>update('headshotUrl',v)}/>}
    <Input label="Author Name" value={fields.authorName} onChange={v=>update('authorName',v)} placeholder="Jane Smith"/>
    <Input label="Author Title" value={fields.authorTitle} onChange={v=>update('authorTitle',v)} placeholder="VP of Marketing"/>
    <Input label="Company" value={fields.authorCompany} onChange={v=>update('authorCompany',v)} placeholder="Acme Corp"/>
    
  </>)
}

function EventFields({ fields, update }) {
  const upd=(i,k,v)=>{const s=[...(fields.speakers||[])];s[i]={...s[i],[k]:v};update('speakers',s)}
  const add=()=>{if((fields.speakers||[]).length>=6)return;update('speakers',[...(fields.speakers||[]),emptyPerson()])}
  const rem=i=>{const s=[...(fields.speakers||[])];s.splice(i,1);update('speakers',s)}
  const spk=fields.speakers||[]
  return (<><Input label="Headline *" value={fields.headline} onChange={v=>update('headline',v)} placeholder="Event title"/><Divider/><SectionLabel>Event Details</SectionLabel><Input label="Date & Time" value={fields.eventDate} onChange={v=>update('eventDate',v)} placeholder="March 26 @ 9:00AM PDT"/><Input label="Location" value={fields.eventLocation} onChange={v=>update('eventLocation',v)} placeholder="Virtual / San Francisco, CA"/><Input label="CTA Button" value={fields.cta} onChange={v=>update('cta',v)} placeholder="Save your spot now" limit={CTA_LIMIT}/><Divider/><SectionLabel>Speakers</SectionLabel>{spk.map((s,i)=><div key={i} style={{background:T.bgPage,border:`1px solid ${T.border}`,borderRadius:2,padding:12,marginBottom:10}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><span style={{fontSize:12,color:T.textMuted,fontFamily:"'Nunito Sans', sans-serif"}}>Speaker {i+1}</span>{spk.length>1&&<button onClick={()=>rem(i)} style={{background:'none',border:'none',color:T.textMuted,cursor:'pointer',fontSize:16,padding:0}}>î</button>}</div><PhotoUpload value={s.photo} onChange={v=>upd(i,'photo',v)}/><Input value={s.name} onChange={v=>upd(i,'name',v)} placeholder="Name"/><Input value={s.title} onChange={v=>upd(i,'title',v)} placeholder="Title"/><Input value={s.company} onChange={v=>upd(i,'company',v)} placeholder="Company"/></div>)}{spk.length<6&&<button onClick={add} style={{width:'100%',background:'none',border:`1px dashed ${T.border}`,borderRadius:2,padding:'9px',color:T.textMuted,cursor:'pointer',fontSize:13,fontFamily:"'Nunito Sans', sans-serif"}}>+ Add speaker</button>}</>)
}

function NewHireFields({ fields, update, newHireSlides, setNewHireSlides }) {
  const updP=(si,pi,k,v)=>{const sl=newHireSlides.map((s,i)=>i!==si?s:s.map((p,j)=>j!==pi?p:{...p,[k]:v}));setNewHireSlides(sl)}
  const remP=(si,pi)=>{const sl=newHireSlides.map((s,i)=>i!==si?s:s.filter((_,j)=>j!==pi)).filter(s=>s.length>0);setNewHireSlides(sl)}
  const addP=()=>{const sl=[...newHireSlides];const last=[...sl[sl.length-1]];if(last.length<9){last.push(emptyPerson());sl[sl.length-1]=last}else{sl.push([emptyPerson()])};setNewHireSlides(sl)}
  const total=newHireSlides.flat().filter(p=>p.name).length
  return (<><SectionLabel>Cover Slide</SectionLabel><Input label="Headline" value={fields.headline} onChange={v=>update('headline',v)} placeholder="Meet our newest members!"/><Input label="Subheadline" value={fields.subheadline} onChange={v=>update('subheadline',v)} placeholder="Welcome to the team!"/><Divider/><SectionLabel>New Hires ({total})</SectionLabel>{newHireSlides.map((slide,si)=><div key={si}>{newHireSlides.length>1&&<div style={{fontSize:11,color:T.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.08em'}}>Grid Slide {si+1}</div>}{slide.map((p,pi)=><div key={pi} style={{background:T.bgPage,border:`1px solid ${T.border}`,borderRadius:2,padding:12,marginBottom:8}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><span style={{fontSize:12,color:T.textMuted,fontFamily:"'Nunito Sans', sans-serif"}}>Person {pi+1}</span><button onClick={()=>remP(si,pi)} style={{background:'none',border:'none',color:T.textMuted,cursor:'pointer',fontSize:16}}>î</button></div><PhotoUpload value={p.photo} onChange={v=>updP(si,pi,'photo',v)}/><Input value={p.name} onChange={v=>updP(si,pi,'name',v)} placeholder="Full name"/><Input value={p.title} onChange={v=>updP(si,pi,'title',v)} placeholder="Job title"/></div>)}</div>)}{newHireSlides.flat().length<45&&<button onClick={addP} style={{width:'100%',background:'none',border:`1px dashed ${T.border}`,borderRadius:2,padding:'9px',color:T.textMuted,cursor:'pointer',fontSize:13,fontFamily:"'Nunito Sans', sans-serif",marginBottom:8}}>+ Add person</button>}</>)
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
  const background = allBgs.find(b=>b.id===backgroundId)||BACKGROUNDS.solids[3]
  const totalSlides = template==='newhire'?newHireSlides.length+1:1
  const { exportJpg, exportPdf } = useExport({ template, fields, dimension, background, pixelOverlay:false, newHireSlides, isDark: background.isDark })
  const handleExport = async()=>{setExporting(true);try{template==='newhire'?await exportPdf():await exportJpg()}catch(e){console.error(e);alert('Export failed')}finally{setExporting(false)}}
  const handleTemplateSwitch = (id) => { setTemplate(id); setSlideIndex(0) }
  const tmplBtn = (active) => ({ background: active?T.purple50:'transparent', border:`1px solid ${active?T.purple:T.border}`, borderRadius:2, padding:'10px', cursor:'pointer', textAlign:'left', transition:'all 0.15s' })

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden',fontFamily:"'Epilogue', sans-serif",background:T.bgPage}}>
      <div style={{width:252,flexShrink:0,display:'flex',flexDirection:'column',background:T.bgSurface,borderRight:`1px solid ${T.border}`,height:'100vh',overflow:'hidden'}}>
        <div style={{height:44,padding:'0 16px',borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',flexShrink:0}}>
          <img src="/OneSignal-Studio-Logo.png" height={22} style={{display:'block'}} />
        </div>
        <div className="sidebar-scroll" style={{flex:1,overflowY:'auto',padding:'14px 14px 24px'}}>
          <SectionLabel>Template ({TEMPLATES.length})</SectionLabel>
          <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:4,scrollSnapType:'x mandatory',msOverflowStyle:'none',scrollbarWidth:'none',WebkitOverflowScrolling:'touch',marginBottom:14}}>
            <style>{'div::-webkit-scrollbar{display:none}'}</style>
            {TEMPLATES.map(t=><button key={t.id} onClick={()=>handleTemplateSwitch(t.id)} style={{flexShrink:0,width:88,border:template===t.id?`1px solid ${T.purple}`:`1px solid ${T.border}`,borderRadius:4,overflow:'hidden',cursor:'pointer',padding:0,background:'none',scrollSnapAlign:'start'}}>
              <div style={{width:88,height:88,background:template===t.id?T.purple50:T.bgPage,display:'flex',alignItems:'center',justifyContent:'center'}}>
                {t.thumb ? <img src={t.thumb} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/> : <div style={{width:40,height:40,borderRadius:2,background:T.border}}/>}
              </div>
              <div style={{padding:'5px 4px 6px',fontSize:11,fontWeight:500,color:template===t.id?T.purple:T.text,textAlign:'center',lineHeight:1.25,borderTop:`0.5px solid ${T.border}`,fontFamily:"'Epilogue', sans-serif"}}>{t.label}</div>
            </button>)}
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
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4,marginBottom:10}}>
              {BACKGROUNDS.solids.map(bg=>{
                const selected = backgroundId===bg.id
                const isLight = !bg.isDark
                return <button key={bg.id} onClick={()=>setBackgroundId(bg.id)} title={bg.label} style={{aspectRatio:'1',borderRadius:2,cursor:'pointer',backgroundImage:bg.sources?`url(${bg.sources.square})`:'none',backgroundSize:'cover',backgroundPosition:'center',border:'none',outline:selected?'1px solid #4E50D1':isLight?'0.5px solid #E5E7E9':'none',outlineOffset:selected?'1px':'0',boxSizing:'border-box'}}/>
              })}
            </div>
            <div style={{fontSize:11,color:T.textMuted,marginBottom:6,fontFamily:"'Nunito Sans', sans-serif"}}>Gradient</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4,marginBottom:10}}>
              {BACKGROUNDS.gradients.map(bg=>{
                const selected = backgroundId===bg.id
                return <button key={bg.id} onClick={()=>setBackgroundId(bg.id)} title={bg.label} style={{aspectRatio:'1',borderRadius:2,cursor:'pointer',backgroundImage:bg.sources?`url(${bg.sources.square})`:'none',backgroundSize:'cover',backgroundPosition:'center',border:'none',outline:selected?'1px solid #4E50D1':'none',outlineOffset:selected?'1px':'0',boxSizing:'border-box'}}/>
              })}
            </div>
          </div>
          {template !== 'quote' && template !== 'event' && (<>
            <Divider/>
            <SectionLabel>Placement</SectionLabel>
            <div style={{display:'flex',gap:5,marginBottom:14}}>
              {['left','center'].map(a=><button key={a} onClick={()=>setLogoAlign(a)} style={{flex:1,padding:'7px 0',fontSize:12,fontFamily:"'Nunito Sans',sans-serif",background:logoAlign===a?T.purple50:'transparent',color:logoAlign===a?T.purple:T.textMuted,border:`1px solid ${logoAlign===a?T.purple:T.border}`,borderRadius:2,cursor:'pointer',textTransform:'capitalize',fontWeight:logoAlign===a?600:400}}>{a}</button>)}
            </div>
          </>)}
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
            <span style={{position:'relative',zIndex:2}}>{exporting?'Exporting...':template==='newhire'?'↓ Export PDF Carousel':'↓ Export JPG'}</span>
          </button>
          <div style={{textAlign:'center',marginTop:6,fontSize:11,color:T.textMuted,fontFamily:"'Nunito Sans', sans-serif"}}>{template==='newhire'?`${totalSlides} slides · LinkedIn carousel`:`${dimension.width} × ${dimension.height}px · JPG`}</div>
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',background:T.bgPage,overflow:'hidden'}}>
        <div style={{height:44,borderBottom:`1px solid ${T.border}`,background:T.bgSurface,display:'flex',alignItems:'center',padding:'0 20px',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:10,fontWeight:400,letterSpacing:'0.12em',color:T.textMuted,fontFamily:"'Epilogue', sans-serif",textTransform:'uppercase'}}>Preview</span>
            <span style={{fontSize:11,fontWeight:500,color:'#4E50D1',background:'#F3F3FC',borderRadius:2,padding:'3px 8px',fontFamily:"'SF Mono','Fira Code','Cascadia Code',monospace",letterSpacing:'-0.02em'}}>{dimension.width} × {dimension.height}</span>
            <span style={{fontSize:12,color:T.textSub,fontFamily:"'Nunito Sans', sans-serif"}}>
              {TEMPLATES.find(t=>t.id===template)?.label}
              <span style={{margin:'0 4px',color:T.border}}>·</span>
              {background.label}
            </span>
          </div>
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6}}>
            <div style={{width:1,height:18,background:T.border,marginRight:2}}/>
            <span style={{fontSize:12,color:T.textMuted,fontFamily:"'Nunito Sans', sans-serif",whiteSpace:'nowrap'}}>Need something custom? Our team's got you.</span>
            <a href="mailto:design@onesignal.com" style={{fontSize:12,color:'#4E50D1',fontFamily:"'Nunito Sans', sans-serif",whiteSpace:'nowrap',textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
              Submit a request
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.25 14.523L23.25 0.75" stroke="#4E50D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M23.25 8.621V0.75H15.25" stroke="#4E50D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.125 5.75H1.625C1.39294 5.75 1.17038 5.84219 1.00628 6.00628C0.842187 6.17038 0.75 6.39294 0.75 6.625V22.375C0.75 22.6071 0.842187 22.8296 1.00628 22.9937C1.17038 23.1578 1.39294 23.25 1.625 23.25H17.375C17.6071 23.25 17.8296 23.1578 17.9937 22.9937C18.1578 22.8296 18.25 22.6071 18.25 22.375V11.875" stroke="#4E50D1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </div>
        <CanvasPreview template={template} fields={fields} dimension={dimension} background={background} pixelOverlay={false} logoAlign={template==='quote'||template==='event'||template==='newhire'?'left':logoAlign} slideIndex={slideIndex} newHireSlides={newHireSlides} setSlideIndex={setSlideIndex} totalSlides={totalSlides}/>
      </div>
    </div>
  )
}
