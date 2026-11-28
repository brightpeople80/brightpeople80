// Renders every frame in src/frames.html to out/<id>.jpg
// Usage: node render.js            (all frames)
//        node render.js p1-01 p2-03 (selected frames)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const src = 'file://' + path.join(__dirname, 'src', 'frames.html');
  const outDir = path.join(__dirname, 'out');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto(src);
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : await page.evaluate(() => window.FRAME_IDS);
  for (const id of ids) {
    await page.goto(src + '?id=' + id);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => Array.from(document.images).every(i => i.complete));
    const el = await page.$('.frame');
    await el.screenshot({ path: path.join(outDir, id + '.jpg'), type: 'jpeg', quality: 95 });
    console.log('rendered', id);
  }
  await browser.close();
})();
