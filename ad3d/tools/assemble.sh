#!/bin/sh
cd "$(dirname "$0")/.." && cat src/head.html src/helpers.js src/scene.js > ad.html
