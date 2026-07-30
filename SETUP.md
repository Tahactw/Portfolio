# Creating your admin token

The admin panel signs in with a **fine-grained personal access token** — a limited key that can
edit *only this repository* and nothing else about your GitHub account. Creating one takes about
three minutes. You'll repeat this when the token expires (GitHub emails you before that
happens), so this page stays useful.

You only need to do this on github.com — nothing is installed anywhere.

---

## Step by step

1. Go to **github.com** and sign in. Click your **profile photo** in the top-right corner, then
   click **Settings** in the menu that opens.

2. In the left sidebar, scroll all the way down and click **Developer settings** (it's the last
   item).

3. In the left sidebar of that page, click **Personal access tokens**, then click
   **Fine-grained tokens** underneath it.

4. Click the green **Generate new token** button.

5. Fill in the form:
   - **Token name:** anything you'll recognise — `Portfolio admin` works.
   - **Resource owner:** leave as your own username.
   - **Expiration:** pick **90 days** (or use *Custom* for longer, up to a year). Longer is
     more convenient; shorter is safer if the device might be shared.
   - **Repository access:** choose **Only select repositories**, then open the
     **Select repositories** dropdown and tick your portfolio repository (for example
     `Portfolio`). *This step is the one people miss — without it the token can't see the
     repository at all.*

6. Open the **Repository permissions** section (click it to expand). Find the row named
   **Contents** and change its dropdown from *No access* to **Read and write**.
   Leave every other row as it is — nothing else is needed.

7. Scroll down and click the green **Generate token** button.

8. GitHub now shows the token **once**: a long code starting with `github_pat_`. Click the
   **copy icon** next to it. (If you close the page without copying, no harm done — delete that
   token and make a new one.)

9. Open your site's admin page — `https://your-username.github.io/your-repo/admin` — paste the
   token into the **Access token** box, and press **Sign in**. If you're on your own computer
   or phone, tick **Stay signed in on this device** first.

That's it. The token now lives only in your browser.

---

## When the token expires

Signing in (or saving) will fail with *"GitHub did not accept that token"*. That's all that
happens — the site itself stays up and public, nothing is lost.

To get back in: repeat the steps above from step 4 (GitHub also offers a **Regenerate token**
button on the old token's page, which is faster — it gives you a new code with the same
settings). Paste the new code into the admin sign-in page.

GitHub emails you a reminder about a week before a token expires.

---

## If sign-in complains

The sign-in page tells you specifically what's wrong, but for reference:

| Message | What it means | What to do |
|---|---|---|
| *GitHub did not accept that token* | Mistyped, or expired | Copy it again, or make a new one (step 4) |
| *The token cannot see the repository* | Step 5's "Only select repositories" wasn't set to this repo | Edit the token on GitHub (or make a new one) and fix Repository access |
| *…can read the repository but not write to it* | Step 6's Contents permission is still read-only | Edit the token and set **Contents: Read and write** |
| *Could not reach GitHub* | You're offline | Check the connection and retry |

---

## Good to know

- The token can **only** edit files in this one repository. It cannot read your other
  repositories, act as you elsewhere, or change account settings.
- **Sign out** (top right of the admin panel) wipes the token from the browser — do this on any
  shared computer.
- If a token ever leaks, go to the Fine-grained tokens page (steps 1–3) and **Delete** it.
  The leaked code becomes useless immediately.
