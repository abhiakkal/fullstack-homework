const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 5001;

// http://localhost:5001/form should return a form with input elements for username, email, and submit button

// http://localhost:5001/submit should return all the data the user entered

// Parse application/x-www-form-urlencoded bodies sent by the HTML form
app.use(express.urlencoded({ extended: false }));

// User input is echoed back into HTML, so escape it to prevent script injection
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

app.get('/', (req, res) => {
  res.redirect('/form');
});

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.post('/submit', (req, res) => {
  const { username = '', email = '', comments = '' } = req.body;
  // An unchecked checkbox is not sent at all, so its absence means "no"
  const newsletter = req.body.newsletter ? 'Yes' : 'No';

  res.status(200).type('html').send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Form Submission</title>
      </head>
      <body>
        <h1>Thanks for your submission!</h1>
        <ul>
          <li><strong>Username:</strong> ${escapeHtml(username) || 'n/a'}</li>
          <li><strong>Email:</strong> ${escapeHtml(email) || 'n/a'}</li>
          <li><strong>Comments:</strong> ${escapeHtml(comments) || 'n/a'}</li>
          <li><strong>Newsletter:</strong> ${newsletter}</li>
        </ul>
        <a href="/form">Submit another response</a>
      </body>
    </html>
  `);
});

app.use((req, res) => {
  res.status(404).type('html').send('<h1>404 - page not found</h1>');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
