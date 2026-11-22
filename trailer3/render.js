// Renders trailer.html to MP4, frame by frame.
// Usage:
//   node render.js vertical            -> out/trailer-vertical-1080x1920.mp4
//   node render.js landscape           -> out/trailer-landscape-1920x1080.mp4
//   node render.js vertical --stills 3,8,12,17,22,27,33   -> PNG stills only
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const format = 'vertical';
const stillsArg = process.argv.indexOf('--stills');
const FPS = 30;
const [W, H] = format === 'landscape' ? [1920, 1080] : [1080, 1920];

(async () => {
  const outDir = path.join(__dirname, 'out');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const url = 'file://' + path.join(__dirname, 'trailer.html') + `?render=1&format=${format}`;
  page.on('pageerror', e => console.log('page exception:', e.message));
  await page.goto(url);
  page.on('console', m => { if (m.type() === 'error') console.log('page error:', m.text()); });
  await page.waitForFunction(() => window.READY);
  await page.evaluate(() => window.READY);
  const duration = await page.evaluate(() => window.DURATION);

  if (stillsArg > -1) {
    for (const t of process.argv[stillsArg + 1].split(',').map(Number)) {
      await page.evaluate(t => window.seek(t), t);
      await page.screenshot({ path: path.join(outDir, `still-${format}-${t}s.png`) });
    }
    await browser.close();
    return;
  }

  const outFile = path.join(outDir, `maya-trailer-vertical-1080x1920.mp4`);
  // soundtrack (voice + music) is muxed in when audio/soundtrack.wav exists
  const audio = path.join(__dirname, 'audio', 'soundtrack.wav');
  const audioArgs = fs.existsSync(audio) ? ['-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest'] : [];
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS),
    '-c:v', 'mjpeg', '-i', '-', ...audioArgs, '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-maxrate', '14M', '-bufsize', '28M', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });

  const total = Math.round(duration * FPS);
  for (let f = 0; f < total; f++) {
    await page.evaluate(t => window.seek(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`${format}: frame ${f}/${total}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('wrote', outFile);
})();
