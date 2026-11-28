# Talking photo: "56 days until launch"

- **Image:** Belinda's eyes/brows-corrected reading photo (ElevenLabs GPT Image 2.6 edit), cropped to 4:5 (`photo-4x5.jpg`).
- **Voice:** her voice clone audio taken unchanged from her own HeyGen video "TikTok - 56 days until launch" (80ae3cb2…), 27.8 s. Script in `heygen-56days.srt`.
- **Animation:** HeyGen talking photo (Avatar 6 Turbo, audio-driven), motion prompt: holds the book, gentle nods, lifts the book on "this one's for you". Video id cd2d5314…, cost 9 credits (2 left until 26 Dec).
- **Outputs:** `talking-photo-56days-4x5.mp4` (feed, 1080×1350) and `talking-photo-56days-9x16.mp4` (Reels/TikTok, blurred fill, loudness -16.7 dB).
- **QA (qa_check.py, 9:16):** format PASS, loudness PASS, black/silence PASS, length 27.8 s WARN (short by design, TikTok style), safe zone flagged at 1624 px = white T-shirt/jeans threads, not text (no captions in this video): false positive.
- **Known flaw:** when she lifts the book (about 19–22 s) the cover subtitle blurs and smears; title and author name stay readable.
- **Post with Instagram's "AI info" label.** Facts in the script checked: 23 January, Kindle pre-order open, link in bio.
