const API_KEY = 'RceRREc2ZfGRXOZMIW9CzqbDe3mcrGLA';
const BASE = 'https://api.giphy.com/v1/gifs';

let cache = null;
let cachePromise = null;

export async function fetchAnimeGifs() {
  if (cache) return cache;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    try {
      const res = await fetch(
        `${BASE}/search?api_key=${API_KEY}&q=anime+cute&limit=50&rating=g&lang=es`
      );
      if (!res.ok) throw new Error('Giphy API failed');
      const data = await res.json();
      if (!data.data || data.data.length === 0) throw new Error('No gifs');

      cache = data.data
        .filter(g => {
          const url = g.images?.fixed_height_small?.url;
          return url && !url.endsWith('.webp');
        })
        .map(g => ({
          id: g.id,
          url: g.images.fixed_height_small.url,
          width: parseInt(g.images.fixed_height_small.width) || 150,
          height: parseInt(g.images.fixed_height_small.height) || 150,
          title: g.title,
        }));

      return cache;
    } catch {
      cache = [];
      return [];
    }
  })();

  return cachePromise;
}

export function getRandomGif(gifs) {
  if (!gifs || gifs.length === 0) return null;
  return gifs[Math.floor(Math.random() * gifs.length)];
}
