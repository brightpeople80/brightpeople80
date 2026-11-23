"""Generate the voiceover with Kokoro TTS and estimate per-word timings.

Word timing: Kokoro returns audio only, so each sentence is also synthesised as growing
prefixes ("A", "A notebook", ...). The trimmed length of each prefix approximates where
that word ends inside the full sentence.
usage: python make_voice.py <model_dir> <out_dir>
"""
import sys, json, re, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

model_dir, out_dir = sys.argv[1], sys.argv[2]
VOICE, SPEED, SR = __import__('os').environ.get('VOICE', 'bf_emma'), float(sys.argv[3]) if len(sys.argv) > 3 else 1.08, 24000
k = Kokoro(f'{model_dir}/kokoro.onnx', f'{model_dir}/voices.bin')
here = __file__.rsplit('/', 1)[0]
script = json.load(open(f'{here}/script.json'))

def tts(text):
    a, sr = k.create(text, voice=VOICE, speed=SPEED, lang='en-gb')
    return a

def trim(a, thr=0.012):
    idx = np.where(np.abs(a) > thr)[0]
    return (idx[0], idx[-1] + 1) if len(idx) else (0, 0)

timeline, cursor = [], 0.0
for line in script:
    full = tts(line['text'])
    s, e = trim(full)
    full = full[max(0, s - 240):e + 1200]          # 10ms lead-in, 50ms tail
    dur = len(full) / SR
    words = line['text'].split()
    ends = []
    for i in range(1, len(words)):
        pre = tts(' '.join(words[:i]).rstrip(',.?'))
        ps, pe = trim(pre)
        ends.append((pe - ps) / SR)
    # normalise prefix ends so they stay monotonic and inside the sentence
    ends = [min(x, dur * 0.97) for x in ends]
    for i in range(1, len(ends)):
        ends[i] = max(ends[i], ends[i - 1] + 0.08)
    starts = [0.0] + [max(0.0, x - 0.04) for x in ends]
    at = line['at']
    sf.write(f'{out_dir}/{line["id"]}.wav', full, SR)
    timeline.append({'id': line['id'], 'text': line['text'], 'start': round(at, 3), 'dur': round(dur, 3),
                     'words': [{'w': w, 't': round(at + st, 3)} for w, st in zip(words, starts)]})
    cursor = at + dur
    print(f"{line['id']:9s} {at:6.2f} -> {cursor:6.2f}")
json.dump(timeline, open(f'{out_dir}/timeline.json', 'w'), indent=1)
