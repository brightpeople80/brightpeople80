# 3D ad series (15 s, 9:16, for Meta)

Each folder is one ad. To build `ad.html`, run `tools/assemble.sh`; then run `node render.js` (add `--stills 3,9` for frames only).
The narration is a temporary voice (`audio/voice-standin/`). Every end card uses the agreed format block:
- Kindle eBook £3.99 · Pre-order now
- Paperback £9.99 · Out 23 January 2027
- Hardcover · Coming soon
- the "Kindle pre-order on Amazon UK" button

| Ad | Hook | Status |
|---|---|---|
| `ch5/` | Chapter 5, "The email that stayed in drafts": an animated phone (drafts ageing from Mon to Thu, a "too direct?" doubt, the rewrite, schedule send), the thumb over Send, the book's line on ivory paper, then Send pressed. **Male voice (Daniel)** | done (31.5 s) |
| `ch1/` | Chapter 1, "The notebook full of tomorrow": a cinematic diary (SUN 21:43, then a hard cut to MON 08:45), the week slipping, the book's line in navy and gold particles | done (28 s) |
| `ch6/` | Chapter 6, "The morning after the breakthrough": editorial photo cards (Monday / Tuesday), the START–MIDDLE–DONE timeline, the book's line, the real cover | done (26 s) |
| `notes/` | "Notes full. Tabs open. Nothing started." A tower of idea notes; the gold line circles it, pulls one out, the rest collapse, and it becomes the bookmark | done |
| `someday/` | "Someday isn't a date." | next |
| `stairs/` | "Planning feels like progress. It isn't." | planned |
| `stop/` | "Stop planning. Start." (extends `../ad3d`) | planned |

The hooks follow Meta's personal-attributes rule: they describe situations, never tell the viewer what they are.

## Images
`ch1/`: Sunday notebook (whisky glass cropped out, AI book with garbled title blurred) and Monday rain, both generated in Canva by the author.
The `ch6/` images were generated in Canva by the author. On the Tuesday image, the laptop (a fake Amazon page with star ratings) and the wrong-date calendar are blurred. The book-on-table image appears only heavily blurred, because its AI-redrawn cover is not the real cover; the real `front-cover.png` is always the one shown.
