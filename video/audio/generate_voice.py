import sys, json, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro(sys.argv[1]+'/kokoro.onnx', sys.argv[1]+'/voices.bin')
voice, speed, out = sys.argv[2], float(sys.argv[3]), sys.argv[4]
lines = json.load(open(sys.argv[5]))
durs = []
for i, t in enumerate(lines):
    a, sr = k.create(t, voice=voice, speed=speed, lang='en-gb')
    sf.write(f'{out}/{voice}_{i}.wav', a, sr); durs.append(round(len(a)/sr, 2))
print(voice, durs, round(sum(durs),1))
