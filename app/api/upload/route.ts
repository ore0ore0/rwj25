import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

export const runtime = 'edge';

function indexKey(event: string) {
  return `events/${event}/index.json`;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file');
  const caption = String(form.get('caption') ?? '').trim();
  const event = String(form.get('event') ?? '').trim();

  if (!(file instanceof File)) return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  if (!event) return NextResponse.json({ error: 'Missing event' }, { status: 400 });
  if (!caption) return NextResponse.json({ error: 'Missing caption' }, { status: 400 });

  const ext =
    file.type === 'image/png' ? 'png' :
    file.type === 'image/jpeg' ? 'jpg' : '';
  if (!ext) return NextResponse.json({ error: 'Only PNG/JPG allowed' }, { status: 400 });

  // 1) Upload image to Blob
  const rand = Math.random().toString(36).slice(2, 8);
  const key = `events/${event}/images/${Date.now()}-${rand}.${ext}`;
  const { url, pathname } = await put(key, file, { access: 'public', addRandomSuffix: false });
  const item = { id: pathname, url, pathname, caption };

  // 2) Load current index.json (if any) directly from Blob
  const k = indexKey(event);
  const { blobs } = await list({ prefix: k });
  const found = blobs.find(b => b.pathname === k);

  let items: any[] = [];
  if (found) {
    const res = await fetch(found.url, { cache: 'no-store' });
    if (res.ok) {
      try { const json = await res.json(); if (Array.isArray(json)) items = json; } catch {}
    }
  }

  // 3) Update & write back index.json
  items.push(item);
  await put(k, JSON.stringify(items, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json; charset=utf-8'
  });

  return NextResponse.json({ ok: true, item });
}

