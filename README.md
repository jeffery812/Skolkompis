# Skolkompis

Skolkompis ("school buddy" in Swedish) is a small collection of browser-based tools I build to help tutor my kids through primary school — working through math problems together, and using AI-generated narration to help with reading practice. Everything runs as static HTML pages: no build step, no backend, no installation. Open a page in a browser and go.

**Live page:** https://jeffery812.github.io/Skolkompis/

## Projects

### Ride or Drive? — math practice

`ride-or-drive/index.html`

An animated wheel-counting trick for the classic "chicken and rabbit" (鸡兔同笼) puzzle: given a total head count and a total wheel count, figure out how many two-wheeled and four-wheeled vehicles there are. The page walks through the visual trick step by step, then gives 10 practice problems to solve independently.

### Robin kollar en tidsmaskin — AI-assisted reading

`Robin-book/index.html` (reading page: `Robin-book/robin-kolla-en-tidsmaskin.html`)

A read-along companion for a Swedish children's book, built for a parent who doesn't speak Swedish to stay involved in their kid's reading. It turns a scanned book into a self-contained page with:

- **Original text preserved** — every page keeps the Swedish original word-for-word, so the child is genuinely reading Swedish, not a translation.
- **AI narration** — each page has an audio clip read in a natural-sounding Swedish voice (Microsoft Edge's neural TTS voice `sv-SE-SofieNeural`, generated locally via `edge-tts`), so the child can listen first, read along, or replay a word they're stuck on.
- **Click-to-read lines** — every paragraph is individually clickable and plays just that line, so the child can repeat one sentence without replaying the whole page.
- **English translation as a fallback** — collapsed by default under each page, so a non-Swedish-speaking parent can follow along and talk to their kid about the book.

**Fair-use note:** this is a non-commercial personal project, built by a parent to help their own child at home — not a redistribution service. It reproduces text from a copyrighted children's book (*Robin kollar en tidsmaskin*) for private, non-profit, educational use. If you are a rights holder with a concern, please open an issue on this repository.

See `Robin-book/README.md` for the full technical write-up, including the workflow for adding future chapters (extracting text, translating, generating narration audio, and appending new pages).

## Repository layout

```
index.html                   root landing page — links to every project below
ride-or-drive/index.html     math: chicken-and-rabbit wheel-counting puzzle
Robin-book/
  index.html                 redirects to the reading page (GitHub Pages entry point)
  robin-kolla-en-tidsmaskin.html   the reading page — open with a browser
  audio/                     per-page and per-paragraph Swedish narration (mp3)
  README.md                  detailed notes on the reading project
```

## Adding a new project

1. Build it as a self-contained page (or folder) under the repo root, following the style of the existing projects (no build step, no backend).
2. Add an entry to the `PROJECTS` array in the root `index.html` so it shows up as a card on the landing page.
