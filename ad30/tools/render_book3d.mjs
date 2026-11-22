// Pre-renders the 3D book scene (tools/book3d-scene.html) to assets/book3d.mp4,
// so the HyperFrames render plays it as video instead of drawing WebGL per frame.
// usage (from the project root): node tools/render_book3d.mjs
import { createRequire } from 'module';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = process.cwd(), FPS = 30, DUR = 24.9;
// run the scene from the project root so its asset paths resolve
const tmp = path.join(root, '_book3d_tmp.html');
fs.writeFileSync(tmp, fs.readFileSync(path.join(root, 'tools/book3d-scene.html'), 'utf8'));
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.log('page exception:', e.message));
await page.addInitScript({ path: path.join(root, 'assets/vendor/gsap.min.js') });
await page.addInitScript(() => { window.__timelines = {}; });
await page.goto('file://' + tmp);
await page.waitForFunction(() => window.__hf && window.__hf.buildReady && window.__hf.buildReady.book);
await page.evaluate(() => window.__hf.buildReady.book);
await page.evaluate(() => { document.getElementById('book-flash').style.display = 'none'; });
const out = path.join(root, 'assets/book3d.mp4');
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const canvas = await page.$('#book-canvas');
const total = Math.round(DUR * FPS);
for (let f = 0; f < total; f++) {
  await page.evaluate(t => window.__bookScene.render(t), f / FPS);
  const buf = await canvas.screenshot({ type: 'jpeg', quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 90 === 0) console.log(`book3d: frame ${f}/${total}`);
}
ff.stdin.end(); await new Promise(r => ff.on('close', r));
await browser.close(); fs.unlinkSync(tmp);
console.log('wrote', out);
