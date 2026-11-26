"""Original warm acoustic bed for the announcement reel: Karplus-Strong plucked guitar, a soft pad,
a light shaker and a gentle kick from bar 3. 84 bpm, G - D - Em - C, resolving on G at the end.
usage: python make_music.py <seconds> <out.wav>"""
import sys, numpy as np, soundfile as sf
from scipy import signal
T = float(sys.argv[1]); out = sys.argv[2]
SR = 48000; N = int(SR * T); rng = np.random.default_rng(5)
L = np.zeros(N); R = np.zeros(N)
def add(x, at, g=1.0, pan=0.0):
    i = int(at * SR); n = min(len(x), N - i)
    if n <= 0: return
    L[i:i + n] += x[:n] * g * np.sqrt((1 - pan) / 2) * 1.41; R[i:i + n] += x[:n] * g * np.sqrt((1 + pan) / 2) * 1.41
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
def pluck(m, d=2.6, bright=.5):                       # Karplus-Strong string
    f = hz(m); p = int(SR / f); n = int(d * SR)
    buf = rng.uniform(-1, 1, p) * signal.windows.hann(p) ** .2; y = np.zeros(n); y[:p] = buf
    for i in range(p, n): y[i] = .996 * (bright * y[i - p] + (1 - bright) * y[i - p - 1] if i - p - 1 >= 0 else y[i - p])
    body = signal.sosfilt(signal.butter(2, [90, 3800], 'band', fs=SR, output='sos'), y)
    return body * np.exp(-np.arange(n) / SR / 1.6) * .5
cache = {}
def P(m):
    if m not in cache: cache[m] = pluck(m)
    return cache[m]
def pad(ms, d):
    t = np.arange(int(d * SR)) / SR
    x = sum(sum(np.sin(2 * np.pi * hz(m) * (1 + det) * t) for det in (-.002, .002)) for m in ms)
    return x * np.minimum(1, t / 1.5) * np.minimum(1, (d - t) / 1.5) * .018
def shaker():
    n = int(.09 * SR); x = signal.sosfilt(signal.butter(2, 5000, 'high', fs=SR, output='sos'), rng.standard_normal(n))
    return x * np.sin(np.pi * np.arange(n) / n) ** 2 * .05
def kick():
    t = np.arange(int(.35 * SR)) / SR; f = 50 + 70 * np.exp(-t / .04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .16) * .35
BEAT = 60 / 84; BAR = 4 * BEAT
prog = [[43, 55, 59, 62, 67], [38, 54, 57, 62, 66], [40, 55, 59, 64, 67], [36, 52, 55, 60, 64]]   # G D Em C (voiced for guitar)
patt = [0, 2, 3, 4, 1, 3, 4, 3]
bars = int(np.ceil((T - 1.5) / BAR))
for b in range(bars):
    t0 = .3 + b * BAR; ch = prog[b % 4]
    if t0 > T - 2.5: break
    add(pad(ch[1:], BAR + 1.6), t0, 1.0)
    for i, p in enumerate(patt):
        add(P(ch[p]), t0 + i * BEAT / 2, .55 if i else .7, pan=(-.25 if i % 2 else .25))
    if b >= 2:
        for i in range(8): add(shaker(), t0 + i * BEAT / 2 + .02, .9 if i % 2 else .55, pan=.35)
        add(kick(), t0, .8); add(kick(), t0 + 2 * BEAT, .6)
end = .3 + min(bars, int((T - 2.5 - .3) // BAR) + 1) * BAR
add(pad([55, 59, 62, 67], T - end + .5), end, 1.3)            # resolve on G under the end card
for i, m in enumerate([55, 59, 62, 67, 71]): add(P(m), end + i * .09, .55, pan=-.3 + i * .15)
for ch_ in (L, R):                                            # small room
    ir = rng.standard_normal(int(1.6 * SR)) * np.exp(-np.arange(int(1.6 * SR)) / SR / .35); ir[:int(.01 * SR)] = 0; ir /= np.sqrt((ir ** 2).sum())
    ch_ += signal.fftconvolve(ch_, ir)[:N] * .22
mix = np.stack([L, R]); mix *= np.clip((T - np.arange(N) / SR) / 1.8, 0, 1)
mix = mix / np.abs(mix).max() * .89
sf.write(out, mix.T, SR, subtype='PCM_16'); print('wrote', out)
