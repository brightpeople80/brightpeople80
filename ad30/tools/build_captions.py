"""Writes compositions/captions.html from audio/timeline.json.

Each group lists (line id, first word, last word) plus a style:
  cap  - standard caption at the bottom of the safe band
  hero - the hook lines on the photos, large serif in the upper band
Display text can replace the spoken spelling (e.g. "thirty-day" -> "30-day").
Run from the project root: python3 tools/build_captions.py
"""
import json, html

TL = {l['id']: l for l in json.load(open('audio/timeline.json'))}
SHOW = {'thirty-day': '30-day', 'N.,': 'N.,', 'U.K.': 'UK.'}
STRIKE = {('lazy', 2), ('unmot', 2), ('ready', 5)}          # struck through in gold
GOLD_HOLD = {('ready', 8)}                                   # stays gold ("moving")

GROUPS = [
    ('hero', 'lazy', 0, 2), ('hero', 'unmot', 0, 2),
    ('cap', 'stuck', 0, 4), ('cap', 'stuck', 5, 7), ('cap', 'stuck', 8, 10),
    ('cap', 'notes', 0, 4), ('cap', 'notes', 5, 8), ('cap', 'notes', 9, 12), ('cap', 'notes', 13, 15),
    ('cap', 'foryou', 0, 4),
    ('cap', 'title', 0, 4), ('cap', 'title', 5, 8), ('cap', 'title', 9, 12), ('cap', 'title', 13, 15), ('cap', 'title', 16, 19),
    ('cap', 'inside', 0, 2), ('cap', 'inside', 3, 5), ('cap', 'inside', 6, 8), ('cap', 'inside', 9, 11), ('cap', 'inside', 12, 13),
    ('cap', 'ready', 0, 2), ('cap', 'ready', 3, 5), ('cap', 'ready', 6, 8), ('cap', 'ready', 9, 12),
]

def line_end(lid):
    l = TL[lid]; return l['start'] + l['dur']

groups = []
for gi, (style, lid, a, b) in enumerate(GROUPS):
    words = TL[lid]['words']
    ws = []
    for i in range(a, b + 1):
        t0 = words[i]['t']
        t1 = words[i + 1]['t'] if i + 1 < len(words) else line_end(lid)
        ws.append({'text': SHOW.get(words[i]['w'], words[i]['w']), 't0': t0, 't1': t1,
                   'strike': (lid, i) in STRIKE, 'hold': (lid, i) in GOLD_HOLD})
    start = max(0.0, ws[0]['t0'] - 0.1) if gi else 0.0      # the first hook line is on screen at frame 0
    groups.append({'id': f'cg{gi}', 'style': style, 'start': start, 'words': ws, 'lend': line_end(lid) if b == len(words) - 1 else ws[-1]['t1']})
for gi, g in enumerate(groups):
    nxt = groups[gi + 1]['start'] if gi + 1 < len(groups) else 99
    g['end'] = round(min(nxt - 0.02, g['lend'] + 0.35), 3)
    g['start'] = round(g['start'], 3)

out = ["""<template>
  <style>
    @font-face { font-family: "Source Serif 4"; font-style: italic; font-weight: 600; src: url("assets/fonts/SourceSerif4-italic.woff2") format("woff2"); }
    #root { position: absolute; inset: 0; pointer-events: none; }
    #root .grp { position: absolute; left: 120px; width: 660px; }
    #root .grp.cap { bottom: 680px; font: 800 62px/1.12 Montserrat, sans-serif; color: #ffffff;
      text-shadow: 0 3px 18px rgba(4, 12, 26, .85), 0 1px 3px rgba(4, 12, 26, .9); }
    #root .grp.hero { top: 330px; width: 768px; font: italic 600 118px/1.02 "Source Serif 4", serif; letter-spacing: -0.01em; color: #ffffff;
      text-shadow: 0 6px 40px rgba(4, 12, 26, .9), 0 2px 6px rgba(4, 12, 26, .8); }
    #root .w { display: inline-block; position: relative; }
    #root .strike { position: absolute; left: -3%; width: 106%; top: 52%; height: 0.11em; background: #fbc312; transform-origin: 0 50%; }
  </style>
  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">"""]
for g in groups:
    spans = []
    for wi, w in enumerate(g['words']):
        strike = f'<span class="strike" id="{g["id"]}-s{wi}"></span>' if w['strike'] else ''
        spans.append(f'<span class="w" id="{g["id"]}-w{wi}">{html.escape(w["text"])}{strike}</span>')
    dur = round(g['end'] - g['start'], 3)
    out.append(f'    <div id="{g["id"]}" class="grp {g["style"]} clip" data-start="{g["start"]}" data-duration="{dur}" data-track-index="1"><div id="{g["id"]}-in">{" ".join(spans)}</div></div>')
out.append("""  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    const G = """ + json.dumps([{'id': g['id'], 'start': g['start'], 'end': g['end'], 'words': [{'t0': w['t0'], 't1': w['t1'], 'strike': w['strike'], 'hold': w['hold']} for w in g['words']]} for g in groups]) + """;
    for (const g of G) {
      if (g.start > 0) tl.fromTo(`#${g.id}-in`, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.16, ease: "power3.out" }, g.start);
      g.words.forEach((w, i) => {
        const el = `#${g.id}-w${i}`;
        tl.fromTo(el, { opacity: g.start > 0 ? 0.4 : 1, color: "#ffffff" }, { opacity: 1, color: "#fbc312", duration: 0.06, ease: "none" }, Math.max(g.start, w.t0 - 0.03));
        if (!w.hold) tl.to(el, { color: "#ffffff", duration: 0.08, ease: "none" }, Math.max(w.t0 + 0.05, w.t1 - 0.03));
        if (w.strike) tl.fromTo(`#${g.id}-s${i}`, { scaleX: 0 }, { scaleX: 1, duration: 0.2, ease: "power3.out" }, w.t0 + 0.22);
      });
      tl.to(`#${g.id}-in`, { opacity: 0, duration: 0.1, ease: "power2.in" }, g.end - 0.1);
    }
    window.__timelines["captions"] = tl;
  </script>
</template>
""")
open('compositions/captions.html', 'w').write('\n'.join(out))
print(f'{len(groups)} caption groups, last ends {groups[-1]["end"]}s')
