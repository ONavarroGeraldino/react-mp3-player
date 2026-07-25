import { put, list, del } from '@vercel/blob';

const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN || '';

export async function uploadFile(file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const pathname = `tracks/${Date.now()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: false,
    token,
  });

  return {
    url: blob.url,
    name: file.name.replace(/\.[^/.]+$/, ''),
    pathname: blob.pathname,
  };
}

export async function savePlaylist(tracks) {
  if (!token) return;
  await put('playlist.json', JSON.stringify({ tracks: tracks.filter(t => !t.local) }), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    token,
  });
}

export async function loadPlaylist() {
  if (!token) return { tracks: [] };
  try {
    const { blobs } = await list({ token, prefix: 'playlist.json' });
    const items = blobs.filter(b => b.pathname === 'playlist.json');
    if (items.length === 0) return { tracks: [] };

    const latest = items.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
    const res = await fetch(latest.url);
    return res.json();
  } catch {
    return { tracks: [] };
  }
}

export async function deleteBlob(url) {
  if (!token) return;
  await del(url, { token });
}
