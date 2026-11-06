# Homework 3: Express and Templating Engines

| Folder | What it is |
| --- | --- |
| [`react/`](react) | Tutorial: Tic-tac-toe from react.dev |
| [`socketio/`](socketio) | Tutorial: Basic chat application from socket.io |
| [`rick-and-morty/`](rick-and-morty) | Exercise: Rick and Morty API app built with Express + Pug |

Each folder is its own npm project. Run `npm install` inside a folder before starting it.

## React tic-tac-toe

```console
cd hw3/react
npm install
npm run dev     # http://localhost:5173
npm run lint
```

The finished game from the tutorial: alternating X/O turns, winner detection, move history, and time travel.

## Socket.IO chat

```console
cd hw3/socketio
npm install
npm start       # http://localhost:3000
npm run lint
```

Open the page in two tabs. A message sent in one tab shows up in both. The server logs connects, disconnects, and messages.

## Rick and Morty explorer (Express + Pug)

```console
cd hw3/rick-and-morty
npm install
npm start       # http://localhost:3001
npm test
npm run lint
```

| Route | What it shows |
| --- | --- |
| `/home` | Welcome message and links to each page (`/` redirects here) |
| `/characters` | The first 100 characters as cards with picture, name, species, and status |
| `/species` | Every species, how many characters belong to it, and (expandable) their names |
| `/locations` | Number of locations for each location type, plus the total |

## Notes and issues

### Changes from the tutorials

- **React setup:** The tutorial is meant for CodeSandbox, and the downloaded sandbox uses Create React App, which is deprecated. I ran it locally with Vite instead. Because of that, the entry file is `src/index.jsx` instead of `src/index.js`. The component code is the same as the tutorial's final version.
- **Airbnb style in the tutorial code:**
  - Template literals instead of `+` string concatenation (`prefer-template`).
  - `const` and arrow functions in the chat client instead of `var` and `function`.
  - `calculateWinner` uses `Array.prototype.find` instead of an index `for` loop.
  - Buttons have an explicit `type` (`react/button-has-type`).
  - `handlePlay` and `jumpTo` are arrow functions so they can be passed as props (`react/jsx-no-bind`).
  - The move list keeps `key={move}` because the tutorial explains that moves are never reordered. The lint rule is disabled on that one line with a comment explaining why.
- **ESLint config:** `react/prop-types` is turned off because React 19 no longer checks `propTypes`. `react/react-in-jsx-scope` is turned off because the new JSX transform doesn't need `import React`.
- **Socket.IO:** `__dirname + '/index.html'` became `path.join(__dirname, 'index.html')`. The port can also be set with `PORT`.

### Rick and Morty API rate limiting

My first version fetched every page of `/api/character` in parallel (42 requests). The API answered with **HTTP 429 Too Many Requests** and an HTML error page, which broke `response.json()`. To fix it:

1. The API takes a list of ids in one request (`/api/character/1,2,3,...`). The app asks the first page for the total `count`, then gets every record in **one** bulk request. That is 2 requests per route instead of 42.
2. Responses are cached in memory for 10 minutes, so refreshing a page doesn't hit the API again. Failed requests are removed from the cache so the next load retries.
3. If the API still fails, the error handler renders a friendly error page with a 502 status. If the failure was a 429, the page tells the user to wait a minute.

### Incomplete data

The API isn't consistent about missing values. For example, one location has `type: ""`, and two others have `type: "unknown"`. `lib/summaries.js` normalizes empty, missing, and `"unknown"` values into a single `unknown` group, so they aren't counted as separate categories. Characters with no name show as "Unnamed character". These cases are covered in `test/summaries.test.js`.
