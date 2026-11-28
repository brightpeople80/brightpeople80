// node render-anim.js <id> [fps] [frame...]  -> frames/<id>/%04d.png (RGBA)
const { chromium } = require('playwright'); const path=require('path'); const fs=require('fs');
(async()=>{const id=process.argv[2]; const fps=+(process.argv[3]||30); const only=process.argv.slice(4).map(Number);
const dir=path.join(__dirname,'frames',id); fs.mkdirSync(dir,{recursive:true});
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.join(__dirname,'anim.html')+'?id='+id); await p.evaluate(()=>window.ready);
const dur=await p.evaluate(()=>window.DUR); const n=Math.round(dur*fps);
const list=only.length?only:[...Array(n).keys()];
for(const i of list){ await p.evaluate(t=>window.render(t), i/fps);
  await p.screenshot({path:path.join(dir,String(i).padStart(4,'0')+'.png'),omitBackground:true}); }
await b.close(); console.log(id,'frames',list.length);})();
