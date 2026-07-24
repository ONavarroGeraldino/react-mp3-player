import { put, list, del } from '@vercel/blob';

const PLAYLIST_KEY = 'playlist.json';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req) {
  try {
    if (req.method === 'GET') {
      try {
        const { blobs } = await list({ prefix: 'playlist.json' });
        const playlists = blobs.filter(b => b.pathname === PLAYLIST_KEY);

        if (playlists.length === 0) {
          return new Response(JSON.stringify({ tracks: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const latest = playlists.sort((a, b) =>
          new Date(b.uploadedAt) - new Date(a.uploadedAt)
        )[0];

        const response = await fetch(latest.url);
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
