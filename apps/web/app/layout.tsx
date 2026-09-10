import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Framefolk', description: 'Find a videographer for work worth remembering.' };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="shell"><header className="site-header"><Link className="brand" href="/">Framefolk</Link><nav className="nav"><Link href="/listings">Browse</Link><Link href="/dashboard">Dashboard</Link><Link href="/auth/login">Log in</Link></nav></header>{children}</div>;
}
