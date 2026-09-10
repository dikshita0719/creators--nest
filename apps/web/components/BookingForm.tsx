'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBooking } from '../lib/api';
import { createBookingInputSchema } from '@creators/types';
import { useForm } from 'react-hook-form';
export function BookingForm({ listingId }: { listingId: string }) { const { register, handleSubmit, formState: { isSubmitting, errors }, setError, setValue } = useForm({ resolver: zodResolver(createBookingInputSchema), defaultValues: { listingId, startAt: '', endAt: '' } }); setValue('listingId', listingId); const submit = async (values: any) => { try { await createBooking(values); window.location.href = '/dashboard'; } catch (error) { setError('root', { message: error instanceof Error ? error.message : 'Please log in before booking.' }); } }; return <form onSubmit={handleSubmit(submit)}><label>Start date<input type="datetime-local" {...register('startAt')} /></label><label>End date<input type="datetime-local" {...register('endAt')} /></label>{errors.root && <span className="error">{String(errors.root.message)}</span>}<button className="button" disabled={isSubmitting}>{isSubmitting ? 'Requesting...' : 'Request booking'}</button></form>; }
