# Helfi

A two-player synced "script" app to help communicate: The Helfee creates a session and gets a
code, the Helfi joins with that code, and each side sees their own step
text. A step only advances once **both** players mark it done.

## Run it

```
npm install
npm run dev
```

To run in dev mode.

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
