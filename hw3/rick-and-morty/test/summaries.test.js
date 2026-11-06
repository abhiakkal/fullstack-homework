const test = require('node:test');
const assert = require('node:assert/strict');
const {
  normalizeLabel,
  summarizeSpecies,
  summarizeLocationTypes,
} = require('../lib/summaries');

test('normalizeLabel collapses missing and unknown values', () => {
  assert.equal(normalizeLabel(''), 'unknown');
  assert.equal(normalizeLabel('   '), 'unknown');
  assert.equal(normalizeLabel(undefined), 'unknown');
  assert.equal(normalizeLabel(null), 'unknown');
  assert.equal(normalizeLabel('Unknown'), 'unknown');
  assert.equal(normalizeLabel(' Planet '), 'Planet');
});

test('summarizeSpecies counts and sorts characters by species', () => {
  const result = summarizeSpecies([
    { name: 'Rick', species: 'Human' },
    { name: 'Morty', species: 'Human' },
    { name: 'Birdperson', species: 'Alien' },
    { name: 'Mystery', species: '' },
    { species: 'Alien' },
  ]);

  assert.deepEqual(result, [
    { name: 'Alien', count: 2, names: ['Birdperson', 'Unnamed character'] },
    { name: 'Human', count: 2, names: ['Morty', 'Rick'] },
    { name: 'unknown', count: 1, names: ['Mystery'] },
  ]);
});

test('summarizeLocationTypes merges empty and "unknown" types', () => {
  const result = summarizeLocationTypes([
    { type: 'Planet' },
    { type: 'Planet' },
    { type: '' },
    { type: 'unknown' },
    { type: 'Space station' },
  ]);

  assert.deepEqual(result, [
    { name: 'Planet', count: 2 },
    { name: 'unknown', count: 2 },
    { name: 'Space station', count: 1 },
  ]);
});
