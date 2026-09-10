import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Framefolk — stories in good company', description: 'A considered marketplace for clients and independent video creators.' };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><div className="shell"><header className="site-header"><Link className="brand" href="/"><span className="brand-mark">✳</span>Framefolk</Link><nav className="nav"><Link href="/listings">Find a creator</Link><Link href="/dashboard">Studio</Link><Link href="/auth/login">Sign in</Link></nav></header>{children}</div></body></html>;
}
