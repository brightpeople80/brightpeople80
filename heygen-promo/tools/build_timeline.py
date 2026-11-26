"""Cuts the HeyGen master (one take of the whole script) into its 11 sentences, re-spaces them
with the pauses the brief asks for, and writes:
  timeline.js        segment placement, avatar frame map, captions (for video.html)
  audio/voice.wav    the re-spaced narration
  assets/av/*.jpg    the avatar frames
usage: python3 tools/build_timeline.py assets/heygen-master.mp4 assets/heygen-master.srt
"""
import sys, json, re, subprocess, os, numpy as np, soundfile as sf

MASTER, SRT = sys.argv[1], sys.argv[2]
FPS = 30
SENT = ["I'm Belinda Bright N., and I wrote The Life You Keep Planning.",
        "Have you ever had so many ideas that choosing just one feels impossible?",
        "You plan. You research. You start again.",
        "But somehow, the things that matter most are still waiting.",
        "If you're someone with more ideas than time, who's tired of overthinking, chasing new possibilities and struggling to follow through, I wrote this book with you in mind.",
        "Inside, you'll discover the SELECT method and a 30-day follow-through programme to help you recognise what matters, choose a direction and take practical steps forward.",
        "My book, The Life You Keep Planning, is available now for pre-order on Amazon Kindle.",
        "The paperback is coming soon.",
        "The official launch date is the twenty-third of January, twenty twenty-seven.",
        "Ready to move from planning to doing?",
        "Find The Life You Keep Planning on Amazon."]
# silence placed BEFORE each sentence in the output (brief: a full 1 s before the paperback line, a pause before the date)
GAP = [0.35, 0.7, 0.55, 0.45, 0.8, 0.7, 0.8, 1.15, 0.9, 0.9, 0.45]
HOLD = 5.0                                     # end screen stays on after the last word

# ---- audio of the master, and speech energy
wav = '/tmp/_hg_master.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', MASTER, '-ac', '1', '-ar', '48000', wav], check=True)
a, sr = sf.read(wav)
hop = int(sr * .01); e = np.array([np.sqrt(np.mean(a[i:i + hop] ** 2)) for i in range(0, len(a) - hop, hop)])
thr = max(1e-4, np.percentile(e, 60) * .12)
speech = e > thr

# ---- sentence boundaries: cue timings from the SRT, snapped to real silences in the audio
def ts(s): h, m, rest = s.split(':'); sec, ms = rest.split(','); return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000
cues = []
for blk in re.split(r'\n\s*\n', open(SRT, encoding='utf-8').read().strip()):
    L = blk.strip().splitlines()
    if len(L) >= 3 and '-->' in L[1]:
        t0, t1 = [ts(x.strip()) for x in L[1].split('-->')]; cues.append((t0, t1, ' '.join(L[2:])))
norm = lambda s: re.sub(r'[^a-z0-9]+', ' ', s.lower()).split()
words = []                                       # spread each cue's words over its time
for t0, t1, txt in cues:
    w = norm(txt)
    for i, x in enumerate(w): words.append((x, t0 + (t1 - t0) * i / len(w), t0 + (t1 - t0) * (i + 1) / len(w)))
ends, wi = [], 0
for s in SENT:
    n = len(norm(s)); wi = min(len(words), wi + n); ends.append(words[wi - 1][2])
def snap(t, back=.6, fwd=.6):                    # centre of the nearest silence run
    i0, i1 = max(0, int((t - back) * 100)), min(len(speech) - 1, int((t + fwd) * 100))
    best, bi, run = None, None, 0
    for i in range(i0, i1 + 1):
        if not speech[i]: run += 1
        else:
            if run >= 6:
                c = (i - run / 2) / 100
                if best is None or abs(c - t) < abs(best - t): best = c
            run = 0
    return best if best is not None else t
cuts = [0.0] + [snap(x) for x in ends[:-1]] + [len(a) / sr]
segs_src = []
for i in range(len(SENT)):
    s0, s1 = cuts[i], cuts[i + 1]
    on = np.where(speech[int(s0 * 100):int(s1 * 100)])[0]
    v0 = s0 + (on[0] / 100 if len(on) else 0) - .06; v1 = s0 + (on[-1] / 100 if len(on) else s1 - s0) + .12
    segs_src.append((max(0, v0), min(s1, v1)))

# ---- place on the output timeline
out, t = [], 0.0
for i, (v0, v1) in enumerate(segs_src):
    t += GAP[i]; out.append({'o': round(t, 3), 'd': round(v1 - v0, 3), 'src': round(v0, 3)}); t += v1 - v0
DUR = round(t + HOLD, 2)

# ---- narration with the new spacing
N = int(DUR * sr); vo = np.zeros(N)
for s, (v0, v1) in zip(out, segs_src):
    seg = a[int(v0 * sr):int(v1 * sr)].copy(); f = int(.012 * sr); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    i = int(s['o'] * sr); vo[i:i + len(seg)] += seg[:N - i]
sf.write('audio/voice.wav', vo, sr, subtype='PCM_16')

# ---- avatar frames: lip-synced inside a sentence; in the pauses, the quiet frames around it play back and forth
os.makedirs('assets/av', exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', MASTER, '-vf', f'fps={FPS},scale=1080:-2', '-q:v', '3', 'assets/av/f%05d.jpg'], check=True)
nsrc = len(os.listdir('assets/av'))
def srcf(x): return max(1, min(nsrc, int(round(x * FPS)) + 1))
avmap = []
for fo in range(int(DUR * FPS)):
    tt = fo / FPS; f = None
    for j, s in enumerate(out):
        if s['o'] <= tt < s['o'] + s['d']: f = srcf(s['src'] + tt - s['o']); break
    if f is None:                                # a pause: rock gently through the nearest silent source frames
        prev = max([j for j, s in enumerate(out) if s['o'] <= tt] or [0]); s = out[prev]
        base = s['src'] + s['d'] if tt >= s['o'] else s['src']
        lo, hi = base, (cuts[prev + 1] if prev + 1 < len(cuts) else base + .3)
        span = max(.1, hi - lo); ph = (tt - (s['o'] + s['d'])) % (2 * span); x = lo + (ph if ph < span else 2 * span - ph)
        f = srcf(x)
    avmap.append(f)

# ---- captions: short phrases, timed proportionally inside each sentence
CAP = [["I'm Belinda Bright N.,", "and I wrote The Life You Keep Planning."],
       ["Have you ever had so many ideas", "that choosing just one feels impossible?"],
       ["You plan. You research.", "You start again."],
       ["But somehow, the things that matter most", "are still waiting."],
       ["If you're someone with more ideas than time,", "who's tired of overthinking,", "chasing new possibilities", "and struggling to follow through,", "I wrote this book with you in mind."],
       ["Inside, you'll discover the SELECT method", "and a 30-day follow-through programme", "to help you recognise what matters,", "choose a direction", "and take practical steps forward."],
       ["My book, The Life You Keep Planning,", "is available now for pre-order", "on Amazon Kindle."],
       ["The paperback is coming soon."],
       ["The official launch date is", "23 January 2027."],
       ["Ready to move from planning to doing?"],
       ["Find The Life You Keep Planning on Amazon."]]
caps = []
for s, parts in zip(out, CAP):
    tot = sum(len(p) for p in parts); c = s['o']
    for p in parts:
        d = s['d'] * len(p) / tot; caps.append({'text': p, 's': round(c - .03, 3), 'e': round(c + d - .02, 3)}); c += d
# the four keywords land on "discover", "recognise", "choose", "take practical steps" (proportional estimate)
s5 = out[5]; txt = SENT[5]
def wordt(w): return round(s5['o'] + s5['d'] * txt.index(w) / len(txt), 3)
kw = [wordt('discover'), wordt('recognise'), wordt('choose'), wordt('take practical')]
open('timeline.js', 'w').write('window.TL = ' + json.dumps({'duration': DUR, 'segs': out, 'avMap': avmap, 'caps': caps, 'words': kw}) + ';\n')
print('duration', DUR)
for i, s in enumerate(out): print(i, s, SENT[i][:50])
