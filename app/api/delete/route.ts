import { NextResponse } from 'next/server';
import { del, list, put } from '@vercel/blob';

export const runtime = 'edge';

function indexKey(event: string) {
  return `events/${event}/index.json`;
}

export async function POST(req: Request) {
  const { event, id, pathname } = await req.json() as {
    event: string; id: string; pathname: string;
  };
  if (!event || !id || !pathname) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // 1) Read current index.json
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

  // 2) Remove the item and write back
  const next = items.filter((i: any) => i.id !== id);
  await put(k, JSON.stringify(next, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json; charset=utf-8'
  });

  // 3) Delete the image blob itself
  await del(pathname);

  return NextResponse.json({ ok: true });
}

