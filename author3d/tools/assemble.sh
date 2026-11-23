#!/bin/sh
# Builds video.html from src/. Run from anywhere.
cd "$(dirname "$0")/.." && cat src/head.html src/helpers.js src/scene.js > video.html
