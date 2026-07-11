import { useState } from "react";

const C = {
bg:"#0d0f14",surface:"#13161f",card:"#1a1e2a",cardHover:"#1f2436",
border:"#2a2f42",borderGlow:"#c9a84c",gold:"#c9a84c",goldLight:"#e8c96e",
goldSoft:"rgba(201,168,76,0.12)",white:"#f8f6f1",offWhite:"#e8e4da",
muted:"#7a7f96",mutedLight:"#9a9fb6",success:"#4ade80",
successSoft:"rgba(74,222,128,0.1)",teal:"#2dd4bf",tealSoft:"rgba(45,212,191,0.1)",
};

const F = {
display:"'Playfair Display','Didot','Georgia',serif",
heading:"'Oswald','Impact','Arial Narrow',sans-serif",
body:"'DM Sans','Nunito','Helvetica Neue',sans-serif",
mono:"'JetBrains Mono','Fira Code','Courier New',monospace",
};

const gStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Oswald:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#0d0f14;}
::selection{background:#c9a84c;color:#0d0f14;}
::-webkit-scrollbar{width:6px;}
::-webkit-scrollbar-track{background:#13161f;}
::-webkit-scrollbar-thumb{background:#2a2f42;border-radius:3px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(201,168,76,0.3)}50%{box-shadow:0 0 40px rgba(201,168,76,0.6)}}
.fade-up{animation:fadeUp 0.5s ease forwards;}
.fade-up-1{animation:fadeUp 0.5s 0.1s ease both;}
.fade-up-2{animation:fadeUp 0.5s 0.2s ease both;}
.fade-up-3{animation:fadeUp 0.5s 0.3s ease both;}
.card-hover{transition:transform 0.2s ease,box-shadow 0.2s ease;}
.card-hover:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(201,168,76,0.15);}
.copy-btn:hover{background:#c9a84c!important;color:#0d0f14!important;}
`;

const EXAMPLES = [
{label:"Coach / Wellness",text:"She was amazing! I really enjoyed working with her and would definitely recommend her to anyone looking for help. She's great!"},
{label:"Consultant / B2B",text:"John is a great consultant. He helped our team a lot and we saw good results. Very professional and easy to work with."},
{label:"Creative / Freelance",text:"Loved working with her. Super talented and delivered everything on time. Will hire again for sure."},
];

function OutputBlock({label,icon,content,color=C.gold}){
const [copied,setCopied]=useState(false);
const copy=()=>{navigator.clipboard.writeText(content).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});};
return(
<div className="card-hover" style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`3px solid ${color}`,borderRadius:12,padding:"20px 22px",marginBottom:14}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:16}}>{icon}</span>
<span style={{fontFamily:F.heading,fontSize:11,fontWeight:"600",letterSpacing:"0.2em",textTransform:"uppercase",color:color}}>{label}</span>
</div>
<button className="copy-btn" onClick={copy} style={{fontFamily:F.body,fontSize:11,fontWeight:"600",letterSpacing:"0.08em",textTransform:"uppercase",background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"5px 12px",borderRadius:6,cursor:"pointer",transition:"all 0.15s"}}>
{copied?"✓ Copied":"Copy"}
</button>
</div>
<p style={{fontFamily:F.body,fontSize:14,color:C.offWhite,lineHeight:1.75,whiteSpace:"pre-wrap"}}>{content}</p>
</div>
);
}

function StrengthBadge({score}){
const level=score>=80?{label:"Power Testimonial",color:C.success,bg:C.successSoft}:score>=55?{label:"Solid Testimonial",color:C.teal,bg:C.tealSoft}:{label:"Weak Testimonial",color:"#f97316",bg:"rgba(249,115,22,0.1)"};
return(
<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
<div style={{flex:1,height:8,background:C.border,borderRadius:10,overflow:"hidden"}}>
<div style={{height:"100%",width:`${score}%`,background:level.color,borderRadius:10,transition:"width 1s ease"}}/>
</div>
<div style={{fontFamily:F.heading,fontSize:11,fontWeight:"600",letterSpacing:"0.15em",textTransform:"uppercase",color:level.color,background:level.bg,padding:"4px 12px",borderRadius:20,whiteSpace:"nowrap"}}>
{score}/100 · {level.label}
</div>
</div>
);
}

export default function App(){
const [input,setInput]=useState("");
const [name,setName]=useState("");
const [industry,setIndustry]=useState("");
const [loading,setLoading]=useState(false);
const [result,setResult]=useState(null);
const [error,setError]=useState("");
const [activeTab,setActiveTab]=useState(0);

 transform=async()=>{
if(!input.trim()) return;
setLoading(true);setResult(null);setError("");
try{
const safeInput=input.replace(/"/g,"'");
const res=await fetch("/api/transform",{
method:"POST",
headers:{
"Content-Type":"application/json",

},
body:JSON.stringify({
model:"claude-sonnet-4-20250514",
max_tokens:2000,
system:"You are an expert copywriter. Respond with a raw JSON object only. No markdown. No backticks. Start with { and end with }.",
messages:[{role:"user",content:"Transform this testimonial for "+(name||"a service provider")+(industry?" in the "+industry+" industry":"")+" Original: \""+safeInput+"\" Return ONLY raw JSON with keys: score (number 0-100), issue (string), transformed (string 2-4 sentences), social_caption (string with 5 hashtags), website_blurb (string 1-2 sentences), email_snippet (string), key_win (string 5-10 words)."}]
})
});
if(!res.ok) throw new Error("api");
const data=await res.json();const parsed=data;
if(!parsed.transformed||parsed.score===undefined) throw new Error("parse");
setResult(parsed);setActiveTab(0);
}catch(e){
if(e.message==="api"){setError("API connection failed. Check that your VITE_ANTHROPIC_API_KEY is set correctly in your .env file.");}
else if(e.message==="parse"){setError("The AI responded in an unexpected format. Please try again.");}
else{setError("Something went wrong. Please try again in a moment.");}
}
setLoading(false);
};

const tabs=result?[
{label:"Transformed",icon:"✨",content:result.transformed,color:C.gold},
{label:"Social Caption",icon:"📱",content:result.social_caption,color:"#a78bfa"},
{label:"Website Blurb",icon:"🌐",content:result.website_blurb,color:C.teal},
{label:"Email Snippet",icon:"📧",content:result.email_snippet,color:"#fb923c"},
]:[];

return(
<div style={{background:C.bg,minHeight:"100vh",fontFamily:F.body,color:C.white}}>
<style>{gStyles}</style>
<div style={{background:C.surface,borderBottom:`1px solid ${C.border}`}}>
<div style={{maxWidth:860,margin:"0 auto",padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}>
<div style={{display:"flex",alignItems:"center",gap:10}}>
<div style={{width:28,height:28,background:C.gold,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>⚡</div>
<span style={{fontFamily:F.heading,fontSize:13,fontWeight:"700",letterSpacing:"0.15em",textTransform:"uppercase",color:C.gold}}>Testimonial Transformer</span>
</div>
<div style={{fontFamily:F.body,fontSize:11,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>Powered by AI</div>
</div>
<div style={{maxWidth:860,margin:"0 auto",padding:"52px 24px 48px",textAlign:"center"}}>
<div className="fade-up" style={{display:"inline-block",fontFamily:F.heading,fontSize:10,fontWeight:"600",letterSpacing:"0.3em",textTransform:"uppercase",color:C.gold,background:C.goldSoft,border:`1px solid rgba(201,168,76,0.3)`,padding:"5px 16px",borderRadius:20,marginBottom:20}}>Turn Weak Reviews Into Powerful Proof</div>
<h1 className="fade-up-1" style={{fontFamily:F.display,fontSize:48,fontWeight:"900",color:C.white,lineHeight:1.1,marginBottom:16,letterSpacing:"-0.02em"}}>Your testimonials are<br/><span style={{color:C.gold,fontStyle:"italic"}}>leaving money on the table.</span></h1>
<p className="fade-up-2" style={{fontFamily:F.body,fontSize:16,color:C.mutedLight,lineHeight:1.7,maxWidth:520,margin:"0 auto 24px"}}>Paste a generic review and get back a compelling, specific, ready-to-use testimonial plus a social caption, website copy, and email snippet. Instantly.</p>
<div className="fade-up-3" style={{display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap"}}>
{["⚡ 10-second transformation","📱 4 ready-to-use formats","✨ Keeps the authentic voice"].map((f,i)=><div key={i} style={{fontFamily:F.body,fontSize:13,color:C.mutedLight}}>{f}</div>)}
</div>
</div>
</div>

<div style={{maxWidth:860,margin:"0 auto",padding:"40px 24px 80px"}}>
<div className="fade-up" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"32px",marginBottom:28,boxShadow:"0 8px 40px rgba(0,0,0,0.3)"}}>
<div style={{fontFamily:F.heading,fontSize:12,fontWeight:"600",letterSpacing:"0.22em",textTransform:"uppercase",color:C.gold,marginBottom:20}}>Step 1 — Paste Your Testimonial</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
{[{label:"Your Name or Business (optional)",val:name,set:setName,ph:"e.g. Sarah Chen Coaching"},{label:"Industry (optional)",val:industry,set:setIndustry,ph:"e.g. Wellness, Consulting"}].map((f,i)=>(
<div key={i}>
<label style={{fontFamily:F.body,fontSize:11,fontWeight:"600",letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted,display:"block",marginBottom:6}}>{f.label}</label>
<input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 14px",color:C.white,fontFamily:F.body,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
</div>
))}
</div>
<label style={{fontFamily:F.body,fontSize:11,fontWeight:"600",letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted,display:"block",marginBottom:8}}>The Original Testimonial</label>
<textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={'Paste the testimonial here...\n\nExample: "She was amazing! Really enjoyed working with her."'} rows={5} style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",color:C.white,fontFamily:F.body,fontSize:15,lineHeight:1.65,outline:"none",boxSizing:"border-box",resize:"vertical"}}/>
<div style={{marginTop:10,marginBottom:20}}>
<span style={{fontFamily:F.body,fontSize:11,color:C.muted,marginRight:8}}>Try an example:</span>
{EXAMPLES.map((ex,i)=><button key={i} onClick={()=>setInput(ex.text)} style={{fontFamily:F.body,fontSize:11,fontWeight:"600",background:C.goldSoft,border:`1px solid rgba(201,168,76,0.25)`,color:C.gold,padding:"4px 12px",borderRadius:20,cursor:"pointer",marginRight:7,marginTop:6}}>{ex.label}</button>)}
</div>
<button onClick={transform} disabled={loading||!input.trim()} style={{width:"100%",padding:"16px",borderRadius:11,border:"none",cursor:input.trim()?"pointer":"not-allowed",background:input.trim()?`linear-gradient(135deg,${C.gold},${C.goldLight})`:C.border,color:input.trim()?C.bg:C.muted,fontFamily:F.heading,fontSize:16,fontWeight:"700",letterSpacing:"0.12em",textTransform:"uppercase",transition:"all 0.2s"}}>
{loading?"⚡ Transforming...":"⚡ Transform This Testimonial"}
</button>
{loading&&<div style={{marginTop:16}}><div style={{height:3,background:C.border,borderRadius:10,overflow:"hidden"}}><div style={{height:"100%",width:"60%",background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,backgroundSize:"400px 100%",animation:"shimmer 1.2s infinite",borderRadius:10}}/></div><p style={{fontFamily:F.body,fontSize:12,color:C.muted,textAlign:"center",marginTop:10,animation:"pulse 1.5s infinite"}}>Analyzing · Rewriting · Formatting...</p></div>}
{error&&<div style={{marginTop:16,background:"rgba(249,115,22,0.08)",border:"1px solid rgba(249,115,22,0.3)",borderRadius:9,padding:"12px 16px"}}><p style={{fontFamily:F.body,fontSize:13,color:"#fb923c",lineHeight:1.6,fontStyle:"italic"}}>{error}</p></div>}
</div>

{result&&(
<div className="fade-up">
<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"28px 30px",marginBottom:20}}>
<div style={{fontFamily:F.heading,fontSize:11,fontWeight:"600",letterSpacing:"0.22em",textTransform:"uppercase",color:C.muted,marginBottom:14}}>Testimonial Diagnosis</div>
<StrengthBadge score={result.score}/>
<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,padding:"14px 16px",marginBottom:10}}>
<div style={{fontFamily:F.body,fontSize:11,fontWeight:"600",letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted,marginBottom:6}}>Original</div>
<p style={{fontFamily:F.body,fontSize:14,color:C.mutedLight,lineHeight:1.7,fontStyle:"italic"}}>"{input}"</p>
</div>
<div style={{background:"rgba(249,115,22,0.07)",border:"1px solid rgba(249,115,22,0.2)",borderRadius:9,padding:"11px 14px"}}>
<span style={{fontFamily:F.body,fontSize:13,color:"#fb923c"}}>⚠ {result.issue}</span>
</div>
</div>
<div style={{background:`linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.04))`,border:`1px solid rgba(201,168,76,0.3)`,borderRadius:16,padding:"28px 30px",marginBottom:20,textAlign:"center"}}>
<div style={{fontFamily:F.heading,fontSize:10,fontWeight:"600",letterSpacing:"0.3em",textTransform:"uppercase",color:C.gold,marginBottom:12}}>⭐ Pull Quote — Use This Everywhere</div>
<div style={{fontFamily:F.display,fontSize:24,fontWeight:"700",color:C.white,lineHeight:1.3,fontStyle:"italic"}}>"{result.key_win}"</div>
</div>
<div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
{tabs.map((t,i)=><button key={i} onClick={()=>setActiveTab(i)} style={{fontFamily:F.heading,fontSize:11,fontWeight:"600",letterSpacing:"0.12em",textTransform:"uppercase",padding:"8px 16px",borderRadius:8,border:`1px solid ${activeTab===i?t.color:C.border}`,background:activeTab===i?`rgba(201,168,76,0.12)`:"transparent",color:activeTab===i?t.color:C.muted,cursor:"pointer",transition:"all 0.15s"}}>{t.icon} {t.label}</button>)}
</div>
{tabs[activeTab]&&<OutputBlock label={tabs[activeTab].label} icon={tabs[activeTab].icon} content={tabs[activeTab].content} color={tabs[activeTab].color}/>}
<div style={{marginTop:24}}>
<div style={{fontFamily:F.heading,fontSize:11,fontWeight:"600",letterSpacing:"0.22em",textTransform:"uppercase",color:C.muted,marginBottom:16,paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>All 4 Formats — Ready to Use</div>
{tabs.map((t,i)=><OutputBlock key={i} label={t.label} icon={t.icon} content={t.content} color={t.color}/>)}
</div>
<div style={{background:`linear-gradient(135deg,${C.card},${C.surface})`,border:`1px solid ${C.border}`,borderRadius:16,padding:"32px",marginTop:28,textAlign:"center"}}>
<div style={{fontFamily:F.display,fontSize:22,fontWeight:"700",color:C.white,marginBottom:8}}>Ready to transform all your testimonials?</div>
<p style={{fontFamily:F.body,fontSize:14,color:C.mutedLight,marginBottom:20}}>Get unlimited transformations, save your library, and share directly to socials.</p>
<button style={{fontFamily:F.heading,fontSize:14,fontWeight:"700",letterSpacing:"0.12em",textTransform:"uppercase",background:`linear-gradient(135deg,${C.gold},${C.goldLight})`,border:"none",color:C.bg,padding:"14px 36px",borderRadius:10,cursor:"pointer"}}>Start Free — 3 Transformations On Us</button>
</div>
</div>
)}

{!result&&!loading&&(
<div style={{marginTop:8}}>
<div style={{fontFamily:F.heading,fontSize:11,fontWeight:"600",letterSpacing:"0.25em",textTransform:"uppercase",color:C.muted,textAlign:"center",marginBottom:28}}>How It Works</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
{[{icon:"📋",title:"Paste Your Review",desc:"Copy any testimonial — even a one-liner like she was great."},{icon:"⚡",title:"AI Transforms It",desc:"Our AI rewrites it into specific, compelling, benefit-driven proof."},{icon:"🚀",title:"Use It Everywhere",desc:"Get 4 ready-to-use formats — social, website, email, and pull quote."}].map((s,i)=>(
<div key={i} className="card-hover" style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"24px 20px",textAlign:"center"}}>
<div style={{fontSize:28,marginBottom:10}}>{s.icon}</div>
<div style={{fontFamily:F.heading,fontSize:14,fontWeight:"600",color:C.white,letterSpacing:"0.05em",marginBottom:8}}>{s.title}</div>
<p style={{fontFamily:F.body,fontSize:13,color:C.muted,lineHeight:1.6}}>{s.desc}</p>
</div>
))}
</div>
<div style={{marginTop:32,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
{[{quote:"I went from she was nice to a testimonial that closes clients. Game changer.",name:"Marcus T.",role:"Business Coach"},{quote:"My website conversions went up 40% after I updated my testimonials with this tool.",name:"Priya S.",role:"Brand Strategist"},{quote:"I have 50 testimonials sitting in my inbox doing nothing. Not anymore.",name:"Jordan K.",role:"Wellness Practitioner"}].map((t,i)=>(
<div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px"}}>
<p style={{fontFamily:F.body,fontSize:13,color:C.offWhite,lineHeight:1.65,fontStyle:"italic",marginBottom:14}}>"{t.quote}"</p>
<div style={{fontFamily:F.heading,fontSize:11,fontWeight:"600",letterSpacing:"0.08em",color:C.gold}}>{t.name}</div>
<div style={{fontFamily:F.body,fontSize:11,color:C.muted}}>{t.role}</div>
</div>
))}
</div>
</div>
)}
</div>
<div style={{borderTop:`1px solid ${C.border}`,padding:"20px 24px",textAlign:"center"}}>
<span style={{fontFamily:F.body,fontSize:12,color:C.muted}}>Testimonial Transformer · Powered by Claude AI · </span>
<span style={{fontFamily:F.body,fontSize:12,color:C.gold}}>Turn every review into revenue.</span>
</div>
</div>
);
}