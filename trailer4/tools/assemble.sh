#!/bin/sh
# Builds trailer.html from src/ (page shell + shared 3D helpers + scene). Run from the project root.
cd "$(dirname "$0")/.." && cat src/head.html src/helpers.js src/scene.js > trailer.html
