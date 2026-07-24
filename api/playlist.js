import { put, head, del } from '@vercel/blob';

const PLAYLIST_KEY = 'playlist.json';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req) {
  try {
    if (req.method === 'GET') {
      try {
        const blob = await head(PLAYLIST_KEY);
        if (!blob) {
          return new Response(JSON.stringify({ tracks: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const response = await fetch(blob.url);
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch {
        return new Response(JSON.stringify({ tracks: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (req.method === 'POST') {
      const body = await req.json();

      if (!body.tracks || !Array.isArray(body.tracks)) {
        return new Response(JSON.stringify({ error: 'Invalid playlist data' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      await put(PLAYLIST_KEY, JSON.stringify({ tracks: body.tracks }), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
      });

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'DELETE') {
      const body = await req.json();
      if (body.url) {
        await del(body.url);
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Playlist error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
