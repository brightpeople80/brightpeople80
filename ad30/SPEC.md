# SPEC — "You're not lazy" 30 s ad

GOAL:    a viewer who saves ideas but never starts feels seen in the first 3 s, then pre-orders the Kindle on Amazon UK.
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps, vertical for TikTok / Reels / Shorts.
TIME:    31.5 s x 30 = 945 frames. The voice is the clock (audio/timeline.json); the music is 120 BPM = 15 frames a beat after the drop at 12.0 s.

LOOK
- Ground: brand navy #0b1a31 (the brand's own cover and website ground), floor #0f2240 under the 3D books with a 0.75 contact shadow. No gradients except the cover art itself.
- Ink: #ffffff for every word that is read. Accent: brand gold #fbc312 on one word per caption group (the word being spoken) and on the CTA button only.
- Type: captions Montserrat 800, 62 px, sentence case, left-aligned at x 120, 2 lines max, bottom edge at y 1240. Hook lines Source Serif 4 italic 600, 118 px, -1% tracking, left-aligned in the upper band (y 330-700) as on the website hero. Cards: Montserrat 900 for labels, Caveat 600 for handwriting.
- Medium: real photographs (two Canva-generated scenes, navy-and-gold), physical paper cards (cream #f6efe2, blue rules, red margin), a 3D book stack under a studio key (upper left, 2.2), gold rim (back right), clearcoat 0.6 on covers.
- Safe zone: every word and the product inside y 288-1248, x 120-888 (x 120-780 below y 840).

OBJECTS
- The man buried in sticky notes (photo), the woman scrolling in bed at night (photo).
- Browser tabs: a cream browser window whose tab strip fills until each tab is a sliver.
- The book: 6 x 9 x 0.26 units, real front, back and spine art; stack = front standing, back standing right, two flat copies spine-to-camera, as on the website mockup.
- SELECT card, one-project index card, 30-day grid card.

MOTION
- Enter: power3.out, 9-12 frames. Exit: power2.in, 6 frames. Camera: sine.inOut. Cards: back.out(1.4) on position only.
- Photos: one push-in per shot, 6-12% scale over the shot, never a fade between photos (hard cuts on the voice).
- Captions: whole group present at 40% opacity on entry; each word goes to 100% and gold on its timestamp, back to white when the next word starts.

SHOTS
- 0.00-1.38  man in sticky notes, push 1.04->1.12. Hook line "You're not lazy." on screen from frame 0; "lazy" struck in gold at 0.95 s.
- 1.38-3.00  woman in bed, push 1.06->1.14. "You're not unmotivated." struck at 2.4 s.
- 3.00-4.75  sticky notes close-up (crop of shot 1), drift left. Captions carry the words.
- 4.75-5.15  phone close-up (crop of shot 2).
- 5.15-5.69  notes close-up, tighter.
- 5.69-6.55  "starting over": gold loop arrow drawn round on navy.
- 6.55-7.70  "notes are full": wide notes crop, push.
- 7.70-8.55  "tabs are open": browser window, 18 tabs land 40 ms apart.
- 8.55-10.60 "next step still feels unclear": woman's face, a pre-blurred copy dissolves over it from 9.3 to 10.2 (blur baked into the file).
- 10.60-12.00 "this book is for you": the book rises out of darkness, rim-lit only.
- 12.00       drop: key light on, white flash 6 frames, bass hit.
- 12.00-13.30 title: hero book, slow push.
- 13.30-14.60 "by Belinda Bright N.": the stack assembles (back copy slides in, two flat copies drop) as the camera pulls back.
- 14.60-18.30 practical guide: slow push and 4 degree orbit.
- 18.30-23.30 inside: three cards slide in on "SELECT" (19.59), "one-project card" (20.34), "thirty-day" (21.66).
- 23.30-25.50 "stop planning / start moving": captions, "planning" struck, "moving" in gold.
- 25.50-31.50 CTA: button "Pre-order on Amazon UK" on "pre-order" (25.56), "Kindle £3.99" on "Kindle" (27.71), "Out 23 January 2027" on "Out" (29.0). Hold to the end.

SOUND: voice (Kokoro bf_emma, 1.12x) over an original score: ticking clock under the hook, heartbeat into a riser, silence 11.75-12.0, drop on the title, C-G-Am-F at 120 BPM, final sting at 30.0. Whooshes only on cuts and card entries. Mixed to -14 LUFS.

BANNED: glow sprites and floating dust (used in the earlier trailer), fading every element up, centred everything, text moving while read, logo in a corner, grain or blur as CSS on photos.

QA frames: 0.0 (hook readable, face/scene), 2.5 (strike on "unmotivated"), 8.0 (tabs), 9.9 (blur), 11.0 (silhouette), 12.2 (flash out, title), 14.3 (stack), 20.8 (one-project card), 22.5 (30-day grid), 24.8 (strike), 30.5 (full CTA).
