"""Chapter 3 trailer. Builds audio/soundtrack.wav: narration + understated music + foley (brass click, paper, chair taps).
usage: python make_audio.py <voice_dir_with_wavs_and_timeline.json> [out.wav]
To use the final Joanna recording, place its sentence WAVs + timeline.json in a folder and pass that folder.
"""
import sys, json, numpy as np, soundfile as sf
from scipy import signal

SR, T = 48000, 34.0
N = int(SR * T)
rng = np.random.default_rng(11)
voice_dir = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else 'audio/soundtrack.wav'
tt = lambda d: np.arange(int(d * SR)) / SR
idx = lambda s: int(s * SR)
def bp(x, lo, hi, o=2): return signal.sosfilt(signal.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, 'high', fs=SR, output='sos'), x)

MUS = np.zeros((2, N)); FX = np.zeros((2, N))
def add(bus, x, at, gain=1.0, pan=0.0):
    i = idx(at); n = min(len(x), N - i)
    if n <= 0: return
    bus[0, i:i + n] += x[:n] * gain * np.sqrt((1 - pan) / 2) * 1.41
    bus[1, i:i + n] += x[:n] * gain * np.sqrt((1 + pan) / 2) * 1.41

# ---------- foley
def brass_click():                      # the campaign's signature sound
    t = tt(0.35)
    ring = sum(a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * np.exp(-t / d) for f, a, d in
               ((2150, .5, .05), (3420, .35, .035), (5230, .25, .025), (7940, .15, .015), (1180, .3, .07)))
    tick = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t / .004) * .6
    thunk = np.sin(2 * np.pi * 140 * t) * np.exp(-t / .03) * .5
    second = np.zeros_like(t); j = idx(.045); second[j:] = (ring[:len(t) - j] * .45)   # latch: two-part click
    return (ring + tick + thunk + second) * .6
def paper(d=.4):
    t = tt(d); n = rng.standard_normal(len(t))
    crk = (rng.random(len(t)) < .004).astype(float) * rng.uniform(.5, 1, len(t))
    crk = np.convolve(crk, np.exp(-np.arange(200) / 30), 'same')
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    return (bp(n, 900, 5500) * .35 + bp(crk * rng.standard_normal(len(t)), 1500, 7000) * 1.4) * env
def tap():
    t = tt(.18)
    return (np.sin(2 * np.pi * 620 * t) * .6 + np.sin(2 * np.pi * 1340 * t) * .25) * np.exp(-t / .028) + hp(rng.standard_normal(len(t)), 1800) * np.exp(-t / .006) * .4
def slide(d=.7):
    t = tt(d); env = np.sin(np.pi * np.clip(t / d, 0, 1))
    return lp(bp(rng.standard_normal(len(t)), 200, 2200), 1400) * env * .5
def pop():
    t = tt(.25); f = 380 + 900 * (1 - np.exp(-t / .03))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .05) * .35

for at in (5.45, 13.3, 15.2, 16.35, 19.06, 26.5, 29.0):
    add(FX, brass_click(), at, 1.0, pan=rng.uniform(-.2, .2))
for at in (2.85, 3.15, 3.45, 3.75, 4.05):
    add(FX, pop(), at, .55, pan=-.3)
for at in (6.0, 6.7, 7.3, 7.9, 8.4, 9.0, 9.5):          # doors peeking open
    add(FX, paper(.35), at, .45, pan=rng.uniform(-.5, .5))
for i, at in enumerate((15.0, 15.12, 15.24, 15.36)):  # the other doors fold flat
    add(FX, paper(.6), at, .75, pan=-.5 + i / 3)
add(FX, paper(.7), 16.35, .7); add(FX, paper(.5), 19.5, .6); add(FX, paper(.5), 25.75, .6)
for i in range(6):
    add(FX, tap(), 17.25 + (5 - i) * .14, .65, pan=.2)

# ---------- music: soft felt-piano plucks over a warm pad, 96 bpm
def note(m, d, bright=1.0):
    f = 440 * 2 ** ((m - 69) / 12); t = tt(d)
    x = sum(np.sin(2 * np.pi * f * h * t) * a * np.exp(-t / (d * dd)) for h, a, dd in ((1, 1, .5), (2, .35 * bright, .25), (3, .12 * bright, .15), (4, .05 * bright, .1)))
    return x * np.minimum(1, t / .006) * .3
def pad(ms, d):
    t = tt(d); x = sum(sum(signal.sawtooth(2 * np.pi * 440 * 2 ** ((m - 69) / 12) * (1 + det) * t) for det in (-.0025, .0025)) for m in ms)
    x = lp(x, 900); env = np.minimum(1, t / 1.0) * np.minimum(1, (d - t) / 1.0)
    return x * env * .025
BEAT = 60 / 96
prog = [[50, 57, 62, 65], [46, 53, 58, 62], [41, 48, 57, 60], [48, 55, 60, 64]]     # Dm  Bb  F  C
t0 = 0.3; bar = 4 * BEAT
for b in range(int((T - t0) / bar) + 1):
    at = t0 + b * bar; ch = prog[b % 4]
    if at > T: break
    add(MUS, pad(ch, bar + 1.2), at, 1.0)
    level = .5 if at < 19.0 else .8
    pattern = [0, 2, 1, 3, 2, 1, 3, 2] if at >= 4.0 else [0, 2, 1, 3]
    step = bar / len(pattern)
    for i, p in enumerate(pattern):
        add(MUS, note(ch[p] + 12, 1.2, .8), at + i * step, level * .9, pan=(-.35 if i % 2 else .35))
    if at >= 19.0:
        add(MUS, note(ch[0] - 12, bar * .95, .4), at, .9)
add(MUS, pad([50, 57, 62, 65, 69], 7.0), 26.4, 1.4)                 # resolve on the end card
for i, m in enumerate([74, 77, 81, 86]):
    add(MUS, note(m, 2.5), 26.5 + i * .12, .55, pan=-.3 + i * .2)

# reverb on music
ir_t = tt(2.4)
for ch in (0, 1):
    ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t / .55); ir[:idx(.015)] = 0; ir /= np.sqrt((ir ** 2).sum())
    MUS[ch] += signal.fftconvolve(MUS[ch], ir)[:N] * .3

# ---------- narration
timeline = json.load(open(f'{voice_dir}/timeline.json'))
vo = np.zeros(N); active = np.zeros(N)
for line in timeline:
    a, sr = sf.read(f'{voice_dir}/{line["id"]}.wav')
    if a.ndim > 1: a = a.mean(1)
    if sr != SR: a = signal.resample_poly(a, SR, sr)
    i = idx(line['start']); n = min(len(a), N - i); vo[i:i + n] += a[:n]; active[i:i + n] = 1
duck = signal.sosfiltfilt(signal.butter(1, 3, 'low', fs=SR, output='sos'), active)
def rms(x, m): return np.sqrt((x[m > .5] ** 2).mean())
v_rms = rms(vo, active)
mus = MUS * (1 - .45 * np.clip(duck, 0, 1))
mus *= v_rms * 10 ** (-17 / 20) / rms(mus.mean(0), active)          # music sits ~17 dB under Joanna
FX *= v_rms * 10 ** (-7 / 20) / max(1e-9, np.abs(FX).max() * .3)
fade = np.clip((T - np.arange(N) / SR) / 1.2, 0, 1)
mix = (mus + FX + vo[None, :]) * fade
mix = mix / np.abs(mix).max() * .89
sf.write(out, mix.T, SR, subtype='PCM_16')
print('wrote', out)
