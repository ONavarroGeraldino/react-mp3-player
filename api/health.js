import { list } from '@vercel/blob';

export default async function handler() {
  try {
    const { blobs } = await list();
    return new Response(JSON.stringify({ ok: true, count: blobs.length, hasToken: !!process.env.BLOB_READ_WRITE_TOKEN }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
