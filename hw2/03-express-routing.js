const express = require('express');
const app = express();
const port = process.env.PORT || 5001;

// http://localhost:5001/welcome should return a status code 200 with a welcome message of your choice in html format

// http://localhost:5001/redirect should redirect the request to '/redirected' by using 302 as the status code / the redirected page should return a redirected message of your choice

// http://localhost:5001/cache should return 'this resource was cached' in html format and set the cache max age to a day

// http://localhost:5001/cookie should return 'cookies… yummm' in plain text and set 'hello=world' as a cookie

// For other routes, such as http://localhost:5001/other, this exercise should return a status code 404 with '404 - page not found' in html format

const routes = [
  'welcome',
  'redirect',
  'redirected',
  'cache',
  'cookie',
  'other',
];

app.get('/', (req, res) => {
  const links = routes
    .map((route) => `<li><a href="/${route}">${route}</a></li>`)
    .join('');
  res.status(200);
  res.set({ 'Content-Type': 'text/html' });
  res.send(`<h1>Express Routing Exercise</h1><ul>${links}</ul>`);
});

app.get('/welcome', (req, res) => {
  res
    .status(200)
    .type('html')
    .send('<h1>Welcome!</h1><p>Thanks for stopping by the Express routing exercise.</p>');
});

app.get('/redirect', (req, res) => {
  res.redirect(302, '/redirected');
});

app.get('/redirected', (req, res) => {
  res
    .status(200)
    .type('html')
    .send('<h1>You have been redirected</h1><p>You came from /redirect.</p>');
});

app.get('/cache', (req, res) => {
  res.set('Cache-Control', 'max-age=86400');
  res.status(200).type('html').send('<p>this resource was cached</p>');
});

app.get('/cookie', (req, res) => {
  res.cookie('hello', 'world');
  res.status(200).type('text').send('cookies… yummm');
});

// Catch all for any route not matched above. This must stay after every other route.
app.use((req, res) => {
  res.status(404).type('html').send('<h1>404 - page not found</h1>');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
