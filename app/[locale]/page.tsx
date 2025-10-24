
import Link from 'next/link';
import { t, EVENTS, type Locale } from '@/lib/i18n';

export default async function Page({ params }:{ params:any }){
  const resolved = typeof params?.then === 'function' ? await params : params;
  const rawLocale: Locale = resolved?.locale === 'ko' ? 'ko' : 'en';
  const locale = rawLocale as Locale;
  return (<main style={{display:'grid',gap:16}}>
    <div className="card">
      <h2 style={{marginTop:0}}>{t(locale,'events')}</h2>
      <div className="grid">
        {EVENTS.map(ev=> (<div key={ev.slug} className="card">
          <h3 style={{marginTop:0}}>{t(locale, ev.dictKey)}</h3>
          <Link className="btn" href={`/${locale}/events/${ev.slug}`}>{t(locale,'open')}</Link>
        </div>))}
      </div>
    </div>
  </main>);
}
