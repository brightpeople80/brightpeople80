const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const id of ['badge','head','p1','p2','p3','p4']){await p.goto('file://'+path.join(__dirname,'addons.html')+'?id='+id);await p.evaluate(()=>document.fonts.ready);
await p.waitForFunction(()=>Array.from(document.images).every(i=>i.complete));
await p.locator('.f').screenshot({path:path.join(__dirname,'add',id+'.png'),omitBackground:true});}
await b.close();})();
