"""Writes audio/captions.js (short caption phrases) from audio/timeline.json.
Run from the project root after the narration timing changes: python3 tools/build_captions.py"""
import json
TL = {l['id']: l for l in json.load(open('audio/timeline.json'))}
# (line id, first word, last word, display text)
P = [('l1', 0, 4, "People liked Maya’s meal idea."), ('l2', 0, 4, 'Would they pay for it?'),
     ('l3', 0, 3, 'The price didn’t work.'), ('l4', 0, 3, 'But two people asked,'), ('l4', 4, 7, '“Could you teach us?”'),
     ('l5', 0, 4, 'So Maya set a test:'), ('l5', 5, 10, 'could she get eight paid bookings'), ('l5', 11, 13, 'for one workshop?'),
     ('l6', 0, 4, 'The Life You Keep Planning'), ('l6', 5, 11, 'shows you how to test an idea,'), ('l6', 12, 15, 'move one project forward'),
     ('l6', 16, 18, 'over 30 days,'), ('l6', 19, 23, 'and learn as you go.'),
     ('l7', 0, 3, 'Take the free quiz'), ('l7', 4, 7, 'on the book website.')]
out = []
for i, (lid, a, b, text) in enumerate(P):
    l = TL[lid]; w = l['words']
    s = w[a]['t']; end = w[b + 1]['t'] if b + 1 < len(w) else l['start'] + l['dur'] + .35
    out.append({'text': text, 's': round(s - .05, 3), 'e': round(end, 3)})
for i in range(len(out) - 1): out[i]['e'] = round(min(out[i]['e'], out[i + 1]['s'] - .02), 3)
open('audio/captions.js', 'w').write('window.CAPS_DATA = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n')
print(len(out), 'captions')
