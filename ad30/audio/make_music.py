"""Synthesises the trailer soundtrack (royalty-free, generated from scratch) and mixes it
with the voiceover produced by make_voice.py.

usage: python make_music.py <voice_dir> <out_wav>
"""
import sys, json, numpy as np, soundfile as sf
from scipy import signal

voice_dir, out_wav = sys.argv[1], sys.argv[2]
SR, T = 48000, 31.5
N = int(SR * T)
rng = np.random.default_rng(23)
L = np.zeros(N); R = np.zeros(N)          # music bus
FX_L = np.zeros(N); FX_R = np.zeros(N)    # impacts (not ducked)

def idx(t): return int(round(t * SR))
def tt(d): return np.arange(int(d * SR)) / SR
def lp(x, fc, order=2): return signal.sosfilt(signal.butter(order, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, order=2): return signal.sosfilt(signal.butter(order, fc, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return signal.sosfilt(signal.butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def midi(n): return 440 * 2 ** ((n - 69) / 12)

def add(x, t0, gain=1.0, pan=0.0, fx=False):
    a, b = (FX_L, FX_R) if fx else (L, R)
    i = idx(t0); j = min(N, i + len(x)); x = x[:j - i] * gain
    a[i:j] += x * np.sqrt(0.5 * (1 - pan)); b[i:j] += x * np.sqrt(0.5 * (1 + pan))

def adsr(n, a=.01, d=.1, s=.7, r=.2):
    e = np.ones(n) * s; A, D, Rr = int(a * SR), int(d * SR), int(r * SR)
    e[:A] = np.linspace(0, 1, A); e[A:A + D] = np.linspace(1, s, len(e[A:A + D]))
    if Rr: e[-Rr:] *= np.linspace(1, 0, Rr)
    return e

def saw(f, d, detune=0.0):
    t = tt(d); return signal.sawtooth(2 * np.pi * f * (2 ** (detune / 1200)) * t + rng.uniform(0, 6.28))

# ---------- elements ----------
def tick(hi=True):
    d = tt(0.06); ping = np.sin(2 * np.pi * (2300 if hi else 1750) * d) * np.exp(-d / 0.012)
    click = hp(rng.standard_normal(len(d)), 3000) * np.exp(-d / 0.003)
    return ping * 0.6 + click * 0.5

def whoosh(d=0.9):
    t = tt(d); n = rng.standard_normal(len(t))
    env = np.sin(np.pi * t / d) ** 3
    return bp(n, 400, 4000) * env

def kick(f0=120, f1=42, decay=0.32, d=0.6):
    t = tt(d); f = f1 + (f0 - f1) * np.exp(-t / 0.04)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(1.6 * np.sin(ph) * np.exp(-t / decay))

def boom(d=3.0):
    t = tt(d); f = 32 + 70 * np.exp(-t / 0.25)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(2.2 * np.sin(ph) * np.exp(-t / 1.1))

def crash(d=2.5, decay=0.8):
    t = tt(d); return hp(rng.standard_normal(len(t)), 4500) * np.exp(-t / decay)

def clap():
    t = tt(0.25); n = bp(rng.standard_normal(len(t)), 900, 3500)
    env = sum(np.exp(-np.clip(t - o, 0, None) / 0.008) * (t >= o) for o in (0, .011, .022)) + np.exp(-t / 0.07) * .6
    return n * env

def hat():
    t = tt(0.06); return hp(rng.standard_normal(len(t)), 8000) * np.exp(-t / 0.014)

def pad(notes, d):
    x = sum(saw(midi(n), d, det) for n in notes for det in (-8, 0, 7))
    return lp(x, 1600) * adsr(len(x), .35, .3, .8, .6) / (len(notes) * 3)

def pluck(n, d=0.4):
    x = saw(midi(n), d); t = tt(d)
    return lp(x, 2600) * np.exp(-t / 0.11)

def bass_note(n, d=0.25):
    t = tt(d); x = np.sin(2 * np.pi * midi(n) * t) + 0.3 * lp(saw(midi(n), d), 400)
    return x * adsr(len(t), .005, .08, .6, .05)

# ---------- A: clock + drone under the hook (0 – 6.4) ----------
for k, t0 in enumerate(np.arange(0.0, 3.1, 0.5)):
    add(tick(k % 2 == 0), t0, 0.2 + 0.02 * k, pan=-0.3 if k % 2 else 0.3)
for k, t0 in enumerate(np.arange(3.1, 6.45, 0.25)):
    add(tick(k % 2 == 0), t0, 0.3 + 0.012 * k, pan=-0.3 if k % 2 else 0.3)
d = 12.0; t = tt(d)
drone = sum(saw(f, d, det) for f in (55, 82.41, 110) for det in (-6, 6))
dark, bright = lp(drone, 220, 4), lp(drone, 1100, 4)
mixc = np.clip(t / 11.5, 0, 1) ** 1.5
drone = (dark * (1 - mixc) + bright * mixc) * np.clip(t / 1.2, 0, 1) * np.clip((12 - t) / 0.3, 0, 1) * 0.11
add(drone, 0.0)
add(boom(1.4), 0.74, 0.35, fx=True)                       # "lazy"
for t0, pan in ((1.38, 0.5), (3.0, -0.5), (6.5, 0.3)):    # photo cuts
    add(whoosh(0.8), t0, 0.3, pan)

# ---------- B: heartbeat + riser (6.5 – 12) ----------
for t0 in np.arange(6.6, 9.9, 0.8):
    add(kick(90, 40, .18, .4), t0, 0.5); add(kick(90, 40, .16, .4), t0 + 0.2, 0.32)
rd = 1.9; t = tt(rd)
riser = hp(rng.standard_normal(len(t)), 1500) * (t / rd) ** 3 * 0.5
f = 180 * (6 ** (t / rd)); riser += np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / rd) ** 2 * 0.25
riser[-int(.02 * SR):] *= np.linspace(1, 0, int(.02 * SR))
add(riser, 9.85, 0.5)
for t0 in list(np.arange(9.9, 10.9, 0.25)) + list(np.arange(10.9, 11.72, 0.125)):
    add(tick(True), t0, 0.26)
add(crash(0.4, 0.22)[::-1], 11.62, 0.45)

# ---------- C: drop on the title + uplifting section (12 – 30) ----------
DROP = 12.0
add(boom(3.0), DROP, 0.95, fx=True); add(crash(2.6, 0.9), DROP, 0.35, fx=True)
prog = [(48, [60, 64, 67, 72]), (43, [59, 62, 67, 71]), (45, [57, 60, 64, 69]), (41, [57, 60, 65, 69])]  # C G Am F
for bar, t0 in enumerate(np.arange(DROP, 30.0, 2.0)):
    root, notes = prog[bar % 4]
    add(pad(notes, 2.4), t0, 0.5)
    for e in range(8):
        add(bass_note(root - 12 if e % 2 == 0 else root, 0.24), t0 + e * 0.25, 0.32)
    if t0 >= DROP + 2:
        arp = [notes[0] + 12, notes[1] + 12, notes[2] + 12, notes[3] + 12, notes[2] + 12, notes[1] + 12, notes[3] + 12, notes[2] + 12]
        for e, n in enumerate(arp):
            add(pluck(n), t0 + e * 0.25, 0.16, pan=(-.4 if e % 2 else .4))
    for b in range(4):
        add(kick(), t0 + b * 0.5, 0.6)
        if t0 >= DROP + 4:
            add(hat(), t0 + b * 0.5 + 0.25, 0.12, pan=.25)
            if b in (1, 3): add(clap(), t0 + b * 0.5, 0.28)
for t0, pan in ((19.5, -.5), (20.25, .5), (21.55, -.3), (23.45, .3), (27.6, -.3)):   # feature cards + CTA
    add(whoosh(0.6), t0, 0.22, pan)

# ---------- D: final sting (30 –) ----------
add(boom(2.0), 30.0, 0.6, fx=True); add(crash(2.0, 0.9), 30.0, 0.28, fx=True)
add(pad([48, 60, 64, 67, 72], 1.6), 30.0, 0.65)

# ---------- reverb on music bus ----------
ir_t = tt(2.2)
for ch in (0, 1):
    ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t / 0.45); ir[:int(.012 * SR)] = 0; ir /= np.sqrt((ir ** 2).sum())
    bus = (L, R)[ch]; wet = signal.fftconvolve(bus, ir)[:N]
    bus += wet * 0.22

# ---------- voiceover ----------
timeline = json.load(open(f'{voice_dir}/timeline.json'))
vo = np.zeros(N); active = np.zeros(N)
for line in timeline:
    a, sr = sf.read(f'{voice_dir}/{line["id"]}.wav')
    a = signal.resample_poly(a, SR, sr)
    i = idx(line['start']); vo[i:i + len(a)] += a[:N - i]; active[i:i + len(a)] = 1
duck = signal.sosfiltfilt(signal.butter(1, 4, 'low', fs=SR, output='sos'), active)
gain = 1 - 0.5 * np.clip(duck, 0, 1)

def rms(x, m): return np.sqrt((x[m > 0.5] ** 2).mean())
music = np.stack([L * gain, R * gain]); fx = np.stack([FX_L, FX_R])
m_rms = rms(music.mean(0), active); v_rms = rms(vo, active)
music *= (v_rms * 10 ** (-12 / 20)) / m_rms     # music sits 12 dB under the voice while she speaks
fx *= (v_rms * 10 ** (-6 / 20)) / max(1e-9, np.abs(fx).max() * 0.3)
fade = np.clip((T - np.arange(N) / SR) / 0.8, 0, 1)
mix = (music + fx + vo[None, :]) * fade
mix = np.tanh(mix / np.abs(mix).max() * 1.2) * 0.9
sf.write(out_wav, mix.T, SR, subtype='PCM_16')
print('wrote', out_wav)
