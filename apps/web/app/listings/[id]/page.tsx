import Link from 'next/link';
import { API_URL } from '../../../lib/api';
import { BookingForm } from '../../../components/BookingForm';
export const dynamic = 'force-dynamic';
async function getListing(id: string) { const response = await fetch(`${API_URL}/listings/${id}`, { cache: 'no-store' }); if (!response.ok) return null; return response.json(); }
export default async function ListingDetail({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const listing = await getListing(id); if (!listing) return <main><h2>Listing not found</h2><Link href="/listings">Back to listings</Link></main>; return <main><span className="eyebrow">A closer look</span><h2>{listing.title}</h2><p className="lede">{listing.description}</p><p className="meta">By {listing.creator?.user?.profile?.displayName ?? 'Independent creator'} · {listing.currency} {listing.price.toLocaleString()}</p><div className="card" style={{ marginTop: 28 }}><h3>Request this booking</h3><p className="meta">You will be asked to log in if you are not already authenticated.</p><BookingForm listingId={listing.id} /></div></main>; }
