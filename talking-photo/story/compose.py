"""Compose the story version: original talking-photo video + story cards + captions (voice unchanged)."""
import json,subprocess
caps=json.load(open('caps.json'))
cards=[('c1',0,4.95),('c2',4.99,7.15),('c3',7.17,14.75),('c4',14.89,18.70),('c5',18.77,21.85),('c6',22.05,27.8)]
inp=['-i','../talking-photo-raw.mp4']; f=[]
f.append("[0:v]split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:3,eq=brightness=-0.12[bg];[b]scale=900:1125[fg];[bg][fg]overlay=90:560,fps=30[v0]")
k=0;n=1
for id,s,e in cards:
    inp+=['-loop','1','-t','28','-i',f'png/{id}.png']
    f.append(f"[{n}:v]format=rgba,fade=in:st={s}:d=0.25:alpha=1[o{n}];[v{k}][o{n}]overlay=0:0:enable='between(t,{s},{e})'[v{k+1}]"); k+=1;n+=1
for i,c in enumerate(caps):
    inp+=['-loop','1','-t','28','-i',f'png/cap{i}.png']
    f.append(f"[v{k}][{n}:v]overlay=0:0:enable='between(t,{c['s']},{c['e']})'[v{k+1}]"); k+=1;n+=1
f.append(f"[v{k}]format=yuv420p[vout];[0:a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[aout]")
subprocess.run(['ffmpeg','-v','error','-y']+inp+['-filter_complex',';'.join(f),'-map','[vout]','-map','[aout]','-t','27.8','-c:v','libx264','-crf','19','-preset','medium','-c:a','aac','-b:a','192k','-movflags','+faststart','../talking-photo-56days-story-9x16.mp4'],check=True)
