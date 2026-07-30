# Taha Mohammed — Portfolio

This repository is your portfolio website **and** the tool you use to edit it. You never need to
touch code: everything on the site — projects, certificates, experience, education, skills,
testimonials, your bio, your photo, your résumé — is edited from a private admin page in your
browser, on your computer or your phone.

The site starts out filled with **sample content** (three sample projects, sample certificates,
and so on) so it looks finished from the first minute. Replace the samples with your own work at
your own pace, then press one button in the admin panel to remove whatever samples are left.

---

## Getting the site live (one time, about five minutes)

You need a GitHub account and this repository pushed to it. Then:

1. Open your repository on **github.com**.
2. Click the **Settings** tab (top of the repository page, to the right of "Insights").
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment**, find the **Source** dropdown and choose **GitHub Actions**.
5. Click the **Actions** tab (top of the repository page). If you see a message about enabling
   workflows, click **"I understand my workflows, go ahead and enable them"**.
6. Wait for the workflow called **"Deploy to GitHub Pages"** to show a green check mark
   (roughly one minute). If nothing is running, make a small push or open the workflow and click
   **Run workflow**.

Your site is now live at:

```
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY-NAME/
```

(If the repository is named `YOUR-USERNAME.github.io`, the address is just
`https://YOUR-USERNAME.github.io/`.)

Nothing else needs configuring — the site works out which repository it lives in by itself.

---

## Signing in to the admin panel

The admin panel lives at **`/admin`** on your live site — for example
`https://your-username.github.io/Portfolio/admin`.

It asks for a **GitHub access token**, which is like a limited-purpose password that can only
edit this one repository. **[SETUP.md](SETUP.md) walks you through creating one, step by step,
with every button named.** The short version: GitHub Settings → Developer settings →
Fine-grained tokens → new token that can read & write the *contents* of this repository only.

Tick **"Stay signed in on this device"** only on your own computer or phone.

### Is it safe that /admin is public?

Yes, and it's worth understanding why. The admin page is just a form. Anyone can *look* at it,
but it can't change anything without a valid token — and only you have one. The token is stored
only in your browser, is only ever sent to GitHub's own API (`api.github.com`), and never
appears in this repository, the site, or anywhere else. Signing out wipes it from the browser.

---

## Everyday editing

- **Add a project** — Admin → Projects → *Add project*. Fill in the form; required fields are
  marked and explained. The **Case study** box is the long write-up (use `##` for headings and
  `-` for bullet lists — the *Preview text* button shows exactly how it will look). Use
  **Preview** (top right) to see the whole page before saving.
- **Photos** — just upload them; they are automatically straightened, resized and compressed
  before they reach the repository. You can also take a photo directly on your phone.
- **3D models** — the site displays `.glb` files. SolidWorks/STEP/STL files must be converted
  first (free options: Blender, or the gltf.report website). The upload window explains limits.
- **Drafts** — anything with *Published* unticked is invisible on the public site. Work on
  drafts as long as you like.
- **Reordering** — Projects and Skills have ↑ / ↓ buttons in their list views; the site follows
  that order.
- **Featured** — projects and certificates marked *Featured* appear on the home page. The first
  three featured projects are also linked from the numbered balloons in the hero drawing.
- **Your details** — name, headline, bio, photo, résumé PDF, email, social links, and project
  categories all live under **Profile & site settings**.

After every save you'll see: *"Saved. Your site updates in about a minute."* That's real — the
site rebuilds itself after each change. The **Watch the update** link shows the progress.

### The contact form

Out of the box, the contact page shows your email address with a "send email" button — no setup
needed. If you'd rather have a real form (visitors type a message on the site itself):

1. Create a free account at **formspree.io** and add a new form.
2. Copy the form's URL (it looks like `https://formspree.io/f/abcdwxyz`).
3. Paste it into **Profile & site settings → Formspree endpoint** and save.

Delete the value to go back to the email button.

---

## When something looks wrong

| Problem | Fix |
|---|---|
| **"GitHub did not accept that token"** when signing in | The token expired or was mistyped. Create a fresh one — [SETUP.md](SETUP.md) covers renewal in two minutes. |
| **A save "succeeded" but the site didn't change** | Open the repository's **Actions** tab. A red ✗ means a build failed — click it, then click **Re-run all jobs**. If it stays red, the run's log says which file it didn't like. |
| **An image looks broken on the site** | Open Admin → the item it belongs to. Re-choose the image (Replace…) and save. The **Media library** shows everything uploaded and flags files nothing uses. |
| **"The token cannot see the repository"** | The token wasn't given access to this specific repository. SETUP.md step 5 — "Only select repositories" — is the one to redo. |
| **You edited on two devices and got a conflict warning** | The panel offers to load the newest version and re-apply your change. Accept, glance over the result, save again. |

Every save is a Git commit, so **nothing is ever truly lost** — the repository's history
(Code tab → the "commits" link) keeps every previous version of everything.

---

## Changing how the site looks

The design is deliberately opinionated, and everything content-related is editable in the admin.
Two visual things are *not* in the admin, by design:

- **Dark / light theme** — visitors choose this themselves with the toggle in the header; the
  site follows their device preference on first visit. There is nothing to configure.
- **The amber accent colour** — this is the one visual setting that lives in a file. If you ever
  want to change it: on github.com press `.` (or edit directly in the web editor), open
  `src/styles/tokens.css`, and change the two `--c-accent` values (one in the dark block, one in
  the light block) to another colour code. Commit the change and the site rebuilds. If that
  sounds like more trouble than it's worth, leave it — it was chosen to work with everything
  else on the site.

---

## For a developer (if one ever joins)

Astro 5 static site + a React admin island. Content is JSON in `src/content/`, validated at
build. Media in `public/media/`. The admin edits both through the GitHub Contents API; every
save triggers `.github/workflows/deploy.yml`, which builds to `dist/` and deploys to Pages.
Base path and repo coordinates derive from `GITHUB_REPOSITORY` at build time — a custom domain
is one `CUSTOM_DOMAIN` env var in the workflow. `npm ci && npm run build` reproduces the site
locally; `npm run dev` for a dev server; `npx astro check` type-checks.
