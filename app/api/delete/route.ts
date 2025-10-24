
import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
export const runtime = 'edge';
export async function POST(req:Request){
  const { event, id, pathname } = await req.json();
  if(!event || !id || !pathname) return NextResponse.json({ error:'Missing fields' }, { status:400 });
  // Load current index
  let items:any[] = [];
  try {
    const r = await fetch(`/api/index?event=${encodeURIComponent(event)}`, { cache:'no-store' });
    if(r.ok){ const d = await r.json(); if(Array.isArray(d.items)) items = d.items; }
  } catch {}
  const next = items.filter((i:any)=> i.id !== id);
  await fetch('/api/index', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ event, items: next }) });
  await del(pathname);
  return NextResponse.json({ ok:true });
}
