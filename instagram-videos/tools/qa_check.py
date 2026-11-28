#!/usr/bin/env python3
"""Automated QA for an Instagram Reel (gold-standard gates and production checks).

Usage:  python3 instagram-videos/tools/qa_check.py VIDEO.mp4 [--sheet OUT.jpg]

Checks (pass/fail):
  G3 format        1080x1920, H.264 + AAC, 30 fps
  G3 safe zone     no caption/text pixels below y=1440 (white text scan every 0.5 s)
  P2 loudness      mean volume between -18 and -14 dB, peak below -1 dB
  P6 length        45-65 s (warning if outside)
  tech black       no black frames longer than 0.3 s
  tech silence     no silence longer than 1.5 s inside the video
Writes a contact sheet (a frame every 2.5 s, safe-zone line in green) for the visual review.
The remaining scorecard points (F1-F7, P1, P3-P5) are judged by a person against the brief.
"""
import json, re, subprocess, sys
from PIL import Image, ImageDraw

SAFE_Y = 1440


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def frame(path, t, out):
    run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t}', '-i', path, '-frames:v', '1', out])
    return Image.open(out).convert('RGB')


def lowest_text_row(im):
    for y in range(1900, 1000, -4):
        if sum(1 for x in range(40, 1040, 8) if sum(im.getpixel((x, y))) > 690) > 3:
            return y
    return 0


def main():
    path = sys.argv[1]
    sheet_path = sys.argv[sys.argv.index('--sheet') + 1] if '--sheet' in sys.argv else '/tmp/qa-sheet.jpg'
    info = json.loads(run(['ffprobe', '-v', 'error', '-show_entries',
                           'stream=codec_type,codec_name,width,height,r_frame_rate:format=duration',
                           '-of', 'json', path]).stdout)
    v = next(s for s in info['streams'] if s['codec_type'] == 'video')
    a = next((s for s in info['streams'] if s['codec_type'] == 'audio'), None)
    dur = float(info['format']['duration'])
    res = []
    res.append(('G3 format', v['width'] == 1080 and v['height'] == 1920 and v['codec_name'] == 'h264'
                and a is not None and a['codec_name'] == 'aac' and v['r_frame_rate'] == '30/1',
                f"{v['width']}x{v['height']} {v['codec_name']}/{a['codec_name'] if a else 'no audio'} {v['r_frame_rate']}"))
    low, at = 0, 0
    t = 0.0
    while t < dur:
        y = lowest_text_row(frame(path, t, '/tmp/qa_f.png'))
        if y > low:
            low, at = y, t
        t += 0.5
    res.append(('G3 safe zone', low <= SAFE_Y, f'lowest text row {low}px at {at:.1f}s (limit {SAFE_Y})'))
    vd = run(['ffmpeg', '-i', path, '-af', 'volumedetect', '-f', 'null', '-']).stderr
    mean = float(re.search(r'mean_volume: ([-\d.]+)', vd).group(1))
    peak = float(re.search(r'max_volume: ([-\d.]+)', vd).group(1))
    res.append(('P2 loudness', -18 <= mean <= -14 and peak <= -1.0, f'mean {mean} dB, peak {peak} dB'))
    res.append(('P6 length', 45 <= dur <= 65, f'{dur:.1f}s (target 45-65)'))
    bd = run(['ffmpeg', '-i', path, '-vf', 'blackdetect=d=0.3:pix_th=0.05', '-an', '-f', 'null', '-']).stderr
    res.append(('tech black', 'black_start' not in bd, f"{bd.count('black_start')} black segments"))
    sd = run(['ffmpeg', '-i', path, '-af', 'silencedetect=n=-45dB:d=1.5', '-f', 'null', '-']).stderr
    starts = [float(x) for x in re.findall(r'silence_start: ([-\d.]+)', sd)]
    inner = [s for s in starts if 0.5 < s < dur - 2.0]
    res.append(('tech silence', not inner, f'silences >1.5s inside: {inner}'))
    W, H = 135, 240
    ts = [i * 2.5 + 0.5 for i in range(int(dur // 2.5) + 1) if i * 2.5 + 0.5 < dur]
    cols = 10
    sheet = Image.new('RGB', (cols * (W + 4), ((len(ts) + cols - 1) // cols) * (H + 18)), 'white')
    d = ImageDraw.Draw(sheet)
    for k, t in enumerate(ts):
        im = frame(path, t, '/tmp/qa_f.png').resize((W, H))
        ImageDraw.Draw(im).line((0, SAFE_Y * H // 1920, W, SAFE_Y * H // 1920), fill=(0, 255, 0), width=1)
        x, y = (k % cols) * (W + 4), (k // cols) * (H + 18)
        sheet.paste(im, (x, y))
        d.text((x + 2, y + H + 2), f'{t:.1f}s', fill='black')
    sheet.save(sheet_path, quality=90)
    for name, ok, detail in res:
        flag = 'PASS' if ok else ('WARN' if name in ('P6 length', 'tech silence') else 'FAIL')
        print(f'{flag:4}  {name:13} {detail}')
    print('contact sheet:', sheet_path)


if __name__ == '__main__':
    main()
