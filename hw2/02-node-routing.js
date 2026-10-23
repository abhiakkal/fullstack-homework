const http = require('http');
const port = process.env.PORT || 5001;

// http://localhost:5001/welcome should return a status code 200 with a welcome message of your choice in html format

// http://localhost:5001/redirect should redirect the request to '/redirected' by using 302 as the status code / the redirected page should return a redirected message of your choice

// http://localhost:5001/cache should return 'this resource was cached' in html format and set the cache max age to a day

// http://localhost:5001/cookie should return 'cookies… yummm' in plain text and set 'hello=world' as a cookie

// For other routes, such as http://localhost:5001/other, this exercise should return a status code 404 with '404 - page not found' in html format

const server = http.createServer((req, res) => {
  const routes = [
    'welcome',
    'redirect',
    'redirected',
    'cache',
    'cookie',
    'other',
  ];

  // Ignore any query string so /welcome?name=abhi still matches /welcome
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Node Routing Exercise</h1><ul>');
    routes.forEach((route) => {
      res.write(`<li><a href="/${route}">${route}</a></li>`);
    });
    res.write('</ul>');
    res.end();
  } else if (pathname === '/welcome') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Welcome!</h1><p>Thanks for stopping by the Node routing exercise.</p>');
  } else if (pathname === '/redirect') {
    res.writeHead(302, { Location: '/redirected' });
    res.end();
  } else if (pathname === '/redirected') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>You have been redirected</h1><p>You came from /redirect.</p>');
  } else if (pathname === '/cache') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'max-age=86400',
    });
    res.end('<p>this resource was cached</p>');
  } else if (pathname === '/cookie') {
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Set-Cookie': 'hello=world',
    });
    res.end('cookies… yummm');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 - page not found</h1>');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
