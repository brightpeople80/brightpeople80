const { chromium } = require('playwright'); const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.join(__dirname,'captions.html')); const ids=await p.evaluate(()=>window.IDS);
for(const id of ids){await p.goto('file://'+path.join(__dirname,'captions.html')+'?id='+id);await p.evaluate(()=>document.fonts.ready);
await p.locator('.f').screenshot({path:path.join(__dirname,'cap',id+'.png'),omitBackground:true});}
await b.close();})();
