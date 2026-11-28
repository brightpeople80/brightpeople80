const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const id of ['c1','c2','c3','end']){await p.goto('file://'+path.join(__dirname,'overlays.html')+'?id='+id);await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>Array.from(document.images).every(i=>i.complete));
await p.locator('.f').screenshot({path:path.join(__dirname,'ov-'+id+'.png'),omitBackground:id!=='end'});}
await b.close();})();
