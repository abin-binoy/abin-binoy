# ABIN BINOY — Personal Portfolio

A dark, cinematic black-and-gold single-page portfolio built with **HTML5, CSS3 and Vanilla JavaScript only** (no frameworks, no build step). It works on GitHub Pages exactly as it is.

**Creative Mind. Tech Enthusiast. Future Innovator.**

---

## 1. What's inside

```
abin-binoy-portfolio/
├── index.html          ← all content (text, projects, skills, links)
├── style.css           ← design system, layout, animations, responsive rules
├── script.js           ← loader, menu, particles, cursor, modal, contact form
├── README.md
├── assets/
│   ├── profile.jpg     ← YOUR ORIGINAL PHOTO (unmodified)
│   ├── project-1.jpg   ← replaceable project thumbnails
│   ├── project-2.jpg
│   ├── project-3.jpg
│   ├── cv-preview.jpg  ← image of the CV shown in the Resume section
│   ├── og-image.jpg    ← preview image for WhatsApp / LinkedIn / social sharing
│   └── icons/          ← favicon + Apple touch icon
└── cv/
    └── Abin-Binoy-CV.pdf   ← the real, downloadable one-page CV (A4, selectable text)
```

All paths are **relative**, so the site works on GitHub Pages (including in a sub-folder like `/abin-binoy-portfolio/`).

---

## 2. Preview it on your computer

Just double-click `index.html`. Or, for a more accurate preview, run a tiny local server in the project folder:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

---

## 3. Publish on GitHub Pages (step by step)

### A. Create the repository
1. Go to <https://github.com/new> (signed in as **abin-binoy**).
2. Repository name: `abin-binoy-portfolio` (or `abin-binoy.github.io` for a root URL — see note below).
3. Set it to **Public**. Do **not** tick "Add a README" (you already have one). Click **Create repository**.

### B. Upload the files with Git
Open a terminal **inside the project folder** and run:

```bash
git init
git add .
git commit -m "Launch Abin Binoy portfolio"
git branch -M main
git remote add origin https://github.com/abin-binoy/abin-binoy-portfolio.git
git push -u origin main
```

*(No Git? On the repository page click **Add file → Upload files**, drag in everything — keep the `assets` and `cv` folders — and commit.)*

### C. Turn on GitHub Pages
1. Repository → **Settings → Pages**.
2. **Source:** *Deploy from a branch*.
3. **Branch:** `main` — folder `/ (root)` → **Save**.
4. Wait 1–2 minutes. Your site will be live at:

   **https://abin-binoy.github.io/abin-binoy-portfolio/**

> **Using the repo name `abin-binoy.github.io`?** Your site is then at `https://abin-binoy.github.io/`. 

### D. Update the share/SEO URLs (important, 1 minute)
In `index.html`, find these and make sure they match your real live address:

- `<link rel="canonical" href="…">`
- `og:url`, `og:image`, `twitter:image`

(They currently assume `https://abin-binoy.github.io/abin-binoy-portfolio/`.) Social-media preview images need the full `https://…` address — that's why they aren't relative.

### E. Updating the live site later
```bash
git add .
git commit -m "Update portfolio"
git push
```
GitHub Pages redeploys automatically in about a minute.

---

## 4. Make the contact form send real messages

The form is fully built (validation, loading state, success/error messages, spam honeypot) but **it cannot send anything until you connect a service** — until then it honestly tells visitors it isn't connected and offers email / WhatsApp links instead.

Open `script.js` and edit the `CONFIG` block at the top. Pick **one** option:

### Option A — Formspree (easiest, no code)
1. Create a free account at <https://formspree.io> → **New form**. Use `abinbinoyporunnolil@gmail.com` as the recipient and confirm the verification email.
2. Copy your form endpoint (looks like `https://formspree.io/f/abcdwxyz`).
3. In `script.js`:
   ```js
   provider: 'formspree',
   formspreeEndpoint: 'https://formspree.io/f/abcdwxyz',
   ```
4. Save, push to GitHub, and send yourself a test message.

### Option B — EmailJS
1. Create a free account at <https://www.emailjs.com>.
2. **Email Services → Add service** (e.g. Gmail) → note the **Service ID**.
3. **Email Templates → Create** a template. Use these variables in it: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}` (set *Reply-To* to `{{from_email}}`). Note the **Template ID**.
4. **Account → API keys** → copy your **Public Key**.
5. In `script.js`:
   ```js
   provider: 'emailjs',
   emailjs: { publicKey: 'YOUR_PUBLIC_KEY', serviceId: 'service_xxxxx', templateId: 'template_xxxxx' }
   ```
6. In the EmailJS dashboard, under **Security**, restrict the allowed domain to `abin-binoy.github.io` so nobody else can use your key.

> A public key in front-end code is normal for both services; they are designed for static sites. Both providers have free-tier monthly limits.

---

## 5. How to edit your website

### Replace your photograph
1. Save the new photo as `assets/profile.jpg` (replace the file; portrait orientation, ideally ~1000 × 1300 px or larger, under ~300 KB).
2. If the face sits too high/low in the frame, adjust one line in `style.css`:
   ```css
   .portrait-frame img { object-position: 42% 22%; }   /* horizontal% vertical% */
   ```
   Try `50% 15%` (shows more of the top) or `50% 35%` (shows more of the lower body).

### Update project details
In `index.html`, search for `PROJECT 01`, `PROJECT 02`, `PROJECT 03`. Each project is one `<article>`:

| What | Where |
|---|---|
| Thumbnail | `<img src="assets/project-1.jpg">` — replace the image file (keep ~1200 × 750 px) |
| Type / Title / Description | the `data-field="type"`, `"title"`, `"desc"` elements |
| Technology tags | `<ul class="tags" data-field="tags">` — one `<li>` per tag |
| More details (popup) | `<div class="project-extra">` paragraph |
| GitHub link | the `href` of `<a data-repo …>` — currently your profile page; change it to the specific repository once it exists |

Yellow-italic text like `[Add a short description…]` marks **placeholders** — replace them with your real details (nothing was invented for you).

To **add a 4th project**, copy a whole `<article class="project …">…</article>` block, paste it after the last one, and edit it.

### Change skill levels
In `index.html`, each skill has a `data-level`:
```html
<li class="skill" data-level="beginner"> … </li>
```
Allowed values: `beginner` · `intermediate` · `advanced` · `expert`. The bar and label update automatically. (Everything is `beginner` right now, as you specified.)

### Edit text, education, journey
All text lives in `index.html` under clearly labelled section comments (`02 · ABOUT ME`, `03 · EDUCATION`, …). Edit the text between the tags — don't remove the tags.

### Change colours or fonts
At the top of `style.css`, the `:root { … }` block holds every colour (`--gold`, `--bg`, `--card` …) and font.

### Update your CV
The PDF is a normal file: replace **`cv/Abin-Binoy-CV.pdf`** with your new one (keep the same name — the buttons already point to it). Also replace **`assets/cv-preview.jpg`** with an image of the new first page so the preview in the Resume section stays current (export page 1 of the PDF as a JPG at ~800 px wide).

### Change social links / contact details
Search `index.html` for the old value (for example `github.com/abin-binoy`) and replace every occurrence. Don't forget the `ld+json` block in `<head>` and the CV.

---

## 6. Features checklist

- Cinematic loading screen · staggered-letter hero reveal · golden particle canvas
- Custom cursor (desktop mouse only — automatically disabled on touch devices)
- Smooth scrolling with fixed-nav offset · active section highlighting · golden underline animation
- Responsive hamburger menu (full-screen on tablet/phone) with Esc-to-close
- Scroll-reveal (Intersection Observer) · animated skill bars · 3D tilt cards · subtle parallax
- Animated education timeline and journey timeline (gold line fills as you scroll)
- Project "View Details" popup (keyboard accessible, focus-trapped, Esc to close)
- Real downloadable CV · working GitHub / LinkedIn / Instagram / WhatsApp / email links
- Validated contact form (Formspree or EmailJS) with success and error messages
- Back-to-top button · scroll-progress bar
- SEO meta tags · Open Graph / Twitter cards · structured data (JSON-LD) · SVG favicon
- Accessibility: skip link, semantic landmarks, visible focus rings, ARIA labels, keyboard navigation
- `prefers-reduced-motion` respected (animations, particles and smooth scroll are turned off)
- Permanent dark theme — no light-mode toggle, no background music

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| Site shows 404 on GitHub Pages | Check **Settings → Pages** is set to `main` / `(root)`; wait 2 minutes. |
| Images/CV missing online | File names are **case-sensitive** on GitHub (`profile.jpg` ≠ `Profile.jpg`). |
| Old version still showing | Hard refresh (Ctrl/Cmd + Shift + R). |
| Fonts look different offline | Fonts load from Google Fonts; a fallback serif/sans-serif is used without internet. |
| Contact form says "not connected" | Complete section 4 and push the updated `script.js`. |

---

© Abin Binoy. Created with passion in Kerala, India.
