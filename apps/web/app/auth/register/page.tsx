import Link from 'next/link';
import { AuthForm } from '../../../components/AuthForm';
export default function RegisterPage() { return <main><span className="eyebrow">Make work memorable</span><h2>Create an account</h2><AuthForm mode="register" /><p className="meta">Already registered? <Link href="/auth/login">Log in.</Link></p></main>; }
