import { list } from '@vercel/blob';

export const config = {
  runtime: 'nodejs',
};

export default async function handler() {
  try {
    const { blobs } = await list();
    const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
    return new Response(JSON.stringify({
      ok: true,
      blobCount: blobs.length,
      hasToken,
      blobs: blobs.map(b => b.pathname),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({
      ok: false,
      error: e.message,
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
