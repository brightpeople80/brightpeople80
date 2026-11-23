
// ------------------------------------------------------------------ Ad 1: "Notes full. Tabs open. Nothing started."
// A tower of idea notes piles up; the gold line circles it (the pattern), pulls ONE note out,
// the rest collapse, and the chosen note becomes the bookmark in the book.
const B = {};
const IDEAS = ['Start a podcast', 'Etsy shop', 'Learn French', 'YouTube channel', 'Online course', 'Rebrand', 'App idea', 'Write a blog',
  'Side hustle', 'Bake sale', 'Run a 10k', 'Photography', 'Newsletter', 'Coaching', 'Move abroad', 'Candle brand', 'Learn to code', 'Book club',
  'Pottery class', 'Start the podcast', 'Garden plan', 'Vintage shop', 'Mentoring', 'Recipe book', 'Dropshipping', 'Day trading'];
const CHOSEN = 19;                                  // "Start the podcast"
const N = IDEAS.length;
async function build() {
  await Promise.all(['800 60px Montserrat', '700 60px Caveat', '600 60px "Source Serif 4"'].map(f => document.fonts.load(f)));
  const [frontT, spineT, backT] = await Promise.all(['assets/front-cover.png', 'assets/spine.png', 'assets/back-cover.png'].map(loadTex));
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), M.table); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  // the notes: gold and ivory squares with a handwritten idea each
  B.notes = IDEAS.map((idea, i) => {
    const gold = i === CHOSEN || i % 3 === 0;
    const t = canvasTex(420, 420, (g, w, h) => { grain(g, w, h, gold ? '#f7d672' : '#f4eddc', 9);
      g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(0, 0, w, 46);
      g.fillStyle = i === CHOSEN ? '#0b1a31' : '#23406e'; g.textAlign = 'center'; g.textBaseline = 'middle';
      const words = idea.split(' '); const lines = words.length > 2 ? [words.slice(0, 2).join(' '), words.slice(2).join(' ')] : [idea];
      g.font = `700 ${lines.length > 1 ? 92 : 100}px Caveat`;
      lines.forEach((l, j) => { let s = 100; g.font = `700 ${s}px Caveat`; while (g.measureText(l).width > w * .86) { s -= 4; g.font = `700 ${s}px Caveat`; } g.fillText(l, w / 2, h / 2 + (j - (lines.length - 1) / 2) * 96 + 10); });
      if (i === CHOSEN) { g.strokeStyle = '#0b1a31'; g.lineWidth = 7; g.beginPath(); g.moveTo(80, 330); g.quadraticCurveTo(210, 352, 340, 326); g.stroke(); } });
    const m = box(1.9, 1.9, .03, faceMats(new THREE.MeshStandardMaterial({ color: gold ? '#f2cf68' : '#ece3cc', roughness: .9 }), new THREE.MeshStandardMaterial({ map: t, roughness: .9 })));
    scene.add(m);
    // stacked pose: a leaning, messy tower that faces the camera
    const y = .55 + i * .23, a = i * 1.7;
    m.userData.stack = { p: V(Math.sin(a) * .35, y, Math.cos(a * 1.3) * .25), r: new THREE.Euler(-.25 + Math.sin(i * 2.1) * .2, Math.sin(i * 1.3) * .5, Math.sin(i * .7) * .3) };
    // collapsed pose: scattered flat on the table
    const ang = i * 2.4, rad = 2.2 + (i % 5) * .7;
    m.userData.flat = { p: V(Math.cos(ang) * rad, .02 + i * .004, Math.sin(ang) * rad * .7 + .5), r: new THREE.Euler(-Math.PI / 2, 0, i * .9) };
    return m;
  });
  // the pattern: a gold spiral circling the tower
  const sp = []; for (let i = 0; i <= 200; i++) { const u = i / 200, a = u * Math.PI * 2 * 3.4; sp.push(V(Math.cos(a) * 1.9, .4 + u * 6.2, Math.sin(a) * 1.6)); }
  B.spiral = tube(sp, .06, 400);
  B.pull = seg(.06);
  // the book that rises once one idea is chosen
  const book = new THREE.Group(); scene.add(book); B.book = book;
  const pagesT = canvasTex(64, 512, (g, w, h) => { g.fillStyle = '#efe6d0'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 2) { g.fillStyle = `rgba(120,100,70,${.08 + rnd() * .12})`; g.fillRect(x, 0, 1, h); } });
  const pagesTH = canvasTex(512, 64, (g, w, h) => { g.fillStyle = '#efe6d0'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 2) { g.fillStyle = `rgba(120,100,70,${.08 + rnd() * .12})`; g.fillRect(0, y, w, 1); } });
  const pe = new THREE.MeshStandardMaterial({ map: pagesT, roughness: 1 }), peh = new THREE.MeshStandardMaterial({ map: pagesTH, roughness: 1 });
  const bk = new THREE.Mesh(new THREE.BoxGeometry(6, 9, .55), [pe, new THREE.MeshStandardMaterial({ map: spineT, roughness: .55 }), peh, peh,
    new THREE.MeshStandardMaterial({ map: frontT, roughness: .5, envMapIntensity: .3 }), new THREE.MeshStandardMaterial({ map: backT, roughness: .55 })]);
  bk.castShadow = bk.receiveShadow = true; book.add(bk);
  const bookSpot = new THREE.SpotLight('#ffe7bf', 45, 60, .5, .6, 1.2); bookSpot.position.set(-8, 24, 20); bookSpot.target = book; scene.add(bookSpot);
}
// camera: [time, look, azimuth°, elevation°, distance]
const CAM = [
  [0.0, [0, 5.6, 0], 30, 14, 16.5], [3.4, [0, 6.0, 0], 0, 16, 18.5], [6.4, [0, 5.2, 0], -25, 18, 18],
  [8.4, [0.5, 3.0, 1.2], -10, 26, 21], [9.6, [0, 3.0, 0], 0, 8, 23], [11.4, [0, 3.0, 0], 6, 6, 21], [15.5, [0, 3.0, 0], 12, 6, 21.5]];
function setCamera(t) {
  let i = 0; while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++;
  const A = CAM[i], Bk = CAM[i + 1], u = eio(k(t, A[0], Bk[0]));
  const look = V(...A[1].map((v, j) => lerp(v, Bk[1][j], u)));
  const az = lerp(A[2], Bk[2], u) * Math.PI / 180, el = lerp(A[3], Bk[3], u) * Math.PI / 180, d = lerp(A[4], Bk[4], u);
  camera.position.set(look.x + d * Math.cos(el) * Math.sin(az), look.y + d * Math.sin(el), look.z + d * Math.cos(el) * Math.cos(az));
  camera.lookAt(look); camera.updateMatrixWorld();
}
function viewPoint(sx, sy, dist) { const v = V(sx, sy, .5).unproject(camera).sub(camera.position).normalize(); return camera.position.clone().add(v.multiplyScalar(dist)); }
const $ = id => document.getElementById(id);
let CAPS = [];
const q = new THREE.Quaternion(), q2 = new THREE.Quaternion();
function render(t) {
  setCamera(t);
  const wob = Math.sin(Math.PI * k(t, 3.6, 5.6)) * .05;
  const pull = eio(k(t, 8.35, 9.0)), collapse = k(t, 8.75, 9.7), toBook = eio(k(t, 9.9, 10.8));
  B.notes.forEach((m, i) => {
    const t0 = .15 + i * .095, drop = bo(k(t, t0, t0 + .32)), S = m.userData.stack, F = m.userData.flat;
    m.visible = t > t0;
    const p = S.p.clone(); p.y += (1 - clamp(drop)) * 6; p.x += Math.sin(t * 3 + i) * wob * i * .1;
    q.setFromEuler(S.r);
    if (i === CHOSEN) {
      // pulled out towards the camera, then tucked into the top of the book as a bookmark
      const front = viewPoint(.0, .1, 11), mark = V(1.3, 9.85, -.02);
      p.lerp(front, pull); if (pull > 0) q.slerp(q2.copy(camera.quaternion), pull);
      if (toBook > 0) { p.lerp(mark, toBook); q.slerp(q2.setFromEuler(new THREE.Euler(0, 0, -.12)), toBook); }
      m.scale.setScalar(lerp(1, 1.35, pull) * lerp(1, .55, toBook));
    } else {
      const c = clamp((collapse - (N - i) * .012) * 1.6);
      const ce = c * c; p.lerp(F.p, ce); q.slerp(q2.setFromEuler(F.r), ce);
    }
    m.position.copy(p); m.quaternion.copy(q);
  });
  drawTube(B.spiral, t < 8.6 ? eio(k(t, 3.55, 5.5)) * (1 - k(t, 8.2, 8.6)) : 0);
  const chosen = B.notes[CHOSEN];
  if (t > 8.2 && t < 9.4) setSeg(B.pull, V(0, 6.6, 0), chosen.position, eio(k(t, 8.2, 8.5))); else B.pull.visible = false;
  const rise = eo(k(t, 9.4, 10.2));
  B.book.visible = t > 9.35; B.book.position.set(0, lerp(-4.6, 4.5, rise), 0); B.book.rotation.y = lerp(.5, -.12, rise) + .05 * Math.sin(t * .6);
  renderer.render(scene, camera);

  // hook headlines
  const W = (sel, i, a, out) => { const el = document.querySelectorAll(sel + ' span')[i], x = eo(k(t, a, a + .25)); el.style.opacity = (x * (1 - k(t, out, out + .25))).toFixed(3); el.style.transform = `translateY(${((1 - x) * 26).toFixed(1)}px)`; };
  W('#h1', 0, .3, 3.15); W('#h1', 1, .95, 3.15); W('#h1', 2, 1.78, 3.15);
  W('#h2', 0, 3.5, 6.2); W('#h2', 1, 4.62, 6.2);
  // end card
  const dim = eio(k(t, 11.2, 11.8));
  canvas.style.filter = dim > 0 ? `blur(${(dim * 8).toFixed(2)}px) brightness(${(1 - dim * .3).toFixed(3)})` : '';
  $('endbg').style.opacity = dim;
  const S = (id, a, dy = 30) => { const el = $(id), x = eo(k(t, a, a + .45)); el.style.opacity = x; el.style.transform = `translateY(${((1 - x) * dy).toFixed(1)}px)`; };
  S('e-title', 11.4); S('e-by', 11.7, 20); S('e-stack', 11.5, 140); S('e-reader', 11.75, 140); S('e-fmt', 12.0, 20); S('e-avail', 12.2, 20); S('e-btn', 12.4); S('e-url', 12.6, 20);
  const pl = Math.sin(Math.PI * k(t, 12.85, 13.35)); $('e-btn').style.transform += ` scale(${(1 + .05 * pl).toFixed(4)})`; $('e-btn').style.transformOrigin = '0 50%';
  document.querySelector('#e-btn .gl').style.left = `${lerp(-180, 900, eio(k(t, 12.9, 13.6)))}px`;
  for (const c of CAPS) { const a = eo(k(t, c.s - .04, c.s + .12)) * (1 - k(t, c.e - .1, c.e)); c.el.style.opacity = a; c.el.style.transform = `translateY(${((1 - eo(k(t, c.s - .04, c.s + .16))) * 14).toFixed(1)}px)`; }
}
window.seek = (t) => render(t);
window.READY = (async () => {
  await build();
  CAPS = (window.CAPS_DATA || []).map(c => ({ ...c }));
  for (const c of CAPS) { const d = document.createElement('div'); d.className = 'cap'; const sp = document.createElement('span'); sp.textContent = c.text; d.appendChild(sp); $('caps').appendChild(d); c.el = d; }
  for (const img of document.images) if (!img.complete) await new Promise(r => { img.onload = r; img.onerror = r; });
  window.seek(0); return true;
})();
if (!params.has('render')) window.READY.then(() => { const t0 = performance.now(); const loop = () => { window.seek(((performance.now() - t0) / 1000) % DURATION); requestAnimationFrame(loop); }; loop(); });
</script>
</body>
</html>
