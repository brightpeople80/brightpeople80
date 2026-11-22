# Maya's Test: 33-second vertical 3D trailer

`out/maya-trailer-vertical-1080x1920.mp4`: 1080×1920, 30 fps, 33 s.

## Story
| Time | Shot | Narration |
|---|---|---|
| 0–4 | The SOMEDAY drawer clicks open. The card "Start my food business." rises, and the gold line draws a paper kitchen | People liked Maya's meal idea. Would they pay for it? |
| 4–13 | Meal boxes stop at the price tag and slide back. Speech bubbles: "Could you teach us?" The line folds the counter into a workshop table | The price didn't work. But two people asked, "Could you teach us?" |
| 13–18 | Eight empty chairs rise. **Maya's test: 8 paid bookings** | So Maya set a test… |
| 18–26 | The table folds into the book, the cover opens, and three objects rise from it: the SELECT method ticket, the 30-Day Follow-Through Programme calendar and the Action and Evidence Log notebook | The Life You Keep Planning shows you how… |
| 26–33 | End card: book stack, e-reader, phone with the quiz, title, date, prices, **Take the free quiz** and the URL | Take the free quiz on the book website. |

## Separate layers (in `trailer.html`)
- The 3D world (three.js canvas): drawer, kitchen, table, chairs, book and objects. The cover is `assets/front-cover.png`, used unchanged.
- Captions: `audio/captions.js`, built by `tools/build_captions.py` from the narration timing.
- The "Maya's test" line, `#test`.
- End card, `#end`: title, author, date, the book stack (`assets/book-stack-soft.png`, cropped from the site), the e-reader, the phone, the prices, the quiz line and the URL.

## Stand-ins to replace
1. **Narration.** It is currently a temporary British AI voice reading the exact script (`audio/voice-standin/`).
   To use Joanna's recording:
   - cut the WAV into the seven sentences (`l1.wav` … `l7.wav`);
   - write a `timeline.json` with the start time of each sentence and its words;
   - run `python audio/make_audio.py <folder>` and `python3 tools/build_captions.py`;
   - re-render.
2. **Phone screen.** It is currently made from the real site screenshot (`assets/phone-screen-standin.png`).
   For the screen recording:
   - put it at `assets/quiz.mp4`;
   - change `#phone-media` to a `<video>`;
   - seek it per frame in `render()`.

## Render
`node render.js` renders the MP4 and muxes `audio/soundtrack.wav`. Add `--stills 3,9,15` for PNG frames only.
