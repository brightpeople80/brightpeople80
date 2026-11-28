const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
const base='file://'+__dirname+'/overlay.html';
for(const id of ['c1','c2','c3','c4','c5','c6']){await pg.goto(base+'?id='+id);await pg.waitForTimeout(300);await pg.screenshot({path:`png/${id}.png`,omitBackground:true});}
const caps=JSON.parse(fs.readFileSync('caps.json'));
for(let i=0;i<caps.length;i++){await pg.goto(base+'?cap='+encodeURIComponent(caps[i].text));await pg.waitForTimeout(150);await pg.screenshot({path:`png/cap${i}.png`,omitBackground:true});}
await b.close();})();
