// Renders the HeyGen author promo. node render.js [--stills 3,9,15]
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path');
const si = process.argv.indexOf('--stills');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('page exception:', e.message));
  await p.goto('file://' + path.join(__dirname, 'video.html') + '?render=1'); await p.waitForFunction(() => window.READY); await p.evaluate(() => window.READY);
  const D = await p.evaluate(() => window.DURATION);
  if (si > -1) { for (const t of process.argv[si + 1].split(',').map(Number)) { await p.evaluate(t => window.seek(t), t); await p.screenshot({ path: path.join(__dirname, 'out', `still-${t}s.png`) }); } await b.close(); return; }
  const out = path.join(__dirname, 'out', 'belinda-author-promo-9x16.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-i', path.join(__dirname, 'audio', 'mix.wav'),
    '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-maxrate', '14M', '-bufsize', '28M', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.round(D * 30);
  for (let f = 0; f < N; f++) { await p.evaluate(t => window.seek(t), f / 30); const buf = await p.screenshot({ type: 'jpeg', quality: 95 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); if (f % 300 === 0) console.log(`frame ${f}/${N}`); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('wrote', out);
})();
