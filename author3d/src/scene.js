
// ------------------------------------------------------------------ build
const B = {};
const emboss = (g, text, x, y, font, fill = '#c99a2e') => { g.font = font; g.fillStyle = 'rgba(255,255,255,.7)'; g.fillText(text, x, y - 2); g.fillStyle = 'rgba(60,40,10,.55)'; g.fillText(text, x, y + 3); g.fillStyle = fill; g.fillText(text, x, y); };
const fit = (g, text, size, weight, family, maxW) => { g.font = `${weight} ${size}px ${family}`; const w = g.measureText(text).width; if (w > maxW) g.font = `${weight} ${Math.floor(size * maxW / w)}px ${family}`; };
function brassPlate(label, w, h) {
  const t = canvasTex(Math.round(w * 220), Math.round(h * 220), (c, W, H) => { brushed(c, W, H); c.strokeStyle = 'rgba(70,45,10,.5)'; c.lineWidth = 8; c.strokeRect(12, 12, W - 24, H - 24);
    for (const [x, y] of [[34, 34], [W - 34, 34], [34, H - 34], [W - 34, H - 34]]) { c.fillStyle = '#7a5a1e'; c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); }
    fit(c, label, H * .5, 800, 'Montserrat', W * .82); c.textAlign = 'center'; c.textBaseline = 'middle'; if (c.letterSpacing !== undefined) c.letterSpacing = `${Math.round(H * .06)}px`;
    c.fillStyle = 'rgba(255,240,190,.8)'; c.fillText(label, W / 2, H / 2 + 5); c.fillStyle = '#3c2a0c'; c.fillText(label, W / 2, H / 2 + 1); });
  return box(w, h, .16, faceMats(M.brass, new THREE.MeshStandardMaterial({ map: t, metalness: .75, roughness: .35, envMapIntensity: 3 })));
}
function paperCard(w, h, draw) {
  const t = canvasTex(Math.round(w * 200), Math.round(h * 200), (c, W, H) => { grain(c, W, H, '#f4eddc', 8); c.strokeStyle = '#c99a2e'; c.lineWidth = 7; c.strokeRect(12, 12, W - 24, H - 24); draw(c, W, H); });
  return box(w, h, .05, faceMats(M.ivory, new THREE.MeshStandardMaterial({ map: t, roughness: .9 }), M.ivory));
}
async function build() {
  await Promise.all(['800 60px Montserrat', '900 60px Montserrat', '700 60px Montserrat', '600 60px "Source Serif 4"', 'italic 700 60px "Source Serif 4"', '600 60px Caveat'].map(f => document.fonts.load(f)));
  const [frontT, spineT, backT, authorT] = await Promise.all(['assets/front-cover.png', 'assets/spine.png', 'assets/back-cover.png', 'assets/author-belinda.jpg'].map(loadTex));
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(600, 400), M.table); floor.rotation.x = -Math.PI / 2; floor.position.x = 60; floor.receiveShadow = true; scene.add(floor);

  // ---- A: the SOMEDAY drawer and three cards
  const cab = new THREE.Group(); cab.position.set(0, 0, -16); scene.add(cab);
  const body = box(19, 8.6, 12, M.navyDeep); body.position.set(0, 4.3, 0); cab.add(body);
  const top = box(19.6, .5, 12.6, M.navy); top.position.set(0, 8.85, 0); cab.add(top);
  const drawer = new THREE.Group(); cab.add(drawer); B.drawer = drawer;
  const front = box(17, 6.6, .7, M.navy); front.position.set(0, 4.4, 6.35); drawer.add(front);
  [[16, .3, 11, 0, 1.4, .5], [.3, 5, 11, -7.85, 3.8, .5], [.3, 5, 11, 7.85, 3.8, .5], [16, 5, .3, 0, 3.8, -5]].forEach(([w, h, d, x, y, z]) => { const m = box(w, h, d, M.navyDeep); m.position.set(x, y, z); drawer.add(m); });
  const plate = brassPlate('SOMEDAY', 5.2, 1.5); plate.position.set(0, 5.75, 6.78); drawer.add(plate);
  const pull = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, 4.4, 20), M.brass); pull.rotation.z = Math.PI / 2; pull.position.set(0, 3.5, 7.35); pull.castShadow = true; drawer.add(pull);
  const CARD = [['Dreams', 'they haven’t forgotten'], ['Ideas', 'they still believe in'], ['Plans', 'they’ve been meaning to start']];
  B.cards = CARD.map(([a, b]) => { const m = paperCard(6.6, 2.7, (c, W, H) => { c.textBaseline = 'alphabetic'; c.fillStyle = '#b8860b'; c.font = '700 110px Montserrat'; c.fillText('★', 60, 210);
      c.fillStyle = '#0b1a31'; c.font = '800 150px Montserrat'; c.fillText(a, 200, 222);
      c.fillStyle = '#23406e'; fit(c, b, 150, 600, 'Caveat', W - 140); c.fillText(b, 70, 430); }); scene.add(m); return m; });
  B.cardLinks = [seg(.06), seg(.06)];

  // ---- B: preparing -> doing, the line tangles on the way
  B.prep = new THREE.Group(); B.prep.position.set(40.8, 0, 6); scene.add(B.prep);
  const ped1 = box(6.6, 2.2, 1.6, M.navy); ped1.position.y = 1.1; B.prep.add(ped1);
  const pl1 = brassPlate('PREPARING', 6.0, 1.3); pl1.position.set(0, 1.15, .86); B.prep.add(pl1);
  B.doing = new THREE.Group(); B.doing.position.set(40.8, 0, -10); scene.add(B.doing);
  const ped2 = box(5.2, 2.2, 1.6, M.navy); ped2.position.y = 1.1; B.doing.add(ped2);
  const pl2 = brassPlate('DOING', 4.6, 1.3); pl2.position.set(0, 1.15, .86); B.doing.add(pl2);
  const c0 = V(40.9, 3.6, -.6);
  B.tangle = tube([V(40.8, 2.3, 5.1), V(40.6, 2.8, 3.6), V(40.9, 3.2, 2.2), c0.clone().add(V(-.4, 0, .9)),
    c0.clone().add(V(1.3, .9, 0)), c0.clone().add(V(-.5, 1.8, .7)), c0.clone().add(V(-1.3, .3, -.6)), c0.clone().add(V(.6, -.7, .9)),
    c0.clone().add(V(1.1, 1.3, -.5)), c0.clone().add(V(-.9, 1.1, -.9)), c0.clone().add(V(.3, .1, .4)), c0.clone().add(V(.9, .6, -1.1))], .09, 420);

  // ---- C: the author's portrait, framed and standing on the table
  B.frame = new THREE.Group(); B.frame.position.set(80, 0, 0); B.frame.rotation.x = -.06; scene.add(B.frame);
  const outer = box(7.4, 12.9, .5, M.brass); outer.position.set(0, 6.6, 0); B.frame.add(outer);
  const mat = box(6.9, 12.4, .06, M.ivory); mat.position.set(0, 6.6, .27); B.frame.add(mat);
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(6.1, 11.0), new THREE.MeshStandardMaterial({ map: authorT, roughness: .6 })); photo.position.set(0, 6.6, .31); B.frame.add(photo);
  const foot = box(7.4, .4, 2.2, M.navy); foot.position.set(0, .2, -.6); B.frame.add(foot);
  B.namePlate = brassPlate('BELINDA BRIGHT N.', 5.0, .95); B.namePlate.position.set(80, .62, 3.0); B.namePlate.rotation.x = -1.05; scene.add(B.namePlate);
  const spot = new THREE.SpotLight('#ffe7bf', 70, 50, .45, .6, 1.2); spot.position.set(74, 20, 16); spot.target = B.frame; spot.castShadow = true; scene.add(spot);

  // ---- D/E: the book (front cover hinged on the spine)
  const book = new THREE.Group(); scene.add(book); B.book = book;
  const pagesT = canvasTex(64, 512, (g, w, h) => { g.fillStyle = '#efe6d0'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 2) { g.fillStyle = `rgba(120,100,70,${.08 + rnd() * .12})`; g.fillRect(x, 0, 1, h); } });
  const pagesTH = canvasTex(512, 64, (g, w, h) => { g.fillStyle = '#efe6d0'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 2) { g.fillStyle = `rgba(120,100,70,${.08 + rnd() * .12})`; g.fillRect(0, y, w, 1); } });
  const pageFace = canvasTex(600, 900, (g, w, h) => { grain(g, w, h, '#f4eddc', 6); g.fillStyle = 'rgba(11,26,49,.16)'; for (let y = 150; y < h - 90; y += 34) g.fillRect(70, y, (w - 140) * (y % 7 === 0 ? .6 : 1), 9); });
  const pe = new THREE.MeshStandardMaterial({ map: pagesT, roughness: 1 }), peh = new THREE.MeshStandardMaterial({ map: pagesTH, roughness: 1 });
  const pages = box(5.85, 8.85, .46, [pe, M.navy, peh, peh, new THREE.MeshStandardMaterial({ map: pageFace, roughness: 1 }), M.ivory]); pages.position.set(.05, 0, 0); book.add(pages);
  const backC = box(6, 9, .04, [M.navy, M.navy, M.navy, M.navy, M.navy, new THREE.MeshStandardMaterial({ map: backT, roughness: .55 })]); backC.position.z = -.25; book.add(backC);
  const spine = new THREE.Mesh(new THREE.PlaneGeometry(.54, 9), new THREE.MeshStandardMaterial({ map: spineT, roughness: .55 })); spine.rotation.y = -Math.PI / 2; spine.position.set(-3.0, 0, 0); book.add(spine);
  const hinge = new THREE.Group(); hinge.position.set(-3, 0, .25); book.add(hinge); B.hinge = hinge;
  const cover = box(6, 9, .04, [M.navy, M.navy, M.navy, M.navy, new THREE.MeshPhysicalMaterial({ map: frontT, roughness: .45, clearcoat: .5, clearcoatRoughness: .3 }), M.navy]); cover.position.set(3, 0, 0); hinge.add(cover);
  const bookSpot = new THREE.SpotLight('#ffe7bf', 50, 60, .5, .6, 1.2); bookSpot.position.set(112, 26, 22); bookSpot.target = book; scene.add(bookSpot);
  // the three themes lift off the pages
  B.themes = [['Why we', 'overthink'], ['Why we', 'chase new ideas'], ['Why we', 'struggle to follow through']].map(([a, b]) => { const m = paperCard(6.2, 1.15, (c, W, H) => {
      c.textBaseline = 'middle'; c.fillStyle = '#0b1a31'; c.font = '700 70px Montserrat'; c.fillText(a, 50, H / 2 + 4); const wa = c.measureText(a).width;
      c.fillStyle = '#9b7314'; fit(c, b, 78, 800, 'Montserrat', W - 110 - wa); c.fillText(b, 70 + wa, H / 2 + 4); }); scene.add(m); return m; });
  // the tools
  B.ticket = paperCard(4.2, 1.92, (g, w, h) => {
    g.setLineDash([12, 12]); g.strokeStyle = 'rgba(11,26,49,.45)'; g.lineWidth = 4; g.beginPath(); g.moveTo(190, 30); g.lineTo(190, h - 30); g.stroke(); g.setLineDash([]);
    g.save(); g.translate(100, h / 2); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.textBaseline = 'middle'; emboss(g, 'ADMIT ONE', 0, 0, '800 34px Montserrat', '#0b1a31'); g.restore();
    g.fillStyle = '#0b1a31'; g.font = '800 28px Montserrat'; g.fillText('TOOL 01', 240, 90);
    emboss(g, 'The SELECT', 236, 210, '700 96px "Source Serif 4"'); emboss(g, 'method', 236, 310, 'italic 700 96px "Source Serif 4"'); });
  scene.add(B.ticket);
  B.calTicks = -1;
  const calT = canvasTex(1000, 1050, (g, w, h) => drawCal(g, w, h, 0));
  function drawCal(g, w, h, n) {
    grain(g, w, h, '#f4eddc', 8); g.fillStyle = '#0b1a31'; g.fillRect(0, 0, w, 270);
    g.fillStyle = '#fbc312'; g.font = '800 70px Montserrat'; g.textAlign = 'center'; g.fillText('30-Day Follow-Through', w / 2, 120); g.fillText('Programme', w / 2, 210);
    const cw = (w - 80) / 6, ch = (h - 320) / 5;
    for (let i = 0; i < 30; i++) { const x = 40 + (i % 6) * cw, y = 300 + Math.floor(i / 6) * ch;
      g.strokeStyle = 'rgba(11,26,49,.25)'; g.lineWidth = 3; g.strokeRect(x + 4, y + 4, cw - 8, ch - 8);
      if (i < n) { g.fillStyle = '#fbc312'; g.fillRect(x + 8, y + 8, cw - 16, ch - 16); }
      g.fillStyle = '#0b1a31'; g.font = '800 44px Montserrat'; g.textAlign = 'left'; g.fillText(String(i + 1), x + 18, y + 56); }
  }
  B.calTex = calT; B.drawCal = drawCal;
  B.cal = new THREE.Group(); scene.add(B.cal);
  B.cal.add(box(3.8, 4.0, .05, faceMats(M.ivory, new THREE.MeshStandardMaterial({ map: calT, roughness: .9 }), M.ivory)));
  const flapT = canvasTex(760, 800, (g, w, h) => { grain(g, w, h, '#13284a', 12); g.textAlign = 'center'; emboss(g, '30', w / 2, 480, '900 360px Montserrat', '#d8ad4f'); emboss(g, 'DAYS', w / 2, 610, '800 80px Montserrat', '#d8ad4f'); });
  const flapP = new THREE.Group(); flapP.position.set(0, 2.0, .06); B.cal.add(flapP); B.flapP = flapP;
  const flap = box(3.8, 4.0, .05, faceMats(M.navy, new THREE.MeshStandardMaterial({ map: flapT, roughness: .9 }), M.navy)); flap.position.y = -2.0; flapP.add(flap);
  for (const x of [-1.2, 0, 1.2]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(.2, .05, 8, 20), M.brass); ring.position.set(x, 2.0, .05); B.cal.add(ring); }
  B.links = [seg(.06), seg(.06)];
}

// ------------------------------------------------------------------ camera: [time, look, azimuth°, elevation°, distance]
const CAM = [
  [0.0, [0, 5.75, -9.2], 3, 2, 19], [0.6, [0, 5.75, -9.2], 2, 2, 18.5], [1.5, [0, 8.6, -6], 2, 6, 24], [5.0, [0, 10.4, -5], -4, 8, 30], [7.1, [0, 10.4, -5], -7, 9, 31],
  [7.12, [40.8, -3.2, 1.5], 6, 40, 35], [10.93, [40.8, -3.2, 1.5], -5, 42, 33],
  [10.95, [80, 6.3, 0], -24, 6, 28], [15.53, [80, 6.4, 0], 0, 2, 19.5],
  [15.55, [120, 7.4, 3], -12, 2, 27], [16.9, [120, 7.4, 3], 0, 2, 25.5], [17.8, [119, 9.2, 1.5], 0, 44, 30], [29.3, [119, 9.4, 1.5], 0, 44, 31],
  [34.5, [120, 8.6, 3], -22, 6, 30], [46.5, [120, 8.6, 3], 16, 6, 30],
];
function setCamera(t) {
  let i = 0; while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++;
  const A = CAM[i], Bk = CAM[i + 1], u = eio(k(t, A[0], Bk[0]));
  const look = V(...A[1].map((v, j) => lerp(v, Bk[1][j], u)));
  const az = lerp(A[2], Bk[2], u) * Math.PI / 180, el = lerp(A[3], Bk[3], u) * Math.PI / 180, d = lerp(A[4], Bk[4], u);
  camera.position.set(look.x + d * Math.cos(el) * Math.sin(az), look.y + d * Math.sin(el), look.z + d * Math.cos(el) * Math.cos(az));
  camera.lookAt(look); camera.updateMatrixWorld();
}
function viewPoint(sx, sy, dist) { const v = V(sx, sy, .5).unproject(camera).sub(camera.position).normalize(); return camera.position.clone().add(v.multiplyScalar(dist)); }

// ------------------------------------------------------------------ seek
const $ = id => document.getElementById(id);
let CAPS = [];
function render(t) {
  setCamera(t);
  // ---- A
  B.drawer.position.z = 6.2 * bo(k(t, .3, .65));
  const tray = V(0, 3.2, -15 + B.drawer.position.z);
  const SPOT = [V(-.9, 14.2, -4.6), V(.8, 10.9, -3.7), V(-.6, 7.6, -2.8)];
  [1.45, 2.57, 4.67].forEach((t0, i) => { const c = B.cards[i], a = eo(k(t, t0, t0 + .7)), out = t > 7.12;
    c.visible = t > t0 && !out; c.position.copy(tray.clone().lerp(SPOT[i], a)); c.position.y += Math.sin(t * 1.3 + i) * .08 * a;
    c.scale.setScalar(lerp(.4, 1, a)); c.lookAt(camera.position); c.rotateZ((i - 1) * .025 + (1 - a) * .4); });
  [[0, 1, 3.0], [1, 2, 5.0]].forEach(([a, b, t0], j) => { if (t > t0 && t < 7.12) setSeg(B.cardLinks[j], B.cards[a].position.clone().add(V(3.5, -.8, 0)), B.cards[b].position.clone().add(V(3.5, .8, 0)), eio(k(t, t0, t0 + .6))); else B.cardLinks[j].visible = false; });
  // ---- B
  const p1 = bo(k(t, 7.3, 7.8)), p2 = bo(k(t, 7.6, 8.1));
  B.prep.scale.set(1.4, 1.4 * Math.max(.01, p1), 1.4); B.doing.scale.set(1.4, 1.4 * Math.max(.01, p2), 1.4);
  drawTube(B.tangle, t < 10.95 ? .42 * eio(k(t, 8.4, 9.2)) + .58 * eio(k(t, 9.2, 10.4)) : 0);
  // ---- C
  B.namePlate.visible = t > 11.5; B.namePlate.scale.setScalar(Math.max(.01, bo(k(t, 11.5, 11.95))));
  // ---- D/E: the book
  const endT = t >= 34.5;
  const rise = eo(k(t, 15.55, 16.3)), tilt = endT ? 0 : eio(k(t, 16.9, 17.7));
  B.book.position.set(120, lerp(lerp(7.4, 9, rise), 7.6, tilt), lerp(3, 1.6, tilt));
  B.book.rotation.set(-.98 * tilt, endT ? lerp(-.45, .35, k(t, 34.5, 46.5)) : lerp(-.35, 0, eio(k(t, 15.55, 16.9))) * (1 - tilt), 0);
  B.book.scale.setScalar(lerp(.85, 1, rise));
  B.hinge.rotation.y = endT ? 0 : -2.75 * eio(k(t, 17.1, 17.8));
  B.book.updateMatrixWorld();
  const anchor = B.book.localToWorld(V(.3, .4, .3));
  const TH = [[17.4, .72], [17.86, .52], [19.25, .32]];
  B.themes.forEach((m, i) => { const [t0, sy] = TH[i], a = eo(k(t, t0, t0 + .5)), out = eio(k(t, 21.0 + i * .1, 21.6 + i * .1));
    m.visible = t > t0 && out < 1 && t < 29.4; if (!m.visible) return;
    const P = viewPoint(0, sy + out * .6, 18.5); m.position.copy(anchor.clone().lerp(P, a)); m.scale.setScalar(lerp(.3, 1, a) * (1 - out)); m.lookAt(camera.position); m.rotateZ((1 - a) * .3); });
  const tk = eo(k(t, 25.85, 26.35)), tkPark = eio(k(t, 26.9, 27.4));
  B.ticket.visible = t > 25.85 && t < 29.4;
  if (B.ticket.visible) { B.ticket.position.copy(anchor.clone().lerp(viewPoint(0, .4, 13), tk).lerp(viewPoint(0, .74, 16), tkPark)); B.ticket.scale.setScalar(lerp(.3, 1, tk) * lerp(1, .62, tkPark)); B.ticket.lookAt(camera.position); }
  const cl = eo(k(t, 27.0, 27.45));
  B.cal.visible = t > 27.0 && t < 29.4;
  if (B.cal.visible) { B.cal.position.copy(anchor.clone().lerp(viewPoint(0, .02, 13), cl)); B.cal.scale.setScalar(lerp(.3, 1, cl)); B.cal.lookAt(camera.position); }
  B.flapP.rotation.x = -Math.PI * .93 * eio(k(t, 27.4, 27.9));
  const ticks = Math.floor(lerp(0, 30, k(t, 27.9, 29.1)));
  if (ticks !== B.calTicks) { B.calTicks = ticks; const u = B.calTex.userData; B.drawCal(u.g, u.cv.width, u.cv.height, ticks); B.calTex.needsUpdate = true; }
  [[anchor, B.ticket, 26.0, 26.5], [B.ticket, B.cal, 27.2, 27.7]].forEach(([a, b, t0, t1], i) => { const pa = a.isVector3 ? a : a.position; if (!b.visible || t < t0) { B.links[i].visible = false; return; } setSeg(B.links[i], pa, b.position, eio(k(t, t0, t1))); });
  renderer.render(scene, camera);

  // ---- DOM layers
  const dips = [7.12, 10.95, 15.55]; let dip = 0; for (const d of dips) dip = Math.max(dip, 1 - Math.abs(t - d) / .17);
  $('dip').style.opacity = clamp(dip).toFixed(3);
  const lt = eo(k(t, 11.6, 12.1)) * (1 - k(t, 15.2, 15.5)); $('lt').style.opacity = lt; $('lt').style.transform = `translateY(${((1 - eo(k(t, 11.6, 12.1))) * 30).toFixed(1)}px)`;
  $('ltshade').style.opacity = clamp(k(t, 11.2, 11.8)) * (1 - k(t, 15.2, 15.5)); $('ltr').style.width = `${(380 * eio(k(t, 12.0, 12.6))).toFixed(1)}px`;
  const ph = Math.min(k(t, 29.35, 29.7), 1 - k(t, 34.3, 34.65)); $('ph').style.opacity = ph.toFixed(3); $('ph').style.display = ph <= 0 ? 'none' : '';
  $('phimg').style.transform = `scale(${lerp(1.02, 1.12, eio(k(t, 29.35, 34.6))).toFixed(4)})`;
  const S = (id, a, dy = 30) => { const el = $(id), x = eo(k(t, a, a + .45)); el.style.opacity = x; el.style.transform = `translateY(${((1 - x) * dy).toFixed(1)}px)`; };
  S('q1', 29.65); S('q2', 31.7);
  const dim = eio(k(t, 34.6, 35.2));
  canvas.style.filter = dim > 0 ? `blur(${(dim * 8).toFixed(2)}px) brightness(${(1 - dim * .3).toFixed(3)})` : '';
  $('endbg').style.opacity = dim;
  S('e-title', 34.8); S('e-by', 35.3, 20); S('e-stack', 35.1, 140); S('e-reader', 35.4, 140); S('e-paper', 35.9, 20); S('e-kindle', 36.0, 20);
  S('e-avail', 36.1, 20); S('e-url', 41.3, 20); S('e-btn', 42.85);
  const pl = Math.sin(Math.PI * k(t, 43.0, 43.5)); $('e-btn').style.transform += ` scale(${(1 + .05 * pl).toFixed(4)})`; $('e-btn').style.transformOrigin = '0 50%';
  document.querySelector('#e-btn .gl').style.left = `${lerp(-180, 900, eio(k(t, 43.1, 43.8)))}px`;
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
if (!params.has('render')) window.READY.then(() => { const t0 = performance.now();
  const loop = () => { window.seek(((performance.now() - t0) / 1000) % DURATION); requestAnimationFrame(loop); }; loop(); });
</script>
</body>
</html>
