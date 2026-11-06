const BASE_URL = 'https://rickandmortyapi.com/api';
const REQUEST_TIMEOUT_MS = 10000;
const CACHE_TTL_MS = 10 * 60 * 1000;

// The API rate limits by IP (HTTP 429), so responses are cached in memory
// for a few minutes instead of hitting the API on every page load.
const cache = new Map();

async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!response.ok) {
    const error = new Error(`Rick and Morty API responded with ${response.status} for ${url}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function cached(key, load) {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) {
    return entry.promise;
  }
  const promise = load();
  cache.set(key, { promise, expires: Date.now() + CACHE_TTL_MS });
  // Don't keep a failed request around, so the next page load retries it.
  promise.catch(() => cache.delete(key));
  return promise;
}

function range(count) {
  return Array.from({ length: count }, (_, i) => i + 1);
}

// The API accepts a comma separated list of ids (e.g. /character/1,2,3) and
// returns them in one array. That is one request instead of one per page.
// A single id returns a bare object rather than an array, so normalize it.
async function fetchByIds(resource, ids) {
  if (ids.length === 0) {
    return [];
  }
  const data = await fetchJson(`${BASE_URL}/${resource}/${ids.join(',')}`);
  return Array.isArray(data) ? data : [data];
}

function getFirstCharacters(count) {
  return cached(`character:first:${count}`, () => fetchByIds('character', range(count)));
}

// Uses the first page only to learn the total count, then fetches every id at once.
function getAll(resource) {
  return cached(`${resource}:all`, async () => {
    const { info } = await fetchJson(`${BASE_URL}/${resource}`);
    return fetchByIds(resource, range(info.count));
  });
}

module.exports = {
  getFirstCharacters,
  getAllCharacters: () => getAll('character'),
  getAllLocations: () => getAll('location'),
};
