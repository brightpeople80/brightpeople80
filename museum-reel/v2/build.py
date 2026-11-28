"""Assemble the 43-second Museum of Unfinished Dreams Reel (author's voice).

Run from museum-reel/v2:  python3 build.py
"""
import subprocess

V1 = "../clip.mp4"
SC = "scenes/"
END = "../ov-end.png"
VOICE = "audio/voice-belinda.wav"
MUSIC = "../../ads4d/ch1/audio/soundtrack.wav"
OUT = "out/museum-reel-voice-9x16.mp4"

# (source, start, duration) laid end to end; matches the voiceover lines
SEGMENTS = [
    (V1, 0.0, 5.7),           # welcome, every exhibit felt urgent
    (SC + "s2.mp4", 0.0, 3.9),  # the notebook
    (SC + "s3.mp4", 0.0, 2.7),  # the business name
    (SC + "s4.mp4", 0.0, 3.2),  # the course
    (SC + "s5.mp4", 0.0, 2.3),  # the folder
    (SC + "s6.mp4", 0.0, 2.8),  # none of them failed
    (V1, 5.6, 4.4),           # you need a way to begin (notebook into her hands)
    (SC + "s8.mp4", 0.0, 6.0),  # take the smallest first step today
]
END_DUR = 12.0  # book end card, 31.0 to 43.0

CAPTIONS = [
    ("k1", 0.2, 2.8), ("k2", 2.9, 5.6), ("k3", 5.85, 7.5), ("k4", 7.55, 9.5),
    ("k5", 9.7, 12.3), ("k6", 12.35, 15.6), ("k7", 15.65, 17.75), ("k8", 17.85, 18.9),
    ("k9", 18.95, 20.55), ("k10", 20.6, 21.6), ("k11", 21.65, 23.5), ("k12", 23.55, 25.05),
    ("k13", 25.1, 26.7), ("k14", 26.72, 28.3), ("k15", 28.32, 30.9),
]

inputs, filters = [], []
for i, (src, ss, d) in enumerate(SEGMENTS):
    inputs += ["-ss", str(ss), "-t", str(d), "-i", src]
    filters.append(f"[{i}:v]scale=1097:1920,crop=1080:1920,setsar=1,fps=30,format=yuv420p,trim=duration={d},setpts=PTS-STARTPTS[s{i}]")
n = len(SEGMENTS)
inputs += ["-loop", "1", "-t", str(END_DUR), "-i", END]
filters.append(
    f"[{n}:v]scale=1080:1920,setsar=1,fps=30,"
    f"zoompan=z='min(1+0.0006*on,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,"
    f"trim=duration={END_DUR},setpts=PTS-STARTPTS,fade=in:st=0:d=0.5,format=yuv420p[send]")
concat_in = "".join(f"[s{i}]" for i in range(n)) + "[send]"
filters.append(f"{concat_in}concat=n={n + 1}:v=1:a=0[base]")

last = "base"
cap_start = n + 1
for k, (cid, a, b) in enumerate(CAPTIONS):
    idx = cap_start + k
    inputs += ["-loop", "1", "-t", "43", "-i", f"cap/{cid}.png"]
    filters.append(
        f"[{idx}:v]format=rgba,fade=in:st={a}:d=0.18:alpha=1,fade=out:st={b - 0.18}:d=0.18:alpha=1[c{k}]")
    nxt = f"v{k}"
    filters.append(f"[{last}][c{k}]overlay=0:0:enable='between(t,{a},{b})'[{nxt}]")
    last = nxt

vi = cap_start + len(CAPTIONS)
inputs += ["-i", VOICE, "-stream_loop", "-1", "-i", MUSIC]
filters.append(f"[{vi}:a]adelay=0|0,apad=whole_dur=43,volume=1.0[vo]")
filters.append(f"[{vi + 1}:a]atrim=0:43,asetpts=PTS-STARTPTS,volume=0.16,afade=in:st=0:d=1,afade=out:st=41:d=2[mu]")
filters.append("[vo][mu]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[a]")

cmd = ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(filters),
       "-map", f"[{last}]", "-map", "[a]", "-t", "43",
       "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
       "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", OUT]
subprocess.run(cmd, check=True)
print("wrote", OUT)
