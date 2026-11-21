# The Life You Keep Planning — campaign video

36-second launch trailer for *The Life You Keep Planning* by Belinda Bright N. (out 23 January 2027).

| File | Use |
|---|---|
| `video/out/trailer-vertical-1080x1920.mp4` | Instagram Reels, TikTok, YouTube Shorts, Stories |
| `video/out/trailer-landscape-1920x1080.mp4` | YouTube, website "Watch Trailer" button, LinkedIn, X |

The videos are silent so you can add a licensed track inside Instagram / TikTok.

## Storyboard
1. **0–5s** Sticky-note ideas pile up: *Full notebooks. Saved screenshots. Ideas that never stop.*
2. **5–9s** A tangle draws itself: *So why does it still feel like you're standing still?*
3. **9–14s** *You're not lazy. You're not unmotivated. You're stuck in the cycle of planning.*
4. **14–19s** The tangle becomes an arrow: *You don't need another plan. You need a way to begin.*
5. **19–24s** 3D cover reveal: *The debut book.*
6. **24–29s** Inside the book: planning vs doing, the SELECT method, the 30-day programme.
7. **29–36s** End card: *Out 23 January 2027 — Pre-order on Amazon Kindle — Kindle £3.99 · Paperback £9.99.*

## Editing and re-rendering
All text and timing live in `video/trailer.html` (open it in a browser to preview; add `?format=landscape` for 16:9).

```bash
cd video
node render.js vertical     # needs Playwright + ffmpeg
node render.js landscape
```
