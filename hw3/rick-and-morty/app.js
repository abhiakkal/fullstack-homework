const express = require('express');
const path = require('path');
const {
  getFirstCharacters,
  getAllCharacters,
  getAllLocations,
} = require('./lib/rickAndMorty');
const { summarizeSpecies, summarizeLocationTypes } = require('./lib/summaries');

const app = express();
const port = process.env.PORT || 3001;
const CHARACTER_LIMIT = 100;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Lets the nav bar highlight the current page.
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.get('/', (req, res) => {
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/characters', async (req, res, next) => {
  try {
    const characters = await getFirstCharacters(CHARACTER_LIMIT);
    res.render('characters', { title: 'Characters', characters });
  } catch (error) {
    next(error);
  }
});

app.get('/species', async (req, res, next) => {
  try {
    const characters = await getAllCharacters();
    res.render('species', {
      title: 'Species',
      species: summarizeSpecies(characters),
      totalCharacters: characters.length,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/locations', async (req, res, next) => {
  try {
    const locations = await getAllLocations();
    res.render('locations', {
      title: 'Locations',
      types: summarizeLocationTypes(locations),
      totalLocations: locations.length,
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Not found',
    message: `There is no page at ${req.path}.`,
  });
});

// Express recognizes error handlers by their four arguments, so `next` has to
// stay in the signature even though it is unused.
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error);
  const message = error.status === 429
    ? 'The Rick and Morty API is rate limiting requests right now. Wait a minute and refresh.'
    : 'Could not load data from the Rick and Morty API. Try again in a moment.';
  res.status(502).render('error', { title: 'Something went wrong', message });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
