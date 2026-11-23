"""Stand-in narration (Kokoro bf_emma) laid out with pauses; writes <out>/lN.wav + timeline.json with word times.
usage: python make_voice.py <model_dir> <out_dir>"""
import sys, json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
model_dir, out = sys.argv[1], sys.argv[2]
k = Kokoro(f'{model_dir}/kokoro.onnx', f'{model_dir}/voices.bin'); SR = 24000
here = __file__.rsplit('/', 1)[0]; lines = json.load(open(f'{here}/lines.json'))
PAUSE = {'l1': .55, 'l2': .7, 'l3': .55, 'l4': .5, 'l5': .3, 'l6': .7, 'l7': .3, 'l8': .8, 'l9': .5}
def tts(s): return k.create(s, voice='bf_emma', speed=1.0, lang='en-gb')[0]
def trim(a, thr=.012):
    i = np.where(np.abs(a) > thr)[0]; return (i[0], i[-1] + 1) if len(i) else (0, 0)
t = .4; tl = []
for ln in lines:
    a = tts(ln['text']); s, e = trim(a); a = a[max(0, s - 240):e + 1200]; dur = len(a) / SR
    w = ln['text'].split(); ends = []
    for i in range(1, len(w)):
        p = tts(' '.join(w[:i]).rstrip(',.?')); ps, pe = trim(p); ends.append(min((pe - ps) / SR, dur * .97))
    for i in range(1, len(ends)): ends[i] = max(ends[i], ends[i - 1] + .08)
    st = [0.] + [max(0., x - .04) for x in ends]
    sf.write(f'{out}/{ln["id"]}.wav', a, SR)
    tl.append({'id': ln['id'], 'text': ln['text'], 'start': round(t, 3), 'dur': round(dur, 3), 'words': [{'w': x, 't': round(t + y, 3)} for x, y in zip(w, st)]})
    print(ln['id'], round(t, 2), round(t + dur, 2)); t += dur + PAUSE.get(ln['id'], .5)
json.dump(tl, open(f'{out}/timeline.json', 'w'), indent=1)
