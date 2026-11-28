#!/bin/bash
# v3 = v2 full (56 s) + special-effect book reveal (31-43 s) + website quiz section (56-64 s)
set -e
cd "$(dirname "$0")"
BASE=out/museum-reel-full-9x16.mp4
T=$(mktemp -d)
ENC="-c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -r 30"
# 1: story up to the book line (video + audio unchanged)
ffmpeg -v error -y -i "$BASE" -t 31 -vf fps=30 $ENC -c:a aac -b:a 192k -ar 48000 $T/p1.mp4
# 2: book reveal over the last story frame, original audio 31-43
ffmpeg -v error -y -ss 30.95 -i "$BASE" -framerate 30 -i frames/reveal/%04d.png -ss 31 -t 12 -i "$BASE" \
 -filter_complex "[0:v]trim=end_frame=1,loop=loop=359:size=1:start=0,setpts=N/30/TB,fps=30,format=yuv420p[frz];[frz][1:v]overlay=0:0:format=auto,format=yuv420p[v]" \
 -map "[v]" -map 2:a -t 12 $ENC -c:a aac -b:a 192k -ar 48000 $T/p2.mp4
# 3: paperback, price and launch-date finale (unchanged)
ffmpeg -v error -y -ss 43 -i "$BASE" -t 13 -vf fps=30 $ENC -c:a aac -b:a 192k -ar 48000 $T/p3.mp4
# 4: website quiz section with the new voice line
ffmpeg -v error -y -framerate 30 -i frames/web/%04d.png -i audio/voice-belinda-website.wav \
 -filter_complex "[0:v]format=yuv420p[v];[1:a]aresample=48000,apad=whole_dur=8,atrim=0:8,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]" \
 -map "[v]" -map "[a]" -t 8 $ENC -c:a aac -b:a 192k -ar 48000 $T/p4.mp4
printf "file '%s'\n" $T/p1.mp4 $T/p2.mp4 $T/p3.mp4 $T/p4.mp4 > $T/list.txt
ffmpeg -v error -y -f concat -safe 0 -i $T/list.txt -c copy -movflags +faststart out/museum-reel-v3-9x16.mp4
rm -rf $T
ffprobe -v error -show_entries format=duration -of csv=p=0 out/museum-reel-v3-9x16.mp4
