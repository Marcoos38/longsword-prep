# Longsword Prep

A guided home workout app for longsword conditioning. It runs in your phone's
browser and installs to your home screen like a normal app, working offline.

## What's in here

| File | What it does |
| --- | --- |
| `index.html` | The conditioning page layout |
| `sword.html` | The sword training page layout |
| `style.css` | Colours, fonts, layout, shared by both pages |
| `workouts.js` | **The conditioning exercises and weekly plan.** Edit this to change the home workout. |
| `sword.js` | **The guards, cuts, footwork, and drills.** Edit this to change the sword training. |
| `figures.js` | Every silhouette pose used in the How to sheets, on both pages |
| `app.js` | Timers, screens, and progress tracking, shared by both pages |
| `sw.js` | Offline support |
| `manifest.webmanifest` + the `.png` icons | Tells your phone it's an installable app |

Both pages are part of one app. A small nav bar at the top of each lets you
switch between Conditioning and Sword Training.

## Put it on GitHub Pages (one-time, about 10 minutes)

Easiest on a computer.

1. Make a free account at github.com.
2. Click **+** (top right), then **New repository**.
   Name it `longsword-prep`, set it to **Public**, and click **Create repository**.
   (Free GitHub Pages needs a public repo. Anyone *could* see the code, but
   nobody will find it unless you share the link, and none of your workout
   progress is uploaded. That stays on your phone.)
3. On the new repo page, click **uploading an existing file**.
   Unzip `longsword-prep.zip` and upload **all 14 files inside the folder**
   (not the folder itself). Click **Commit changes**.
4. Go to **Settings**, then **Pages** in the left sidebar.
   Under **Branch**, pick `main` and `/ (root)`, then **Save**.
5. Wait a minute or two, refresh, and your link appears at the top:
   `https://YOUR-USERNAME.github.io/longsword-prep/`

## Install it on your phone

Open that link on your phone, then:

- **iPhone:** in **Safari**, tap Share, then **Add to Home Screen**.
- **Android:** in **Chrome**, tap ⋮, then **Install app** (or **Add to Home screen**).

Open it once while online so it can save itself for offline use.

## Making changes later

1. On GitHub, open the file, click the pencil icon, edit, and **Commit changes**.
2. Open `sw.js` and bump `CACHE_VERSION` (for example `"v1"` to `"v2"`), then commit.
   This tells your phone there's a new version.
3. On your phone, open the app, close it fully, and open it again.
   The update shows on that second launch.

### Editing the sword training content

`sword.js` follows the exact same shape as `workouts.js`: a `LIB`
of moves (name, a YouTube search, steps, tips) and a `DAYS` list of
sessions built from that library. To add a new guard, cut, or drill:

1. Add an entry to `LIB` in `sword.js` with its name and instructions.
2. If you want a silhouette for it, add a matching pose to the `FIG`
   object in `figures.js` (the comment at the top of that file explains
   the angles). Skip this for anything that doesn't need a picture.
3. Add it to a session's `plan` in `sword.js`, or start a new session
   by copying the shape of an existing one.

Whenever you add a new file (rather than just editing an existing one),
add its path to `APP_FILES` in `sw.js` and bump `CACHE_VERSION`.

## Good to know

- Progress ticks are saved on the phone and reset each Monday.
- On iPhone, the home screen app keeps its own storage, separate from Safari.
  Deleting the app from your home screen clears your ticks.
- Keep your phone off silent for the countdown beeps.
