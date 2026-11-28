#!/bin/bash
# v3 = v2 full (56 s) + special-effect book reveal (31-43 s) + website quiz section (56-64 s)
set -e
cd "$(dirname "$0")"
BASE=out/museum-reel-full-9x16.mp4
ffmpeg -v error -y \
 -i "$BASE" \
 -ss 30.95 -i "$BASE" \
 -framerate 30 -i frames/reveal/%04d.png \
 -framerate 30 -i frames/web/%04d.png \
 -i audio/voice-belinda-website.wav \
 -filter_complex "\
[0:v]trim=0:31,setpts=PTS-STARTPTS,fps=30,format=yuv420p[p1];\
[1:v]trim=end_frame=1,loop=loop=359:size=1:start=0,setpts=N/30/TB,fps=30,format=yuv420p[frz];\
[frz][2:v]overlay=0:0:format=auto,format=yuv420p[p2];\
[0:v]trim=43:56,setpts=PTS-STARTPTS,fps=30,format=yuv420p[p3];\
[3:v]format=yuv420p,fps=30[p4];\
[0:a]atrim=0:56,asetpts=PTS-STARTPTS,aresample=48000[a1];\
[4:a]aresample=48000,apad=whole_dur=8,atrim=0:8,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a2];\
[p1][p2][p3][p4]concat=n=4:v=1:a=0[v];[a1][a2]concat=n=2:v=0:a=1[a]" \
 -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart \
 out/museum-reel-v3-9x16.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 out/museum-reel-v3-9x16.mp4
