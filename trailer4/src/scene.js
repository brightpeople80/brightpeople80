
// ------------------------------------------------------------------ build
const B = {};
const DOORS = [
  { p: [-3.4, -2], label: 'NEW JOB' }, { p: [3.4, -6.5], label: 'A COURSE' }, { p: [-3.4, -11], label: 'THE IDEA' },
  { p: [3.4, -15.5], label: 'MOVE AWAY' }, { p: [-3.4, -20], label: 'LATER' }];
const CHOSEN = 2;
async function build() {
  await Promise.all(['800 60px Montserrat', '900 60px Montserrat', '600 60px "Source Serif 4"'].map(f => document.fonts.load(f)));
  const [frontT, spineT, backT] = await Promise.all(['assets/front-cover.png', 'assets/spine.png', 'assets/back-cover.png'].map(loadTex));
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), M.table); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  // ---- the corridor of doors (paper model)
  B.doors = DOORS.map((d, i) => {
    const g = new THREE.Group(); const ry = d.p[0] < 0 ? .38 : -.38; g.position.set(d.p[0], 0, d.p[1]); g.rotation.y = ry; scene.add(g);
    for (const x of [-1.8, 1.8]) { const j = box(.38, 6.9, .7, M.navy); j.position.set(x, 3.45, 0); g.add(j); }
    const hd = box(3.98, .5, .7, M.navy); hd.position.set(0, 7.0, 0); g.add(hd);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.25, 6.7), new THREE.MeshBasicMaterial({ color: '#1a2a44' })); glow.position.set(0, 3.35, -.25); g.add(glow);
    const hinge = new THREE.Group(); hinge.position.set(-1.6, 0, .08); g.add(hinge);
    const leaf = box(3.2, 6.65, .14, M.ivory); leaf.position.set(1.6, 3.33, 0); hinge.add(leaf);
    const panelLine = box(2.4, .05, .02, M.brass); panelLine.position.set(1.6, 4.9, .08); hinge.add(panelLine);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(.17, 18, 12), M.brass); knob.position.set(2.85, 3.2, .2); knob.castShadow = true; hinge.add(knob);
    const pt = canvasTex(1000, 260, (c, w, h) => { brushed(c, w, h); c.strokeStyle = 'rgba(70,45,10,.5)'; c.lineWidth = 6; c.strokeRect(10, 10, w - 20, h - 20);
      c.font = '800 120px Montserrat'; c.textAlign = 'center'; c.textBaseline = 'middle'; const mw = c.measureText(d.label).width; if (mw > w * .86) c.font = `800 ${Math.floor(120 * w * .86 / mw)}px Montserrat`;
      c.fillStyle = 'rgba(255,240,190,.8)'; c.fillText(d.label, w / 2, h / 2 + 12); c.fillStyle = '#3c2a0c'; c.fillText(d.label, w / 2, h / 2 + 8); });
    const plate = box(3.6, .94, .1, faceMats(M.brass, new THREE.MeshStandardMaterial({ map: pt, metalness: .75, roughness: .35, envMapIntensity: 3 })));
    plate.position.set(0, 7.85, .12); g.add(plate);
    const n = V(Math.sin(ry), 0, Math.cos(ry));
    return { g, hinge, glow, n, pos: V(d.p[0], 0, d.p[1]) };
  });
  const c = B.doors[CHOSEN];
  B.doorLight = new THREE.PointLight('#ffd27a', 0, 30, 1.4); B.doorLight.position.copy(c.pos).add(V(0, 3.5, 0)).sub(c.n.clone().multiplyScalar(1.2)); scene.add(B.doorLight);
  B.tiles = [0, 1, 2, 3, 4, 5].map(i => { const t = box(2.3, .1, 1.2, M.ivory); t.position.copy(c.pos).add(c.n.clone().multiplyScalar(1.6 + i * 1.65)); t.position.y = .05; t.rotation.y = Math.atan2(c.n.x, c.n.z); scene.add(t); return t; });
  // wandering gold line: visits the doors, then hovers in the corridor
  const front = i => B.doors[i].pos.clone().add(B.doors[i].n.clone().multiplyScalar(1.7)).add(V(0, 3.6, 0));
  const pts = [V(0, 3.2, 6), front(0), V(0, 4.2, -4), front(1), front(3), V(0, 4.6, -12), front(2), front(4), V(0, 4, -14), front(1), front(0), V(0, 3.6, -3), V(.6, 3.7, -4.5)];
  B.wander = tube(pts, .075, 520);
  B.pick = seg(.075);
  B.walk = seg(.07);

  // ---- the book, standing on its own stage
  const book = new THREE.Group(); book.position.set(60, 9, 3); scene.add(book); B.book = book;
  const pagesT = canvasTex(64, 512, (g, w, h) => { g.fillStyle = '#efe6d0'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 2) { g.fillStyle = `rgba(120,100,70,${.08 + rnd() * .12})`; g.fillRect(x, 0, 1, h); } });
  const pagesTH = canvasTex(512, 64, (g, w, h) => { g.fillStyle = '#efe6d0'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 2) { g.fillStyle = `rgba(120,100,70,${.08 + rnd() * .12})`; g.fillRect(0, y, w, 1); } });
  const pe = new THREE.MeshStandardMaterial({ map: pagesT, roughness: 1 }), peh = new THREE.MeshStandardMaterial({ map: pagesTH, roughness: 1 });
  const pages = box(5.85, 8.85, .46, [pe, M.navy, peh, peh, M.ivory, M.ivory]); pages.position.set(.05, 0, 0); book.add(pages);
  const backC = box(6, 9, .04, [M.navy, M.navy, M.navy, M.navy, M.navy, new THREE.MeshStandardMaterial({ map: backT, roughness: .55 })]); backC.position.z = -.25; book.add(backC);
  const spine = new THREE.Mesh(new THREE.PlaneGeometry(.54, 9), new THREE.MeshStandardMaterial({ map: spineT, roughness: .55 })); spine.rotation.y = -Math.PI / 2; spine.position.set(-3.0, 0, 0); book.add(spine);
  const cover = box(6, 9, .04, [M.navy, M.navy, M.navy, M.navy, new THREE.MeshPhysicalMaterial({ map: frontT, roughness: .45, clearcoat: .5, clearcoatRoughness: .3 }), M.navy]); cover.position.set(0, 0, .25); book.add(cover);
  const stageLight = new THREE.SpotLight('#ffe7bf', 60, 60, .5, .6, 1.2); stageLight.position.set(52, 26, 22); stageLight.target = book; stageLight.castShadow = true; scene.add(stageLight);
  B.bookLine = seg(.06);
}

// ------------------------------------------------------------------ camera: [time, look, azimuth°, elevation°, distance]
const CAM = [
  [5.0, [0, 3.0, -9], 0, 20, 30],
  [10.2, [0, 3.2, -9.5], 4, 24, 33],
  [14.6, [0, 3.2, -9.5], -3, 25, 34],
  [16.4, [-3.4, 3.6, -11], 22, 8, 16],
  [18.2, [-3.4, 3.5, -11], 22, 4, 8.5],
  [19.05, [-3.4, 3.4, -11.6], 22, 1, 1.4],
  [19.08, [60, 3.1, 3], -12, 3, 38],
  [25.8, [60, 3.1, 3], 10, 4, 35],
  [34.0, [60, 3.1, 3], 14, 4, 34],
];
function setCamera(t) {
  let i = 0; while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++;
  const A = CAM[i], Bk = CAM[i + 1], u = eio(k(t, A[0], Bk[0]));
  const look = V(...A[1].map((v, j) => lerp(v, Bk[1][j], u)));
  const az = lerp(A[2], Bk[2], u) * Math.PI / 180, el = lerp(A[3], Bk[3], u) * Math.PI / 180, d = lerp(A[4], Bk[4], u);
  camera.position.set(look.x + d * Math.cos(el) * Math.sin(az), look.y + d * Math.sin(el), look.z + d * Math.cos(el) * Math.cos(az));
  camera.lookAt(look); camera.updateMatrixWorld();
}

// ------------------------------------------------------------------ seek
const $ = id => document.getElementById(id);
const capsEl = $('caps');
let CAPS = [];
const PEEKS = [[0, 6.2], [1, 6.9], [3, 7.5], [2, 8.1], [4, 8.6], [1, 9.2], [0, 9.7]];   // door, time: the line peeks at each option
const OPT = [[0, 2.85, 70, 250, -3], [1, 3.15, 450, 272, 3], [2, 3.45, 80, 372, -2], [3, 3.75, 545, 394, 3], [4, 4.05, 230, 492, -2]];
// her shots: [in, out, scale from, scale to, origin x %, origin y %, grade]
const HER = [[0, 5.6, 1.04, 1.12, 50, 50, '', 'ph'], [7.8, 9.05, 1.9, 2.02, 52, 44, 'cool', 'ph'], [17.75, 19.12, 1.02, 1.14, 22, 78, 'warm', 'ph3']];
function render(t) {
  setCamera(t);
  // ---- doors
  B.doors.forEach((d, i) => {
    let open = 0; for (const [j, tp] of PEEKS) if (j === i) open = Math.max(open, Math.sin(Math.PI * k(t, tp - .25, tp + .45)) * .55);
    const fall = i === CHOSEN ? 0 : eio(k(t, 15.0 + Math.abs(i - CHOSEN) * .12, 15.75 + Math.abs(i - CHOSEN) * .12));
    if (i === CHOSEN) open = Math.max(open, 1.95 * eio(k(t, 16.35, 17.1)));
    d.hinge.rotation.y = -open; d.g.rotation.x = -Math.PI / 2 * fall; d.g.visible = fall < .999 && t < 19.1;
    if (i === CHOSEN) d.glow.material.color.set(t > 16.3 ? '#ffe3a1' : '#1a2a44');
  });
  B.doorLight.intensity = 26 * eio(k(t, 16.35, 17.0)) * (t < 19.1 ? 1 : 0);
  const head = eio(k(t, 5.4, 10.1)), segs = B.wander.userData.segs, win = 90;
  const hi = Math.floor(head * segs), lo = Math.max(0, hi - win);
  B.wander.visible = t > 5.4 && t < 15.3; B.wander.geometry.setDrawRange(lo * 48, (hi - lo) * 48);
  const hover = V(.6, 3.7, -4.5), knob = B.doors[CHOSEN].pos.clone().add(V(0, 3.6, 0)).add(B.doors[CHOSEN].n.clone().multiplyScalar(.3));
  if (t > 14.55 && t < 19.1) setSeg(B.pick, hover, knob, eio(k(t, 14.6, 15.2))); else B.pick.visible = false;
  B.tiles.forEach((tl, i) => { const a = bo(k(t, 17.0 + (5 - i) * .14, 17.3 + (5 - i) * .14)); tl.visible = a > .01 && t < 19.1; tl.scale.set(1, 1, Math.max(.01, a)); });
  const c = B.doors[CHOSEN]; const far = c.pos.clone().add(c.n.clone().multiplyScalar(11)).add(V(0, .12, 0)), near = c.pos.clone().add(V(0, .12, 0));
  if (t > 17.0 && t < 18.3) setSeg(B.walk, far, near, eio(k(t, 17.0, 17.9))); else B.walk.visible = false;
  // ---- book
  B.book.rotation.y = lerp(-.32, .22, eio(k(t, 19.1, 26)));
  B.book.visible = t > 19.0;
  renderer.render(scene, camera);

  // ---- DOM: her story. One person carries the film: scrolling, stuck, then choosing
  let shot = null; for (const sh of HER) if (t >= sh[0] - .12 && t < sh[1] + .12) shot = sh;
  const ph = $('photo');
  if (!shot) ph.style.display = 'none';
  else {
    const [t0, t1, s0, s1, ox, oy, grade, imgId] = shot, u = k(t, t0, t1);
    $('ph').style.display = imgId === 'ph' ? '' : 'none'; $('ph3').style.display = imgId === 'ph3' ? '' : 'none';
    ph.style.display = ''; ph.style.opacity = Math.min(k(t, t0 - .12, t0 + .05), 1 - k(t, t1 - .05, t1 + .12), 1).toFixed(3);
    if (t0 === 0) ph.style.opacity = (1 - k(t, 4.9, 5.6)).toFixed(3);
    const img = $(imgId); img.style.transformOrigin = `${ox}% ${oy}%`; img.style.transform = `scale(${lerp(s0, s1, eio(u)).toFixed(4)})`;
    img.style.filter = grade === 'cool' ? 'brightness(.78) saturate(.6) hue-rotate(-12deg)' : grade === 'warm' ? `brightness(${(1 + .18 * eio(u)).toFixed(3)}) saturate(1.15)` : '';
    $('warm').style.opacity = grade === 'warm' ? (.15 + .35 * eio(u)).toFixed(3) : 0;
    if (t0 === 0 && t >= 2.72) { img.style.transformOrigin = '38% 58%'; img.style.transform = `scale(${lerp(1.14, 1.22, eio(k(t, 2.72, 5.6))).toFixed(4)})`; }
  }
  for (const [i, t0, x, y, rot] of OPT) {
    const el = $('o' + i), a = eo(k(t, t0, t0 + .35)), up = k(t, t0 + .35, 5.6);
    el.style.opacity = a * (1 - k(t, 4.75, 5.2));
    el.style.transform = `translate(${lerp(300, x, a).toFixed(1)}px, ${(lerp(1080, y, a) - up * 50).toFixed(1)}px) rotate(${rot}deg) scale(${lerp(.35, 1, a).toFixed(3)})`;
  }
  // ---- DOM: chapter 3 title
  const ct = eo(k(t, 10.85, 11.3)), cOut = eio(k(t, 16.2, 16.6));
  document.querySelector('#ch3 .t').style.opacity = ct * (1 - cOut);
  document.querySelector('#ch3 .t').style.transform = `translateY(${((1 - ct) * 30).toFixed(1)}px)`;
  const chip = document.querySelector('#ch3 .chip'), cc = bo(k(t, 13.3, 13.7));
  chip.style.opacity = clamp(cc) * (1 - cOut); chip.style.transform = `scale(${Math.max(.01, cc).toFixed(3)})`; chip.style.transformOrigin = '0 50%';
  // ---- DOM: flash through the door
  $('flash').style.opacity = Math.max(0, 1 - Math.abs(t - 19.06) / .32) ** 1.4;
  // ---- DOM: contents
  const toc = $('toc'), ti = eo(k(t, 19.35, 19.8)), tOut = eio(k(t, 25.7, 26.2));
  toc.style.opacity = ti * (1 - tOut); toc.style.transform = `translateY(${((1 - ti) * 60).toFixed(1)}px)`;
  toc.querySelectorAll('.row').forEach((r, i) => { const a = eo(k(t, 19.6 + i * .14, 19.9 + i * .14)); r.style.opacity = a; r.style.transform = `translateX(${((1 - a) * 30).toFixed(1)}px)`;
    const lit = i === 1 ? Math.sin(Math.PI * k(t, 20.8, 22.3)) : i === 6 ? Math.sin(Math.PI * k(t, 22.6, 24.8)) : 0;
    if (i !== 2) r.style.background = `rgba(251,195,18,${(.55 * lit).toFixed(3)})`; });
  // ---- DOM: end card
  const dim = eio(k(t, 25.8, 26.4));
  $('endbg').style.opacity = dim;
  const S = (id, a, b, dy = 40) => { const el = $(id), x = eo(k(t, a, b)); el.style.opacity = x; el.style.transform = `translateY(${((1 - x) * dy).toFixed(1)}px)`; };
  S('e-title', 26.0, 26.45); S('e-author', 26.15, 26.55, 20); S('e-stack', 26.1, 26.7, 140); S('e-reader', 26.35, 26.85, 140);
  S('e-paper', 26.6, 26.95, 20); S('e-kindle', 26.65, 27.0, 20); S('e-btn', 26.5, 26.9, 30); S('e-date', 26.7, 27.05, 20); S('e-url', 26.75, 27.1, 20);
  const pulse = Math.sin(Math.PI * k(t, 29.0, 29.5));
  $('e-btn').style.transform += ` scale(${(1 + .05 * pulse).toFixed(4)})`; $('e-btn').style.transformOrigin = '0 50%';
  document.querySelector('#e-btn .gl').style.left = `${lerp(-180, 900, eio(k(t, 29.1, 29.8)))}px`;
  // ---- captions
  for (const cp of CAPS) { const a = eo(k(t, cp.s - .04, cp.s + .12)) * (1 - k(t, cp.e - .1, cp.e)); cp.el.style.opacity = a; cp.el.style.transform = `translateY(${((1 - eo(k(t, cp.s - .04, cp.s + .16))) * 14).toFixed(1)}px)`; }
}

window.seek = (t) => render(t);
window.READY = (async () => {
  await build();
  CAPS = (window.CAPS_DATA || []).map(c => ({ ...c }));
  for (const c of CAPS) { const d = document.createElement('div'); d.className = 'cap'; const sp = document.createElement('span'); sp.textContent = c.text; d.appendChild(sp); capsEl.appendChild(d); c.el = d; }
  for (const img of document.images) if (!img.complete) await new Promise(r => { img.onload = r; img.onerror = r; });
  window.seek(0); return true;
})();
if (!params.has('render')) window.READY.then(() => { const t0 = performance.now();
  const loop = () => { window.seek(((performance.now() - t0) / 1000) % DURATION); requestAnimationFrame(loop); }; loop(); });
</script>
</body>
</html>
