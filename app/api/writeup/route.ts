
import { NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';
function key(event:string){ return `events/${event}/writeup.txt`; }
export const runtime = 'edge';
export async function GET(req:Request){
  const event = new URL(req.url).searchParams.get('event');
  if(!event) return NextResponse.json({ error:'Missing event' }, { status:400 });
  const k = key(event);
  const { blobs } = await list({ prefix: k });
  const found = blobs.find(b=>b.pathname===k);
  if(!found) return NextResponse.json({ content: '' });
  const res = await fetch(found.url, { cache:'no-store' });
  if(!res.ok) return NextResponse.json({ content: '' });
  const text = await res.text();
  return NextResponse.json({ content: text });
}
export async function POST(req:Request){
  const { event, content } = await req.json();
  if(!event || typeof content !== 'string') return NextResponse.json({ error:'Missing fields' }, { status:400 });
  const k = key(event);
  const { url, pathname } = await put(k, content, {
    access:'public', addRandomSuffix:false, contentType:'text/plain; charset=utf-8'
  });
  return NextResponse.json({ ok:true, url, pathname });
}
