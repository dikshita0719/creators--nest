import type { CreateBookingInput, CreateListingInput, LoginInput, RegisterInput } from '@creators/types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
export function token() { return typeof window === 'undefined' ? undefined : localStorage.getItem('token') ?? undefined; }
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token() ? { Authorization: `Bearer ${token()}` } : {}), ...options.headers } });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.message ?? 'Request failed');
  return response.json();
}
export const register = (body: RegisterInput) => api<{ token: string; user: { role: string } }>('/auth/register', { method: 'POST', body: JSON.stringify(body) });
export const login = (body: LoginInput) => api<{ token: string; user: { role: string } }>('/auth/login', { method: 'POST', body: JSON.stringify(body) });
export const createBooking = (body: CreateBookingInput) => api('/bookings', { method: 'POST', body: JSON.stringify(body) });
export const createListing = (body: CreateListingInput) => api('/listings', { method: 'POST', body: JSON.stringify(body) });
