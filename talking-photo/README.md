# Talking photo: "56 days until launch"

- **Image:** Belinda's eyes/brows-corrected reading photo (ElevenLabs GPT Image 2.6 edit), cropped to 4:5 (`photo-4x5.jpg`).
- **Voice:** her voice clone audio taken unchanged from her own HeyGen video "TikTok - 56 days until launch" (80ae3cb2…), 27.8 s. Script in `heygen-56days.srt`.
- **Animation:** HeyGen talking photo (Avatar 6 Turbo, audio-driven), motion prompt: holds the book, gentle nods, lifts the book on "this one's for you". Video id cd2d5314…, cost 9 credits (2 left until 26 Dec).
- **Outputs:** `talking-photo-56days-4x5.mp4` (feed, 1080×1350) and `talking-photo-56days-9x16.mp4` (Reels/TikTok, blurred fill, loudness -16.7 dB).
- **QA (qa_check.py, 9:16):** format PASS, loudness PASS, black/silence PASS, length 27.8 s WARN (short by design, TikTok style), safe zone flagged at 1624 px = white T-shirt/jeans threads, not text (no captions in this video): false positive.
- **Known flaw:** when she lifts the book (about 19–22 s) the cover subtitle blurs and smears; title and author name stay readable.
- **Post with Instagram's "AI info" label.** Facts in the script checked: 23 January, Kindle pre-order open, link in bio.

## Story version (28 Nov): `talking-photo-56days-story-9x16.mp4`
Same video and voice, unchanged. Added (no HeyGen): six navy/gold story cards above the photo from AUTHOR-BIO.md (56 days to launch · I've never been short of ideas · new plans every day, folders full of possibilities, very few finished · the seminar sentence · I finished one thing at a time, starting with this book · Out 23 January 2027, Kindle pre-order, link in bio) and one-line captions of every spoken line. Photo scaled to 900×1125 at y 560 on a blurred fill. Build: `story/render.js` then `story/compose.py`.
QA: format PASS, loudness PASS (-16.7), black/silence PASS, length WARN (27.8 s, diary style), safe zone flagged at 1684 px = bottom edge of the photo (jeans), not text; all text sits between 250 and 1440 px. Frame review: cards and captions readable, author name on cover not covered.
