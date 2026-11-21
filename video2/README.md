# Trailer v2: 3D, kinetic type, music

34.5-second launch trailer for *The Life You Keep Planning*. Version 1 (flat motion graphics) is in `../video/`.

| File | Use |
|---|---|
| `out/trailer-v2-vertical-1080x1920.mp4` | Reels, TikTok, Shorts, Stories, vertical ads |
| `out/trailer-v2-landscape-1920x1080.mp4` | YouTube, website, LinkedIn, X |

## What's in it
- **Real-time 3D** (three.js): a flythrough of sticky notes, screenshots and to-do lists that swirl into a tangle; a gold line pulls out of the tangle and the camera chases it into a lit 3D reveal of the book.
- **Kinetic captions**: every word pops in when it is spoken (timed per word).
- **British female voiceover** (Kokoro TTS, voice `bf_emma`).
- **Original soundtrack**, synthesised from scratch, so there are no licensing issues: ticking clock → heartbeat → riser → silence → bass drop on the reveal → uplifting four-chord section → final sting.
- **Finish**: film grain, light leaks, zoom-blur cuts, impact shakes, flash frames.

## Script
| Time | Line |
|---|---|
| 0:00 | A notebook full of plans. A camera roll full of screenshots. A head full of ideas. |
| 0:06 | So why does nothing ever actually start? |
| 0:09 | You're not lazy. You're stuck in the cycle of planning. |
| 0:14 | You don't need another plan. You need a way to begin. |
| 0:18 | *(drop)* The Life You Keep Planning. The debut book by Belinda Bright N. |
| 0:23 | The SELECT method. A thirty-day programme. One meaningful step at a time. |
| 0:28 | Out January the twenty-third. Pre-order now on Kindle. |

## Rebuilding
```bash
# 1. voice (needs kokoro-onnx + model files kokoro-v1.0.onnx / voices-v1.0.bin)
python audio/make_voice.py <model_dir> <voice_dir>      # edit audio/script.json to change lines
echo "window.TIMELINE = $(cat <voice_dir>/timeline.json);" > timeline.js
# 2. music + mix (needs numpy, scipy, soundfile), then loudness-normalise
python audio/make_music.py <voice_dir> mix.wav
ffmpeg -i mix.wav -af loudnorm=I=-14:TP=-1.0:LRA=11 -ar 48000 audio/soundtrack.wav
# 3. video (needs Playwright + ffmpeg)
node render.js vertical
node render.js landscape
```
Open `trailer.html` in a browser to preview (add `?format=landscape` for 16:9).
