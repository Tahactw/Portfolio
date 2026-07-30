# Swapping in your own files (all optional)

**Everything on the site already works with zero files from you.** Every visual and sound has a
built-in version the site generates for itself. This page lists the few places where a *real*
file would be even better, exactly where to put it, and how to undo it. Each one is independent —
add any, skip any, at any time.

**How to add any file through the GitHub website** (same steps every time):

1. Open your repository on **github.com** and click into the folder listed below
   (click folder names to go deeper — e.g. `public`, then `media`, then `models`).
2. Click **Add file** (top right of the file list) → **Upload files**.
3. Drag your file in. **The file's name must match exactly** what's listed below — rename it on
   your computer first if needed.
4. Click the green **Commit changes** button.
5. Wait about a minute. The site rebuilds itself and starts using your file.

**To undo any of these:** open the file on github.com, click the **trash-can icon** (top right of
the file view), commit. The built-in version returns automatically.

---

## 1. A 3D model on the home page ("The current build")

- **What it is:** an interactive 3D model that appears on the home page in its own section,
  between the big night-town picture and the inventions. Visitors can spin it with a mouse
  finger, or arrow keys.
- **Current version:** none — the section simply doesn't exist until you add the file. Nothing
  looks missing.
- **Exact file path:** `public/media/models/hero.glb`
- **The spec:** GLB format only (that's "binary glTF"). Keep it under **4 MB** (hard stop at
  8 MB). Up to ~40,000 triangles. Textures embedded, no bigger than 1024×1024. If your export
  tool asks: metres, Y-up, origin at the base. Don't worry if you get orientation or size wrong —
  the viewer auto-frames whatever it receives.
- **What "wrong" looks like:** *nothing appears* → filename isn't exactly `hero.glb`, or the file
  isn't really a GLB. *Loads very slowly* → file too big; re-export smaller. *Model looks
  frozen* → it isn't; it idles with a slow turn and moves when dragged.

## 2. 3D models on project pages

- **What it is:** the same kind of interactive model, on any project's page.
- **You don't touch folders for this one** — upload through the **admin panel**: edit the
  project → **3D models** → *Add 3D model*. The admin checks the file for you.
- **The spec:** GLB only, under **2.5 MB** each is ideal (admin refuses over 15 MB and warns over
  8 MB). Across the whole site, try to stay under ~20 MB of models total so phone visitors stay
  happy.

## 3. A display typeface (the big headline letters)

- **What it is:** the typeface used for big headings like your name on the front page.
- **Current version:** Archivo, a solid industrial-flavoured face. Genuinely fine to keep.
- **Exact file path:** `public/fonts/display.woff2` — the name must **start with `display`** and
  end with `.woff2`. For a bold weight add a second file named `display-bold.woff2` (up to 4
  files).
- **The spec:** `.woff2` files only, ideally under 40 KB each. If you downloaded a `.ttf` or
  `.otf`, convert it first (search "ttf to woff2 converter" — cloudconvert.com works).
- **What "wrong" looks like:** *headings didn't change* → the filename doesn't start with
  `display` or isn't `.woff2`. *Headings look thin/odd* → the font may not include the weights
  the site asks for; try a different family.

## 4. The film-grain texture

- **What it is:** the very faint speckle over the big town pictures that makes them feel painted
  rather than computer-drawn.
- **Current version:** generated noise. Honestly hard to beat — this is the last thing worth
  replacing.
- **Exact file path:** `public/media/textures/grain.png`
- **The spec:** a **seamlessly tileable** 512×512 PNG (or WebP renamed to .png won't work — keep
  it a real PNG), under 40 KB, very low contrast. If you can clearly see the pattern, it's too
  strong.
- **What "wrong" looks like:** *visible repeating squares* → the image isn't seamless. *The town
  looks dirty* → too much contrast in the texture.

## 5. Ambient workshop sound

- **What it is:** a quiet background loop (distant hum, night crickets, faint machinery). A small
  **"Sound: off / Sound: on"** button appears at the bottom-right corner of the site — visitors
  choose; it never plays by itself.
- **Current version:** none, on purpose — no file means no button and no sound. The site does
  not fake a sound.
- **Exact file path:** `public/media/audio/ambience.mp3`
- **The spec:** MP3, mono, a 20–40 second loop that ends the way it starts (so the repeat is
  seamless), under 400 KB.
- **What "wrong" looks like:** *an audible click every half minute* → the loop doesn't join
  seamlessly; trim it in a free editor like Audacity. *No button appears* → filename isn't
  exactly `ambience.mp3`.

---

## Where to find good free files

Licences vary per item even on the same site — check each download. "CC0" means free for
anything, no credit needed. "CC-BY" means free but **you must credit the author** (a line in
your About page is fine).

**3D models (GLB):**
- **Kenney.nl** — CC0, stylised low-poly, the closest match to this site's look
- **Quaternius.com** — CC0 low-poly robots and machines
- **Poly.pizza** — searchable, filter to CC0; downloads as GLB
- **Sketchfab.com** — huge; filter licence to CC0/CC-BY and check "downloadable"; pick GLB

**Fonts:** **fonts.google.com** and **fontshare.com** — both free for web use. Download, convert
to woff2 if needed, rename to `display.woff2`.

**Sound:** **freesound.org** (check each licence) and **pixabay.com/sound-effects** (all free).

### About your CAD files

SolidWorks parts, STEP, STL and OBJ files **can't go on the web directly** — browsers don't read
them. The free tool **Blender** (blender.org) opens all of them: open your file, then
*File → Export → glTF 2.0 (.glb)*, and keep the size within the specs above. Your coursework CAD
will make the best project models on this site, so this one conversion skill is worth having.
