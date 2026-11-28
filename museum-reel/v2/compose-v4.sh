#!/bin/bash
# v4 (QA fix, 28 Nov): same story, scenes, voice and wording as v3, with
#  - all text raised into the safe zone (end card, paperback finale, website section)
#  - end-card hold shortened (reveal 10.3 s instead of 12 s) to remove the dead air
#  - crossfade from the end card into the paperback finale instead of a dip to dark
set -e
cd "$(dirname "$0")"
BASE=out/museum-reel-full-9x16.mp4          # v2 build: 0-31 s story is reused unchanged
T=$(mktemp -d); ENC="-c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -r 30"
AENC="-c:a aac -b:a 192k -ar 48000"
# 1: story 0-31 s (unchanged)
ffmpeg -v error -y -i "$BASE" -t 31 -vf fps=30 $ENC $AENC $T/p1.mp4
# 2+3: book reveal (10.3 s, over the last story frame) crossfading into the paperback finale (13 s)
ffmpeg -v error -y \
 -ss 30.95 -i "$BASE" -framerate 30 -i frames/reveal/%04d.png -ss 31 -t 10.3 -i "$BASE" \
 -ss 2.5 -t 13 -i ../../ad30/assets/book3d.mp4 \
 -loop 1 -t 13 -i add/head.png -loop 1 -t 13 -i add/p1.png -loop 1 -t 13 -i add/p2.png -loop 1 -t 13 -i add/p3.png -loop 1 -t 13 -i add/p4.png \
 -i audio/voice-belinda-prices.wav \
 -filter_complex "\
[0:v]trim=end_frame=1,loop=loop=308:size=1:start=0,setpts=N/30/TB,fps=30,format=yuv420p[frz];\
[frz][1:v]overlay=0:0:format=auto,trim=duration=10.3,setpts=PTS-STARTPTS,format=yuv420p,setsar=1[rv];\
[3:v]scale=1080:1920,setsar=1,fps=30,trim=duration=13,setpts=PTS-STARTPTS,format=yuv420p[b0];\
[4:v]format=rgba,fade=in:st=0.2:d=0.5:alpha=1[hd];\
[5:v]format=rgba,fade=in:st=0.3:d=0.25:alpha=1,fade=out:st=2.85:d=0.25:alpha=1[q1];\
[6:v]format=rgba,fade=in:st=3.1:d=0.25:alpha=1,fade=out:st=6.55:d=0.25:alpha=1[q2];\
[7:v]format=rgba,fade=in:st=6.9:d=0.25:alpha=1,fade=out:st=10.35:d=0.25:alpha=1[q3];\
[8:v]format=rgba,fade=in:st=10.7:d=0.3:alpha=1[q4];\
[b0][hd]overlay=0:0[b1];[b1][q1]overlay=0:0:enable='between(t,0.3,3.1)'[b2];[b2][q2]overlay=0:0:enable='between(t,3.1,6.8)'[b3];\
[b3][q3]overlay=0:0:enable='between(t,6.9,10.6)'[b4];[b4][q4]overlay=0:0:enable='gte(t,10.7)',format=yuv420p,setsar=1[fin];\
[rv][fin]xfade=transition=fade:duration=0.5:offset=9.8,format=yuv420p[v];\
[2:a]aresample=48000,atrim=0:9.8,asetpts=PTS-STARTPTS[a1];\
[9:a]aresample=48000,apad=whole_dur=13,atrim=0:13,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a2];\
[a1][a2]concat=n=2:v=0:a=1[a]" \
 -map "[v]" -map "[a]" $ENC $AENC $T/p23.mp4
# 4: website quiz section
ffmpeg -v error -y -framerate 30 -i frames/web/%04d.png -i audio/voice-belinda-website.wav \
 -filter_complex "[0:v]format=yuv420p[v];[1:a]aresample=48000,apad=whole_dur=8,atrim=0:8,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]" \
 -map "[v]" -map "[a]" -t 8 $ENC $AENC $T/p4.mp4
printf "file '%s'\n" $T/p1.mp4 $T/p23.mp4 $T/p4.mp4 > $T/list.txt
ffmpeg -v error -y -f concat -safe 0 -i $T/list.txt -c copy -movflags +faststart out/museum-reel-v4-9x16.mp4
rm -rf $T
ffprobe -v error -show_entries format=duration -of csv=p=0 out/museum-reel-v4-9x16.mp4
