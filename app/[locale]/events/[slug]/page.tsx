import { notFound } from 'next/navigation';
import Uploader from '@/components/Uploader';
import ImageGallery, { type ImageItem } from '@/components/ImageGallery';
import { EVENTS, t, type Locale } from '@/lib/i18n';
import { list } from '@vercel/blob';

export const dynamic = 'force-dynamic';

function isValidSlug(slug: string) {
  return EVENTS.some(e => e.slug === slug);
}

async function readIndexFromBlob(event: string): Promise<ImageItem[]> {
  const k = `events/${event}/index.json`;
  const { blobs } = await list({ prefix: k });
  const found = blobs.find(b => b.pathname === k);
  if (!found) return [];
  const res = await fetch(found.url, { cache: 'no-store' });
  if (!res.ok) return [];
  try {
    const json = await res.json();
    return Array.isArray(json) ? (json as ImageItem[]) : [];
  } catch {
    return [];
  }
}

async function readWriteupFromBlob(event: string): Promise<string> {
  const k = `events/${event}/writeup.txt`;
  const { blobs } = await list({ prefix: k });
  const found = blobs.find(b => b.pathname === k);
  if (!found) return '';
  const res = await fetch(found.url, { cache: 'no-store' });
  if (!res.ok) return '';
  return await res.text();
}

export default async function EventPage({ params }: { params: any }) {
  const resolved = typeof params?.then === 'function' ? await params : params;
  const rawLocale: Locale = resolved?.locale === 'ko' ? 'ko' : 'en';
  const locale = rawLocale as Locale;
  const slug = String(resolved?.slug || '');
  if (!isValidSlug(slug)) return notFound();

  const images = await readIndexFromBlob(slug);
  const sorted: ImageItem[] = [...images].sort((a, b) => a.caption.localeCompare(b.caption));
  const writeup = await readWriteupFromBlob(slug);

  async function saveWriteup(formData: FormData) {
    'use server';
    const content = String(formData.get('content') ?? '');
    await fetch('/api/writeup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: slug, content })
    });
  }

  const labels = {
    images: t(locale, 'images'),
    noImages: t(locale, 'noImages'),
    delete: t(locale, 'delete'),
    download: t(locale, 'download'),
    confirmDelete: t(locale, 'confirmDelete'),
  };
  const uploaderLabels = {
    upload: t(locale, 'upload'),
    caption: t(locale, 'caption'),
    imageFile: t(locale, 'imageFile'),
    save: t(locale, 'save'),
  };

  return (
    <main style={{ display: 'grid', gap: 16 }}>
      <a href={`/${locale}`} className="btn">← {t(locale, 'back')}</a>
      <div className="grid" style={{ gridTemplateColumns: '1.2fr .8fr' }}>
        <section>
          <Uploader event={slug} labels={uploaderLabels} />
          <div style={{ height: 12 }} />
          <ImageGallery event={slug} items={sorted} labels={labels} />
        </section>

        <aside className="card">
          <h3 style={{ marginTop: 0 }}>{t(locale, 'writeup')}</h3>
          <form action={saveWriteup} style={{ display: 'grid', gap: 12 }}>
            <textarea name="content" rows={14} className="input" placeholder={t(locale, 'writeupPlaceholder')} defaultValue={writeup} />
            <button className="btn" type="submit">{t(locale, 'updateWriteup')}</button>
          </form>
        </aside>
      </div>
    </main>
  );
}

