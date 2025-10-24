
import { NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';
function key(event:string){ return `events/${event}/index.json`; }
export const runtime = 'edge';
export async function GET(req:Request){
  const event = new URL(req.url).searchParams.get('event');
  if(!event) return NextResponse.json({ error:'Missing event' }, { status:400 });
  const k = key(event);
  const { blobs } = await list({ prefix: k });
  const found = blobs.find(b=>b.pathname===k);
  if(!found) return NextResponse.json({ items: [] });
  const res = await fetch(found.url, { cache:'no-store' });
  if(!res.ok) return NextResponse.json({ items: [] });
  const items = await res.json();
  return NextResponse.json({ items });
}
export async function POST(req:Request){
  const { event, items } = await req.json();
  if(!event || !Array.isArray(items)) return NextResponse.json({ error:'Missing fields' }, { status:400 });
  const k = key(event);
  const { url, pathname } = await put(k, JSON.stringify(items, null, 2), {
    access:'public', addRandomSuffix:false, contentType:'application/json; charset=utf-8'
  });
  return NextResponse.json({ ok:true, url, pathname });
}
