
'use client';
import { useState, useTransition } from 'react';
export type ImageItem={id:string;url:string;pathname:string;caption:string;};
export default function ImageGallery({event,items,labels}:{event:string;items:ImageItem[];labels:{images:string;noImages:string;delete:string;download:string;confirmDelete:string;}}){
  const [selected,setSelected]=useState<ImageItem|null>(null);
  const [pending,startTransition]=useTransition();
  async function handleDelete(item:ImageItem){
    if(!confirm(labels.confirmDelete)) return;
    const res=await fetch('/api/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,id:item.id,pathname:item.pathname})});
    if(!res.ok){alert('Delete failed');return;}
    startTransition(()=>window.location.reload());
  }
  return (<div className="card" style={{display:'grid',gap:12}}>
    <h3 style={{margin:0}}>{labels.images}</h3>
    {items.length===0?<p className="small">{labels.noImages}</p>:
    <div className="grid">{items.map(img=>(
      <div key={img.id} className="card" style={{padding:8}}>
        <img src={img.url} alt={img.caption} style={{width:'100%',height:180,objectFit:'cover',cursor:'pointer'}} onClick={()=>setSelected(img)}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:8}}>
          <div className="small">{img.caption}</div>
          <div style={{display:'flex',gap:8}}>
            <a className="btn" href={img.url} download>{labels.download}</a>
            <button className="btn btn-danger" onClick={()=>handleDelete(img)} disabled={pending}>{labels.delete}</button>
          </div>
        </div>
      </div>
    ))}</div>}
    <div className={`dialog-backdrop ${selected?'show':''}`} onClick={()=>setSelected(null)}>
      {selected&&(<div className="dialog" onClick={e=>e.stopPropagation()}>
        <img src={selected.url} alt={selected.caption} style={{maxWidth:'80vw',maxHeight:'70vh',display:'block',margin:'0 auto'}}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:12}}>
          <div className="small">{selected.caption}</div>
          <div style={{display:'flex',gap:8}}>
            <a className="btn" href={selected.url} download>{labels.download}</a>
            <button className="btn" onClick={()=>setSelected(null)}>Close</button>
          </div>
        </div>
      </div>)}
    </div>
  </div>);
}
