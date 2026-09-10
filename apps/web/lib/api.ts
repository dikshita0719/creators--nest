import type { CreateBookingInput, CreateListingInput, LoginInput, RegisterInput } from '@creators/types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...options, credentials: 'include', headers: { 'Content-Type': 'application/json', ...options.headers } });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.message ?? 'Request failed');
  return response.json();
}
export const register = (body: RegisterInput) => api<{ user: { role: string } }>('/auth/register', { method: 'POST', body: JSON.stringify(body) });
export const login = (body: LoginInput) => api<{ user: { role: string } }>('/auth/login', { method: 'POST', body: JSON.stringify(body) });
export const createBooking = (body: CreateBookingInput) => api('/bookings', { method: 'POST', body: JSON.stringify(body) });
export const createListing = (body: CreateListingInput) => api('/listings', { method: 'POST', body: JSON.stringify(body) });
