
import Link from 'next/link';
import LangSwitch from '@/components/LangSwitch';
import { type Locale, t } from '@/lib/i18n';

export default async function LocaleLayout({ params, children }:{ params:any; children:React.ReactNode }){
  const resolved = typeof params?.then === 'function' ? await params : params;
  const rawLocale: Locale = resolved?.locale === 'ko' ? 'ko' : 'en';
  const locale = rawLocale as Locale;
  return (<div className="container">
    <header className="header">
      <div>
        <Link href={`/${locale}`} style={{ textDecoration: 'none' }}><h1 style={{margin:'0 0 4px 0'}}>{t(locale,'title')}</h1></Link>
        <div className="small">{t(locale,'subtitle')}</div>
      </div>
      <LangSwitch locale={locale}/>
    </header>
    {children}
    <footer style={{marginTop:40,opacity:.7}} className="small">© 2025 Run with Jesus — Deployed on Vercel</footer>
  </div>);
}
