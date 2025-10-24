
'use client';
import { useState, useTransition } from 'react';
export default function Uploader({ event, labels }:{ event:string; labels:{ upload:string; caption:string; imageFile:string; save:string; } }){
  const [file,setFile]=useState<File|null>(null);
  const [caption,setCaption]=useState('');
  const [pending,startTransition]=useTransition();
  async function handleSubmit(e:React.FormEvent){ e.preventDefault(); if(!file) return;
    const fd=new FormData(); fd.append('file',file); fd.append('caption',caption); fd.append('event',event);
    const res=await fetch('/api/upload',{method:'POST',body:fd}); if(!res.ok){alert('Upload failed');return;}
    setFile(null); setCaption(''); startTransition(()=>window.location.reload());
  }
  return (<form onSubmit={handleSubmit} className="card" style={{display:'grid',gap:12}}>
    <div><label>{labels.caption}</label><input className="input" value={caption} onChange={e=>setCaption(e.target.value)} required maxLength={120}/></div>
    <div><label>{labels.imageFile}</label><input className="input" type="file" accept="image/png,image/jpeg" onChange={e=>setFile(e.target.files?.[0]??null)} required/></div>
    <div><button className="btn" type="submit" disabled={pending}>{labels.upload}</button></div>
    <p className="small">Max ~10MB. PNG/JPG only.</p>
  </form>);
}
