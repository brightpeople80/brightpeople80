# Meet the author: Belinda Bright N.

`out/meet-the-author-vertical-1080x1920.mp4`: 1080×1920, 30 fps, 46.5 s. The script was written by the author.

| Time | Scene |
|---|---|
| 0–7 | "There are people with dreams…": a woman at night, with three ivory cards (Canva-generated image) |
| 7–11 | "Between preparing and doing…": a gold line from PREPARING to DOING tangles before it arrives |
| 11–15.5 | **Meet Belinda Bright N.**: the author's photo with the "Meet the author" lower third |
| 15.5–23 | The debut book: the cover plus "Why we overthink / chase new ideas / struggle to follow through" |
| 23–29.5 | Practical tools: the SELECT method ticket and the 30-day follow-through calendar |
| 29.5–34.5 | The quote over a woman writing (Canva-generated image) |
| 34.5–46.5 | End card: book stack, e-reader, author chip, prices, "Available from 23 January 2027", the Kindle pre-order button and the website |

Pure HTML/CSS (no WebGL). `node render.js` renders the full video in about 2 minutes.

The narration is a temporary voice (`audio/voice-standin/`). To use the author's own recording, replace the line WAVs and `timeline.json`, then run `python audio/make_audio.py <folder>` and `python3 tools/build_captions.py`.
