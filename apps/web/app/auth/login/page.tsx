import Link from 'next/link';
import { AuthForm } from '../../../components/AuthForm';
export default function LoginPage() { return <main><span className="eyebrow">Welcome back</span><h2>Log in</h2><AuthForm mode="login" /><br></br><p className="meta">No account? <Link href="/auth/register">Register here.</Link></p></main>; }
