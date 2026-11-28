#!/bin/bash
# E14 upgraded: original 0-57.0 s (voice only, no music) + new closing (offer, One-Project Card, link in bio)
set -e
cd "$(dirname "$0")"
T=$(mktemp -d); ENC="-c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -r 30"
ffmpeg -v error -y -i ../out/belinda-author-promo-9x16.mp4 -i ../audio/voice.wav -t 57.0 \
  -filter_complex "[0:v]fps=30,format=yuv420p[v];[1:a]atrim=0:57.0,afade=out:st=56.8:d=0.2,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]" \
  -map "[v]" -map "[a]" $ENC -c:a aac -b:a 192k -ar 48000 $T/p1.mp4
ffmpeg -v error -y -framerate 30 -i frames/%04d.png -i audio/voice-close.wav \
  -filter_complex "[0:v]format=yuv420p,fade=in:st=0:d=0.3[v];[1:a]aresample=48000,apad=whole_dur=15.2,atrim=0:15.2,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]" \
  -map "[v]" -map "[a]" -t 15.2 $ENC -c:a aac -b:a 192k -ar 48000 $T/p2.mp4
printf "file '%s'\n" $T/p1.mp4 $T/p2.mp4 > $T/list.txt
mkdir -p out
ffmpeg -v error -y -f concat -safe 0 -i $T/list.txt -c copy -movflags +faststart out/e14-author-promo-upgraded-9x16.mp4
rm -rf $T
ffprobe -v error -show_entries format=duration -of csv=p=0 out/e14-author-promo-upgraded-9x16.mp4
