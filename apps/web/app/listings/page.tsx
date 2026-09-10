import Link from 'next/link';
import { API_URL } from '../../lib/api';
export const dynamic = 'force-dynamic';
async function getListings() { const response = await fetch(`${API_URL}/listings`, { cache: 'no-store' }); if (!response.ok) return []; return response.json(); }
export default async function ListingsPage() { const listings = await getListings(); return <main><span className="eyebrow">The directory</span><h2>Find your next collaborator.</h2><div className="grid">{listings.map((listing: any) => <article className="card" key={listing.id}><p className="meta">{listing.creator?.user?.profile?.displayName ?? 'Independent creator'}</p><h3>{listing.title}</h3><p>{listing.description}</p><p className="meta">{listing.currency} {listing.price.toLocaleString()}</p><Link className="button secondary" href={`/listings/${listing.id}`}>View listing</Link></article>)}</div>{listings.length === 0 && <p>No active listings yet. Start the API and seed the database to see the sample.</p>}</main>; }
