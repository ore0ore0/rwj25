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

export default async function EventPage({ params }: { params: any }) {
  const resolved = typeof params?.then === 'function' ? await params : params;
  const rawLocale: Locale = resolved?.locale === 'ko' ? 'ko' : 'en';
  const locale = rawLocale as Locale;
  const slug = String(resolved?.slug || '');
  if (!isValidSlug(slug)) return notFound();

  const images = await readIndexFromBlob(slug);
  const sorted: ImageItem[] = [...images].sort((a, b) => a.caption.localeCompare(b.caption));

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
      <section className="grid" style={{ gridTemplateColumns: '1fr' }}>
        <div>
          <Uploader event={slug} labels={uploaderLabels} />
          <div style={{ height: 12 }} />
          <ImageGallery event={slug} items={sorted} labels={labels} />
        </div>
      </section>
    </main>
  );
}

