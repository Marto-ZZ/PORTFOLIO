// Prefija la base del sitio (import.meta.env.BASE_URL) a los assets de /public.
// En GitHub Pages el sitio vive en un subdirectorio, así que '/images/x' daría 404.
// Pasá siempre por acá: asset('/images/x').
const BASE = import.meta.env.BASE_URL;

export const asset = (path) => `${BASE}${String(path).replace(/^\//, '')}`;
