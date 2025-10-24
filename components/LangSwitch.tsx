
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function LangSwitch({ locale }: { locale: 'en' | 'ko' }){
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return null;
  const currentLocale = parts[0] === 'ko' ? 'ko' : 'en';
  const rest = parts.slice(1).join('/');
  const other = currentLocale === 'en' ? 'ko' : 'en';
  const href = `/${other}/${rest}`;
  return (<div className="lang-switch"><span className="tag">{currentLocale.toUpperCase()}</span><Link className="btn" href={href}>{other === 'en' ? 'English' : '한국어'}</Link></div>);
}
