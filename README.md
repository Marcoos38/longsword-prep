# Longsword Prep

A home and gym training app for German longsword, built as one web page that
installs to your phone and works offline.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole app: workouts, sword sessions, progress, body stats, food, photos, settings |
| `sw.js` | Offline support. Bump `CACHE_VERSION` every time you change anything |
| `manifest.webmanifest` + the `.png` icons | Make it installable with its own icon |

Older versions of this repo had `sword.html`, `style.css`, `app.js`,
`workouts.js`, `sword.js` and `figures.js`. They're no longer used, so you can
delete them, or leave them, nothing links to them.

## Updating

1. On GitHub, **Add file**, then **Upload files**, and select every file from
   the new zip. Files with the same names get replaced automatically.
2. **Commit changes**.
3. On your phone, open the app, close it fully, then open it again.

## Your data

Everything is stored on the phone: progress, weights, body stats, food, and
photos. Use **Settings, Your data, Download backup** now and then. Photos
aren't included in backups, so they only live on the phone.
