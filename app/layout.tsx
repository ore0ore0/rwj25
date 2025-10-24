
import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title:'Run with Jesus 2025', description:'Run crew gallery and write-ups' };
export default function RootLayout({ children }:{ children:React.ReactNode }){
  return (<html lang="en"><body>{children}</body></html>);
}
