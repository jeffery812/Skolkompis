# Skolkompis

Skolkompis is a browser-based companion for parents who don't speak Swedish, helping them stay involved in their kids' Swedish school life — starting with read-along storybook pages that pair the original Swedish text, native-voice narration, and an English translation.

## Purpose

My child is in primary school in Sweden and is reading a Swedish children's book series (this volume is *Robin kollar en tidsmaskin*). As a parent, I don't speak Swedish, so I can't read along, and I have no way to tell how far along my child is or whether they're reading it correctly.

This project turns a scanned book PDF into a self-contained web page my child can open and read independently, while also giving me a way to help:

- **Original text preserved**: every page keeps the Swedish original word-for-word, so my child is still genuinely reading Swedish, not a translation.
- **Native-sounding narration**: each page has an audio clip read in a natural-sounding Swedish voice, so my child can listen first, read along, or tap to hear a word they're stuck on.
- **Click-to-read lines**: every paragraph of the Swedish text is individually clickable and plays just that line, so my child can replay one sentence they got stuck on without listening to the whole page again.
- **English translation as a fallback**: an English translation can be expanded under each page's original text (collapsed by default) — as the parent, reading the English lets me roughly follow what's happening on that page, so I can talk about the book with my child and check their understanding.

The page needs no internet connection and no installation — just open the `.html` file directly in a browser.

## Contents

```
robin-kolla-en-tidsmaskin.pdf     scanned original (kept locally only, not version-controlled — large/sensitive file)
robin-kolla-en-tidsmaskin.html    the reading page — open with a browser
index.html                        redirects to the reading page (GitHub Pages entry point)
audio/
  page-N.mp3                      whole-page Swedish narration (one per book page)
  page-N-M.mp3                    Swedish narration for paragraph M of page N (click-to-read lines)
```

Page structure (`robin-kolla-en-tidsmaskin.html`):

- The page opens with a space-rocket-themed cover section (matching the plot of Chapter 1, "A Rocket!").
- Scrolling down, each book page is its own "page card" (`page-card`), containing in order:
  1. A page-number tag (matching the original book's page number, not the PDF file's page number)
  2. A play button that plays that page's whole-page Swedish narration (only one clip plays at a time)
  3. The Swedish original text, paragraph by paragraph — each paragraph is clickable (`data-audio` attribute) and plays just that line, highlighting itself while it speaks
  4. A "Read in English" button that expands that page's English translation
- Chapters are separated by a large chapter-divider card.

**Important constraint: the project itself (the HTML page, code, filenames, comments — everywhere) uses only Swedish and English, never Chinese.** Chinese only appears in this README, since the README is a note for myself; the page itself is for my child and me in an English/Swedish context.

## Adding future chapters

I'll keep scanning more chapters of the PDF over time. Each time a new chapter is added, append it into the same `robin-kolla-en-tidsmaskin.html` (rather than creating a new file), so this stays one continuous reading page for the whole book:

1. Extract the Swedish original text for each new page (watch for OCR/ligature garbling — e.g. "fl"/"fi" split apart, å/ä misread as à — and correct it from context).
2. Translate each page's original text into English (accurate and complete — don't route through Chinese).
3. Synthesize Swedish narration audio for each new page:
   - One whole-page clip, saved as `audio/page-{N}.mp3`.
   - One clip per paragraph, saved as `audio/page-{N}-{M}.mp3` (M = 1, 2, 3… in paragraph order, matching the `<p class="original">` order exactly) — this is what powers click-to-read-this-line.
   - Continue numbering from the existing pages; don't overwrite existing files. Currently using Microsoft Edge's free neural voice `sv-SE-SofieNeural` (via the Python package `edge-tts`), with `--rate=-4%` for a slightly slower pace that's easier for a child to follow.
4. In the HTML, append the new page following the existing `page-card` structure: page-number tag, narration player (`narration` component), original-text paragraphs (each with a `data-audio="audio/page-{N}-{M}.mp3"` attribute), and the "Read in English" collapsible translation panel. Add a `chapter-divider` card for any new chapter.
5. After appending, check:
   - The new page's whole-page audio filename matches its `<audio src="audio/page-N.mp3">` reference, and each paragraph's `data-audio` path matches an actual file — a mismatch here fails silently (nothing plays) rather than erroring, so verify file-by-file.
   - If the side page-dot navigation (`dotnav`) is kept, add anchors for the new pages too.
   - Click through the new content in a browser to confirm whole-page playback, individual line playback, translation toggle, and scroll animations all work.
   - Double-check no Chinese characters were introduced.

## Technical notes

- A single static HTML file (HTML + CSS + a bit of vanilla JS) — no build step, no backend, no external services other than Google Fonts (Baloo 2 / Literata / ZCOOL KuaiLe) loaded from their CDN.
- Narration audio is generated locally with the `edge-tts` command-line tool (`pip install edge-tts`) — no API key needed, it calls Microsoft Edge's free online speech synthesis, and sounds much more natural than macOS's built-in `say` command.
