"""Writes audio/captions.js from audio/timeline.json. Lines 7-8 are left out: the quote is on screen. Run from the project root."""
import json
TL = {l['id']: l for l in json.load(open('audio/timeline.json'))}
P = [('l1', 0, 7, 'There are people with dreams they haven’t forgotten,'), ('l1', 8, 12, 'ideas they still believe in,'), ('l1', 13, 19, 'and plans they’ve been meaning to start.'),
     ('l2', 0, 5, 'But somewhere between preparing and doing,'), ('l2', 6, 10, 'life gets in the way.'),
     ('l3', 0, 3, 'Meet Belinda Bright N.,'), ('l3', 4, 11, 'independent author of The Life You Keep Planning.'),
     ('l4', 0, 6, 'Her debut book explores why we overthink,'), ('l4', 7, 14, 'chase new ideas and struggle to follow through.'),
     ('l5', 0, 7, 'But it doesn’t stop at understanding the problem.'),
     ('l6', 0, 3, 'It introduces practical tools,'), ('l6', 4, 7, 'including the SELECT method'), ('l6', 8, 12, 'and a 30-day follow-through programme.'),
     ('l9', 0, 4, 'The Life You Keep Planning.'), ('l9', 5, 12, 'Available from 23 January 2027.'),
     ('l10', 0, 6, 'Discover the book on the author’s website,'), ('l10', 7, 14, 'or find the Kindle pre-order on Amazon UK.')]
out = []
for lid, a, b, text in P:
    l = TL[lid]; w = l['words']; assert b < len(w), (lid, b, len(w))
    end = w[b + 1]['t'] if b + 1 < len(w) else l['start'] + l['dur'] + .35
    out.append({'text': text, 's': round(w[a]['t'] - .05, 3), 'e': round(end, 3)})
for i in range(len(out) - 1): out[i]['e'] = round(min(out[i]['e'], out[i + 1]['s'] - .02), 3)
open('audio/captions.js', 'w').write('window.CAPS_DATA = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n')
print(len(out), 'captions')
