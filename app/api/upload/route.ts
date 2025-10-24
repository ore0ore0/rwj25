
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
export const runtime = 'edge';
export async function POST(req:Request){
  const form = await req.formData();
  const file = form.get('file');
  const caption = String(form.get('caption') ?? '').trim();
  const event = String(form.get('event') ?? '').trim();
  if(!(file instanceof File)) return NextResponse.json({ error:'Missing file' }, { status:400 });
  if(!event) return NextResponse.json({ error:'Missing event' }, { status:400 });
  if(!caption) return NextResponse.json({ error:'Missing caption' }, { status:400 });
  const ext = file.type==='image/png'?'png': file.type==='image/jpeg'?'jpg': '';
  if(!ext) return NextResponse.json({ error:'Only PNG/JPG allowed' }, { status:400 });
  const rand = Math.random().toString(36).slice(2,8);
  const key = `events/${event}/images/${Date.now()}-${rand}.${ext}`;
  const { url, pathname } = await put(key, file, { access:'public', addRandomSuffix:false });
  const id = pathname;
  const item = { id, url, pathname, caption };
  // Load existing index
  let items:any[] = [];
  try {
    const r = await fetch(`/api/index?event=${encodeURIComponent(event)}`, { cache:'no-store' });
    if(r.ok){ const d = await r.json(); if(Array.isArray(d.items)) items = d.items; }
  } catch {}
  items.push(item);
  await fetch('/api/index', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ event, items }) });
  return NextResponse.json({ ok:true, item });
}
