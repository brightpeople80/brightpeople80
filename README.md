# The Life You Keep Planning — campaign video

39-second narrated launch trailer for *The Life You Keep Planning* by Belinda Bright N. (out 23 January 2027).

| File | Use |
|---|---|
| `video/out/trailer-vertical-1080x1920.mp4` | Instagram Reels, TikTok, YouTube Shorts, Stories |
| `video/out/trailer-landscape-1920x1080.mp4` | YouTube, website "Watch Trailer" button, LinkedIn, X |

Both videos include a British female voiceover (Kokoro TTS, voice `bf_emma`). Add background music inside
Instagram / TikTok at low volume (around 10–20%) so the voice stays clear.

## Voiceover script
| Time | Line |
|---|---|
| 0:00 | Full notebooks. Saved screenshots. Ideas that never stop. |
| 0:06 | So why does it still feel like you're standing still? |
| 0:09 | You're not lazy. You're not unmotivated. You're stuck in the cycle of planning. |
| 0:14 | You don't need another plan. You need a way to begin. |
| 0:19 | The Life You Keep Planning. The debut book by Belinda Bright N. |
| 0:24 | Discover why planning can replace doing, learn the SELECT method for choosing what matters, and follow a thirty-day programme to see it through. |
| 0:33 | Out on the twenty-third of January. Pre-order now on Amazon Kindle. |

To use your own recorded voice instead, replace `video/audio/voiceover.wav` (39.5s long) and re-render.

## Storyboard
1. **0–5s** Sticky-note ideas pile up: *Full notebooks. Saved screenshots. Ideas that never stop.*
2. **5–9s** A tangle draws itself: *So why does it still feel like you're standing still?*
3. **9–14s** *You're not lazy. You're not unmotivated. You're stuck in the cycle of planning.*
4. **14–19s** The tangle becomes an arrow: *You don't need another plan. You need a way to begin.*
5. **19–24s** 3D cover reveal: *The debut book.*
6. **24–32s** Inside the book: planning vs doing, the SELECT method, the 30-day programme.
7. **32–39.5s** End card: *Out 23 January 2027 — Pre-order on Amazon Kindle — Kindle £3.99 · Paperback £9.99.*

## Editing and re-rendering
All text and timing live in `video/trailer.html` (open it in a browser to preview; add `?format=landscape` for 16:9).

```bash
cd video
node render.js vertical     # needs Playwright + ffmpeg
node render.js landscape
```
