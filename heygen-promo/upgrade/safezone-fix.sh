#!/bin/bash
# QA fix for E14: original part (0-57 s) scaled to 82% and lifted so captions sit inside the safe zone,
# blurred fill behind, book badge 4.3-39.8 s. The new ending (57 s on) is already compliant and is kept.
set -e
cd "$(dirname "$0")"
IN=out/e14-author-promo-upgraded-9x16.mp4
T=$(mktemp -d); ENC="-c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -r 30"
ffmpeg -v error -y -i $IN -loop 1 -t 57 -i qa/badge-right.png -t 57 -filter_complex "\
[0:v]trim=0:57,setpts=PTS-STARTPTS,split[a][b];\
[a]scale=1080:1920,boxblur=40:2,eq=brightness=-0.18[bg];[b]scale=886:1574[fg];[bg][fg]overlay=97:40[m];\
[1:v]format=rgba,fade=in:st=4.3:d=0.4:alpha=1,fade=out:st=39.4:d=0.4:alpha=1[bd];\
[m][bd]overlay=0:0:enable='between(t,4.3,39.8)',format=yuv420p[v]" \
 -map "[v]" -map 0:a $ENC -c:a aac -b:a 192k -ar 48000 $T/p1.mp4
ffmpeg -v error -y -ss 57 -i $IN $ENC -c:a aac -b:a 192k -ar 48000 $T/p2.mp4
printf "file '%s'\n" $T/p1.mp4 $T/p2.mp4 > $T/list.txt
ffmpeg -v error -y -f concat -safe 0 -i $T/list.txt -c copy -movflags +faststart out/e14-author-promo-qa-9x16.mp4
rm -rf $T
ffprobe -v error -show_entries format=duration -of csv=p=0 out/e14-author-promo-qa-9x16.mp4
