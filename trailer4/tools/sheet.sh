#!/bin/sh
# usage: tools/sheet.sh out.png t1 t2 ... (stills must already exist in out/)
o=$1; shift; args=""; n=0
for t in "$@"; do args="$args -i out/still-vertical-${t}s.png"; n=$((n+1)); done
ffmpeg -v error -y $args -filter_complex "$(i=0; for t in "$@"; do printf "[$i:v]scale=360:640[s$i];"; i=$((i+1)); done; i=0; for t in "$@"; do printf "[s$i]"; i=$((i+1)); done; echo "hstack=$n")" $o
