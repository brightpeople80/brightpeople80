"""16:9 Amazon ad: music and soft foley only. Builds audio/music.wav: narration + understated music + foley (brass click, paper, chair taps).
usage: python make_audio.py <voice_dir_with_wavs_and_timeline.json> [out.wav]
To use the final Joanna recording, place its sentence WAVs + timeline.json in a folder and pass that folder.
"""
import sys, json, numpy as np, soundfile as sf
from scipy import signal

SR, T = 48000, 25.0
N = int(SR * T)
rng = np.random.default_rng(11)
out = sys.argv[1] if len(sys.argv) > 1 else 'audio/music.wav'
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

add(FX, paper(.4), 5.5, .55)                                      # the sticky note lands
for i in range(10):                                                # pen strokes
    add(FX, tap(), 6.6 + i * .2, .12)
add(FX, brass_click(), 11.8, .8); add(FX, brass_click(), 18.2, .8)

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
    level = .55 if at < 11.8 else .8
    pattern = [0, 2, 1, 3, 2, 1, 3, 2] if at >= 4.0 else [0, 2, 1, 3]
    step = bar / len(pattern)
    for i, p in enumerate(pattern):
        add(MUS, note(ch[p] + 12, 1.2, .8), at + i * step, level * .9, pan=(-.35 if i % 2 else .35))
    if at >= 11.8:
        add(MUS, note(ch[0] - 12, bar * .95, .4), at, .9)
add(MUS, pad([50, 57, 62, 65, 69], 6.8), 18.2, 1.4)                 # resolve on the end card
for i, m in enumerate([74, 77, 81, 86]):
    add(MUS, note(m, 2.5), 18.3 + i * .12, .55, pan=-.3 + i * .2)

# reverb on music
ir_t = tt(2.4)
for ch in (0, 1):
    ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t / .55); ir[:idx(.015)] = 0; ir /= np.sqrt((ir ** 2).sum())
    MUS[ch] += signal.fftconvolve(MUS[ch], ir)[:N] * .3

# ---------- music only (no narration; muted-first ad)
mix = MUS + FX * (np.abs(MUS).max() / max(1e-9, np.abs(FX).max())) * .6
fade = np.clip((T - np.arange(N) / SR) / 2.5, 0, 1); mix = mix * fade
mix = mix / np.abs(mix).max() * .89
sf.write(out, mix.T, SR, subtype='PCM_16')
print('wrote', out)
