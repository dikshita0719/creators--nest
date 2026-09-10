'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginInputSchema, registerInputSchema, type LoginInput, type RegisterInput } from '@creators/types';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { login, register } from '../lib/api';

type Props = { mode: 'login' | 'register' };
export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const schema = mode === 'login' ? loginInputSchema : registerInputSchema;
  const { register: field, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginInput | RegisterInput>({ resolver: zodResolver(schema as any), defaultValues: { role: 'client' } as Partial<RegisterInput> });
  const submit = async (values: any) => { try { const result = mode === 'login' ? await login(values) : await register(values); localStorage.setItem('role', result.user.role); router.push('/dashboard'); } catch (error) { setError('root', { message: error instanceof Error ? error.message : 'Request failed' }); } };
  return <form onSubmit={handleSubmit(submit)}><label>Email<input type="email" {...field('email')} />{errors.email && <span className="error">{String(errors.email.message)}</span>}</label><label>Password<input type="password" {...field('password')} />{errors.password && <span className="error">{String(errors.password.message)}</span>}</label>{mode === 'register' && <><label>Display name<input {...field('displayName')} /></label><label>Role<select {...field('role')}><option value="client">Client</option><option value="creator">Creator</option></select></label></>}{errors.root && <span className="error">{String(errors.root.message)}</span>}<button className="button" disabled={isSubmitting}>{isSubmitting ? 'Working...' : mode === 'login' ? 'Log in' : 'Create account'}</button></form>;
}
