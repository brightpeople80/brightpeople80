
// ------------------------------------------------------------------ 3D: a blank notebook, one sticky note, then the book
scene.fog = null; scene.background = new THREE.Color('#0a1729');
const B = {};
async function build() {
  await Promise.all(['700 80px Caveat', '800 40px Montserrat', '600 40px "Source Serif 4"'].map(f => document.fonts.load(f)));
  const [frontT, spineT, backT] = await Promise.all(['assets/front-cover.png', 'assets/spine.png', 'assets/back-cover.png'].map(loadTex));
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), M.table); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  // an open notebook with blank ruled pages and a brass spiral
  const pageT = canvasTex(700, 940, (g, w, h) => { grain(g, w, h, '#f4eddc', 6); g.strokeStyle = 'rgba(35,64,110,.16)'; g.lineWidth = 3; for (let y = 120; y < h - 40; y += 54) { g.beginPath(); g.moveTo(40, y); g.lineTo(w - 40, y); g.stroke(); } });
  const nb = new THREE.Group(); scene.add(nb); B.nb = nb;
  const cov = box(14.6, .18, 9.8, M.navy); cov.position.y = .09; nb.add(cov);
  for (const sx of [-1, 1]) { const p = box(7, .16, 9.4, faceMats(M.ivory, M.ivory)); p.position.set(sx * 3.6, .26, 0); nb.add(p);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(7, 9.4), new THREE.MeshStandardMaterial({ map: pageT, roughness: .95 })); top.rotation.x = -Math.PI / 2; top.position.set(sx * 3.6, .345, 0); top.receiveShadow = true; nb.add(top); }
  for (let i = 0; i < 12; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.32, .07, 8, 20), M.brass); r.rotation.y = Math.PI / 2; r.position.set(0, .45, -4.1 + i * .75); nb.add(r); }
  // the one sticky note, with its handwriting revealed left to right
  B.noteT = canvasTex(600, 600, (g, w, h) => drawNote(g, w, h, 0));
  function drawNote(g, w, h, f) { grain(g, w, h, '#f7d672', 8); g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(0, 0, w, 60);
    g.save(); g.beginPath(); g.rect(0, 0, 40 + (w - 40) * f, h); g.clip();
    g.fillStyle = '#0b1a31'; g.font = '700 108px Caveat'; g.textAlign = 'center'; g.fillText('Begin:', w / 2, 250); g.font = '700 84px Caveat'; g.fillText('10 minutes today', w / 2, 380);
    g.strokeStyle = '#0b1a31'; g.lineWidth = 7; g.beginPath(); g.moveTo(110, 430); g.quadraticCurveTo(300, 455, 490, 425); g.stroke(); g.restore(); }
  B.drawNote = drawNote; B.noteF = -1;
  B.note = box(3.6, .04, 3.6, faceMats(new THREE.MeshStandardMaterial({ color: '#f2cf68', roughness: .9 }), new THREE.MeshStandardMaterial({ color: '#f2cf68' })));
  B.note.material[2] = new THREE.MeshStandardMaterial({ map: B.noteT, roughness: .9 });       // +y face carries the writing
  scene.add(B.note);
  // the book (real cover)
  const pagesT = canvasTex(64, 512, (g, w, h) => { g.fillStyle = '#efe6d0'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 2) { g.fillStyle = `rgba(120,100,70,${.08 + rnd() * .12})`; g.fillRect(x, 0, 1, h); } });
  const pagesTH = canvasTex(512, 64, (g, w, h) => { g.fillStyle = '#efe6d0'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 2) { g.fillStyle = `rgba(120,100,70,${.08 + rnd() * .12})`; g.fillRect(0, y, w, 1); } });
  const pe = new THREE.MeshStandardMaterial({ map: pagesT, roughness: 1 }), peh = new THREE.MeshStandardMaterial({ map: pagesTH, roughness: 1 });
  const book = new THREE.Mesh(new THREE.BoxGeometry(6, 9, .55), [pe, new THREE.MeshStandardMaterial({ map: spineT, roughness: .55 }), peh, peh,
    new THREE.MeshStandardMaterial({ map: frontT, roughness: .5, envMapIntensity: .3 }), new THREE.MeshStandardMaterial({ map: backT, roughness: .55 })]);
  book.castShadow = book.receiveShadow = true; scene.add(book); B.book = book;
  const spot = new THREE.SpotLight('#ffe7bf', 40, 60, .55, .6, 1.2); spot.position.set(4, 22, 16); spot.target = nb; scene.add(spot);
}
// camera keys: [t, position, look]
const CAM = [[5.0, V(-6.6, 20, 10.5), V(-6.0, 0, .4)], [11.6, V(-5.4, 18, 9), V(-4.6, 0, .4)], [12.6, V(-11, 9.5, 21), V(-11.5, 4.4, 0)], [18.0, V(-12.4, 9.0, 19.5), V(-11.8, 4.4, 0)], [25, V(-13, 8.8, 19), V(-12, 4.4, 0)]];
function setCamera(t) {
  let i = 0; while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++;
  const [t0, p0, l0] = CAM[i], [t1, p1, l1] = CAM[i + 1], u = eio(k(t, t0, t1));
  camera.position.copy(p0).lerp(p1, u); camera.lookAt(l0.clone().lerp(l1, u)); camera.updateMatrixWorld();
}
const $ = id => document.getElementById(id);
function render(t) {
  setCamera(t);
  // the sticky note drops onto the right-hand page, then is written on
  const d = bo(k(t, 5.5, 6.25)); B.note.visible = t > 5.4;
  B.note.position.set(3.6, lerp(9, .4, clamp(d)), .2); B.note.rotation.set(0, lerp(.9, -.12, clamp(d)), 0);
  const f = Math.round(eio(k(t, 6.6, 8.8)) * 60) / 60;
  if (f !== B.noteF) { B.noteF = f; const u = B.noteT.userData; B.drawNote(u.g, u.cv.width, u.cv.height, f); B.noteT.needsUpdate = true; }
  // the book stands up beside the notebook
  const r = eo(k(t, 11.8, 12.9)); B.book.visible = t > 11.7;
  B.book.position.set(-6.5, lerp(-4.6, 4.6, r), 0); B.book.rotation.set(0, lerp(.6, .22, r) - .08 * k(t, 12.9, 25), 0);
  renderer.render(scene, camera);
  // DOM
  const ph = 1 - k(t, 4.9, 5.4); $('ph').style.opacity = ph.toFixed(3); $('ph').style.display = ph <= 0 ? 'none' : '';
  $('phimg').style.transform = `scale(${lerp(1.02, 1.12, eio(k(t, 0, 5.4))).toFixed(4)})`;
  const L = (id, a, b) => { const x = eo(k(t, a, a + .5)) * (1 - k(t, b - .3, b)); $(id).style.opacity = x.toFixed(3); $(id).style.transform = `translateY(${((1 - eo(k(t, a, a + .5))) * 30).toFixed(1)}px)`; };
  L('l1', .3, 5.1); L('l2', 5.5, 11.6); L('lt', 13.0, 17.9);
  const dim = eio(k(t, 17.9, 18.5)); canvas.style.filter = dim > 0 ? `blur(${(dim * 9).toFixed(2)}px) brightness(${(1 - dim * .35).toFixed(3)})` : '';
  $('endbg').style.opacity = dim;
  const S = (id, a, dy = 30) => { const el = $(id); if (!el) return; const x = eo(k(t, a, a + .45)); el.style.opacity = x; el.style.transform = `translateY(${((1 - x) * dy).toFixed(1)}px)`; };
  S('e-cover', 18.2, 120); S('e-title', 18.4); S('e-by', 18.65, 20); S('e-fmt', 18.9, 20); S('e-date', 18.9, 20); S('e-btn', 19.3);
  const pl = Math.sin(Math.PI * k(t, 20.0, 20.5)); $('e-btn').style.transform += ` scale(${(1 + .05 * pl).toFixed(4)})`; $('e-btn').style.transformOrigin = '0 50%';
  document.querySelector('#e-btn .gl').style.left = `${lerp(-200, 1000, eio(k(t, 20.1, 20.9)))}px`;
}
window.seek = t => render(t);
window.READY = (async () => { await build(); for (const img of document.images) if (!img.complete) await new Promise(r => { img.onload = r; img.onerror = r; }); render(0); return true; })();
if (!params.has('render')) window.READY.then(() => { const t0 = performance.now(); const loop = () => { render(((performance.now() - t0) / 1000) % DURATION); requestAnimationFrame(loop); }; loop(); });
</script>
</body>
</html>
