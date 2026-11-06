const UNKNOWN = 'unknown';

// The API is inconsistent about missing data: some records use an empty
// string, some use "unknown", and a field could be missing entirely.
// Collapse all of those into a single "unknown" bucket.
function normalizeLabel(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return UNKNOWN;
  }
  const label = value.trim();
  return label.toLowerCase() === UNKNOWN ? UNKNOWN : label;
}

// Largest groups first; ties are broken alphabetically so the order is stable.
function byCountThenName(a, b) {
  return b.count - a.count || a.name.localeCompare(b.name);
}

function summarizeSpecies(characters) {
  const groups = new Map();
  characters.forEach((character) => {
    const species = normalizeLabel(character.species);
    if (!groups.has(species)) {
      groups.set(species, []);
    }
    groups.get(species).push(character.name || 'Unnamed character');
  });

  return [...groups]
    .map(([name, names]) => ({
      name,
      count: names.length,
      names: [...names].sort((a, b) => a.localeCompare(b)),
    }))
    .sort(byCountThenName);
}

function summarizeLocationTypes(locations) {
  const counts = new Map();
  locations.forEach((location) => {
    const type = normalizeLabel(location.type);
    counts.set(type, (counts.get(type) || 0) + 1);
  });

  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort(byCountThenName);
}

module.exports = { normalizeLabel, summarizeSpecies, summarizeLocationTypes };
