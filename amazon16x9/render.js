// Renders the 16:9 ad. node render.js [prices|noprices] [--stills 3,9]
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path'); const fs = require('fs');
const v = process.argv[2] || 'prices', si = process.argv.indexOf('--stills');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', e => console.log('page exception:', e.message));
  await p.goto('file://' + path.join(__dirname, 'ad.html') + `?render=1&prices=${v === 'noprices' ? 0 : 1}`); await p.waitForFunction(() => window.READY); await p.evaluate(() => window.READY);
  if (si > -1) { for (const t of process.argv[si + 1].split(',').map(Number)) { await p.evaluate(t => window.seek(t), t); await p.screenshot({ path: path.join(__dirname, 'out', `still-${v}-${t}s.png`) }); } await b.close(); return; }
  const audio = path.join(__dirname, 'audio', 'music.wav'), out = path.join(__dirname, 'out', `way-to-begin-16x9-${v}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-maxrate', '16M', '-bufsize', '32M', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < 750; f++) { await p.evaluate(t => window.seek(t), f / 30); const buf = await p.screenshot({ type: 'jpeg', quality: 95 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('wrote', out);
})();
