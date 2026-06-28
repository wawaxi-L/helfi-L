# Two-Player Script App

A two-player synced "script" app: Player 2 creates a session and gets a
code, Player 1 joins with that code, and each side sees their own step
text. A step only advances once **both** players mark it done.

## Run it

```
npm install
npm run dev
```

Open `http://localhost:3000` in two browser windows (or two devices on
the same network, using your machine's LAN IP instead of `localhost`).
In one window click "Create session" (you become Player 2 and see a
code); in the other, enter that code under "Join a session" (you
become Player 1).

`npm run build && npm start` builds and runs in production mode.

## Run it with Docker

```
docker compose up --build
```

or without compose:

```
docker build -t two-player-script-app .
docker run -p 3000:3000 two-player-script-app
```

Either way, open `http://localhost:3000`. The image runs `npm run
build` then `node server.js` (production mode — no `--dev` flag), so
the dev-only preview toggle is hidden and the play-cooldown cookie is
active, same as `npm start` outside Docker.

Since session state is an in-memory `Map` (see "Known v1
limitations" below), restarting the container — `docker compose
restart`, a redeploy, autoscaling to a second replica — clears all
active sessions; in-progress games will need to start over. The
24-hour play-cooldown cookie lives in the player's browser, not the
server, so it's unaffected by container restarts. Fine for a
single-instance deployment; move the session store to Redis first if
you need to survive restarts or scale to multiple containers.

## Custom role names

By default the UI calls the two roles "Player 1"/"Player 2" (or
"Spieler 1"/"Spieler 2" in German). To use different names — e.g. for
a mentor/mentee exercise — add a `# Roles` section at the top of a
language's content file:

```markdown
# Roles

## Player 1

Mentee

## Player 2

Mentor

# Step
...
```

This is per-language: `content/de.script.md` can define its own names
independently of `content/en.script.md` or `content/es.script.md` (or
not define any, and fall back to the default). See
`content/de.script.md` or `content/es.script.md` for real examples.

## How it's structured

- `server.js` — custom Node server that runs Next.js and Socket.IO on
  the same HTTP server/port.
- `lib/sessionStore.js` — all session state, currently an in-memory
  `Map`. Every other module only calls its exported functions
  (`createSession`, `joinSession`, `markDone`, etc.), so swapping the
  backing store for Redis/Postgres later means rewriting just this
  file.
- `content/en.script.md`, `content/de.script.md`,
  `content/es.script.md` — the actual script content, one markdown
  file per language. An optional `# Roles` section at the top lets
  you rename "Player 1"/"Player 2" for that language only (see
  below); then each step is an H1 (any text — `# Step`, `# Schritt`,
  `# Paso`, ...). Within both, `## Player 1` and `## Player 2` (kept
  as literal English headings in every language file — they're
  authoring syntax, not shown to players) mark whose markdown body
  follows. Bold, lists, links, etc. all work, since the body text is
  rendered as markdown client-side. To add a step, add a new
  `# Step` section to **all three** files in the same position — the
  app warns (and shows a placeholder) if the step counts don't match.
- `lib/parseScriptMarkdown.js` — turns one of those files into
  `{ roles: { player1, player2 }, steps: [{ player1, player2 }, ...] }`.
- `lib/script.js` — loads each language file via the parser and zips
  them into the shape the rest of the app relies on: `{ steps: [{
  player1: { en, de, es }, player2: { en, de, es } }, ...], roleNames:
  { en: { player1, player2 }, de: {...}, es: {...} } }`. A `null` role
  name means that language didn't define a `# Roles` section, so the
  UI falls back to the default "Player 1"/"Player 2" label. To add a
  language: add `content/<lang>.script.md`, list it in `LANGUAGES`
  here (and in `lib/about.js`, `lib/home.js`), and add a matching
  dictionary in `lib/i18n.js`.
- `lib/i18n.js` — UI copy (buttons, labels, errors) for `en`/`de`/`es`,
  plus the `translate(lang, key, vars)` helper. Add a language by
  adding a key to `SUPPORTED_LANGUAGES` and a matching dictionary
  here, and to each step in `lib/script.js`.
- `lib/contexts.js` — the `SocketContext` and `I18nContext` React
  contexts, set up in `pages/_app.js`.
- `components/LanguageSwitcher.js` — the EN/DE/ES toggle shown
  top-right on both pages. Selected language is remembered in
  `localStorage`, same pattern as the session role.
- `lib/socketServer.js` — Socket.IO event handlers
  (`create-session`, `join-session`, `rejoin-session`, `mark-done`,
  `disconnect`), thin wrappers around `sessionStore`.
- `pages/index.js` — home page: create or join, with an "About" link.
  `content/en.home.md` / `content/de.home.md` / `content/es.home.md`
  (via `lib/home.js`, same pattern as the About page) fill the
  plain-text box right below the heading — edit those files directly
  for the intro text.
- `lib/playCooldown.js` — sets a `helfi_last_played` cookie (24h
  `max-age`) on `pages/index.js`, but only when someone **creates** a
  session (becomes Player 2 / "Helfi", the helper role) — joining as
  Player 1 never sets it, since the cooldown is meant to stop the
  helper from helping too often, not to gate the person asking for
  help. While active, the home page shows a "come back in ~Nh"
  message in place of the create panel only; the join panel stays
  available. Only runs when `process.env.NODE_ENV === 'production'`
  — `npm run dev` never sets or checks the cookie, so it won't block
  you while testing. To change the cooldown length, edit
  `COOLDOWN_SECONDS` in that file.
- `pages/session/[code].js` — the live session view: step text, done
  button, connection/done status for both players.
- `content/en.about.md`, `content/de.about.md`, `content/es.about.md`
  / `lib/about.js` / `pages/about.js` — a static About page at
  `/about`. Edit the markdown files directly (no code change needed);
  `lib/about.js` just reads them and `pages/about.js` renders the one
  matching the current language via `getStaticProps`. Note: any file
  read this way must resolve paths from `process.cwd()`, not
  `__dirname` — Next's bundler virtualizes `__dirname` for code that
  ends up in a page bundle, which breaks plain
  `fs.readFileSync(__dirname + ...)`.
- `components/PreviewToggle.js` — the top-right "preview other view"
  button. This is a **dev-only convenience** so one person can see
  both players' text while building/testing; it never changes which
  role your actions apply to. `pages/session/[code].js` only renders
  it when `process.env.NODE_ENV !== 'production'`, so it's already
  gone in `npm run build && npm start` — nothing to do for production.

## Known v1 limitations (by design, to keep this simple)

- **State is in-memory.** Restarting the server clears all sessions.
  Fine for local dev/demo; not for production.
- **No auth.** Anyone with a session code can join as Player 1.
  Session codes are short (5 chars) and meant to be shared directly
  with your partner, not posted publicly.
- **Single Next.js process.** Because state lives in that process's
  memory, you can't run multiple server instances/replicas behind a
  load balancer without sessions becoming inconsistent.

## Path to a "production" version

1. **Persist session state.** Replace the `Map` in
   `lib/sessionStore.js` with Redis (good fit — sessions are
   short-lived, key/value, and Redis pub/sub also helps if you
   later run multiple server instances) or a small Postgres table if
   you want durability/history.
2. **Add real auth if needed.** Right now "auth" is just possessing
   the session code. If you need persistent accounts, add a login
   step before create/join and store user IDs on the session instead
   of raw socket IDs.
3. **Harden reconnection.** `rejoin-session` currently trusts
   whatever `{code, role}` is in `localStorage`. That's fine for a
   casual two-friends app; for anything stricter, issue a signed
   per-player token when they join and validate it on rejoin.
4. **Deployment target.** This app needs a long-running Node process
   (for the in-memory store and persistent WebSocket connections), so
   plain Vercel serverless functions won't work as-is. Deploy to
   Railway, Render, Fly.io, a VPS, or a Docker container — anywhere
   that runs `npm start` as a persistent process. If you move state to
   Redis, you can also run multiple instances behind a load balancer
   (with sticky sessions or a Socket.IO Redis adapter).
5. **Expand the script model** if you need richer steps (images,
   timers, branching) beyond markdown text — the parser and loader
   in `lib/parseScriptMarkdown.js` / `lib/script.js` are intentionally
   minimal right now.
