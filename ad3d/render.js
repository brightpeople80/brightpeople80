// Renders the surreal ad. Usage:
//   node render.js feed|story            -> out/ad-<format>.mp4 (8 s, silent)
//   node render.js feed|story --still 7.9 -> out/ad-<format>.png (one frame)
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path'); const fs = require('fs');
const fmt = process.argv[2] || 'feed', stillAt = process.argv.indexOf('--still') > -1 ? +process.argv[process.argv.indexOf('--still') + 1] : null;
const [W, H] = fmt === 'story' ? [1080, 1920] : [1080, 1350], FPS = 30;
(async () => {
  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: W, height: H } });
  p.on('pageerror', e => console.log('page exception:', e.message));
  await p.goto('file://' + path.join(__dirname, 'ad.html') + `?render=1&format=${fmt}`); await p.waitForFunction(() => window.READY); await p.evaluate(() => window.READY);
  if (stillAt !== null) { await p.evaluate(t => window.seek(t), stillAt); await p.screenshot({ path: path.join(__dirname, 'out', `ad-${fmt}.png`) }); await b.close(); return; }
  const out = path.join(__dirname, 'out', `ad-${fmt}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const total = Math.round(8 * FPS);
  for (let f = 0; f < total; f++) { await p.evaluate(t => window.seek(t), f / FPS); const buf = await p.screenshot({ type: 'jpeg', quality: 95 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('wrote', out);
})();
