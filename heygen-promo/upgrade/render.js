// node render.js [fps] [frame...] -> frames/%04d.png
const { chromium } = require('playwright'); const path=require('path'); const fs=require('fs');
(async()=>{const fps=+(process.argv[2]||30); const only=process.argv.slice(3).map(Number);
const dir=path.join(__dirname,'frames'); fs.mkdirSync(dir,{recursive:true});
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.join(__dirname,'close.html')); await p.evaluate(()=>window.ready);
const n=Math.round(await p.evaluate(()=>window.DUR)*fps); const list=only.length?only:[...Array(n).keys()];
for(const i of list){await p.evaluate(t=>window.render(t),i/fps); await p.screenshot({path:path.join(dir,String(i).padStart(4,'0')+'.png')});}
await b.close(); console.log('frames',list.length);})();
