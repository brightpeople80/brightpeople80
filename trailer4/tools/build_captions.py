"""Writes audio/captions.js (short caption phrases) from audio/timeline.json. Run from the project root."""
import json
TL = {l['id']: l for l in json.load(open('audio/timeline.json'))}
P = [('l1', 0, 4, 'It’s late, and you’re still scrolling.'), ('l2', 0, 3, 'Every option looks better'), ('l2', 4, 8, 'than the one you’re holding.'),
     ('l3', 0, 6, 'So you compare, you save, you wait,'), ('l3', 7, 9, 'and nothing gets chosen.'),
     ('l4', 0, 6, 'That’s the fear of missing something better.'),
     ('l5', 0, 7, 'Chapter 3 shows why choosing feels like losing,'), ('l5', 8, 15, 'so you can pick one path and walk it.'),
     ('l6', 0, 4, 'It’s one of eight chapters,'), ('l6', 5, 10, 'from why planning feels like progress,'), ('l6', 11, 19, 'to knowing when to persist, and when to pivot.'),
     ('l7', 0, 8, 'The Life You Keep Planning, by Belinda Bright N.'), ('l8', 0, 4, 'Pre-order now on Amazon UK.'), ('l9', 0, 3, 'Out 23 January 2027.')]
out = []
for lid, a, b, text in P:
    l = TL[lid]; w = l['words']
    end = w[b + 1]['t'] if b + 1 < len(w) else l['start'] + l['dur'] + .35
    out.append({'text': text, 's': round(w[a]['t'] - .05, 3), 'e': round(end, 3)})
for i in range(len(out) - 1): out[i]['e'] = round(min(out[i]['e'], out[i + 1]['s'] - .02), 3)
open('audio/captions.js', 'w').write('window.CAPS_DATA = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n')
print(len(out), 'captions')
