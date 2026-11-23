
// ------------------------------------------------------------------ the surreal ad
// The book stands like a monument. Its cover scribble bursts out as a giant gold tangle,
// which straightens on the floor into the cover's arrow; a tiny figure walks out along it.
scene.fog = null;
scene.background = new THREE.Color('#0a1729');
const B = {};
async function build() {
  await Promise.all(['800 40px Montserrat', '600 40px "Source Serif 4"', 'italic 600 40px "Source Serif 4"'].map(f => document.fonts.load(f)));
  const [frontT, spineT, backT] = await Promise.all(['assets/front-cover.png', 'assets/spine.png', 'assets/back-cover.png'].map(loadTex));
  // seamless navy sweep (floor curving up into the wall)
  const sweepMat = new THREE.MeshStandardMaterial({ color: '#10233f', roughness: .95 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), sweepMat); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const curve = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 120, 48, 1, true, Math.PI, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#10233f', roughness: .95, side: THREE.BackSide }));
  curve.rotation.z = Math.PI / 2; curve.position.set(0, 8, -10); curve.receiveShadow = true; scene.add(curve);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(120, 80), sweepMat); wall.position.set(0, 48, -18); scene.add(wall);
  // the book, a monument
  const book = new THREE.Group(); book.position.set(-1.0, 4.5, -.5); book.rotation.y = .38; scene.add(book); B.book = book;
  const pagesT = canvasTex(64, 512, (g, w, h) => { g.fillStyle = '#efe6d0'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 2) { g.fillStyle = `rgba(120,100,70,${.08 + rnd() * .12})`; g.fillRect(x, 0, 1, h); } });
  const pagesTH = canvasTex(512, 64, (g, w, h) => { g.fillStyle = '#efe6d0'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 2) { g.fillStyle = `rgba(120,100,70,${.08 + rnd() * .12})`; g.fillRect(0, y, w, 1); } });
  const pe = new THREE.MeshStandardMaterial({ map: pagesT, roughness: 1 }), peh = new THREE.MeshStandardMaterial({ map: pagesTH, roughness: 1 });
  const cover = new THREE.MeshStandardMaterial({ map: frontT, roughness: .55, envMapIntensity: .25 });
  const back = new THREE.MeshStandardMaterial({ map: backT, roughness: .55 }), spine = new THREE.MeshStandardMaterial({ map: spineT, roughness: .55 });
  const bk = new THREE.Mesh(new THREE.BoxGeometry(6, 9, .55), [pe, spine, peh, peh, cover, back]); bk.castShadow = bk.receiveShadow = true; book.add(bk);
  // the tangle bursts out of the cover's scribble and lands as a straight arrow path
  const scribble = book.localToWorld(V(-1.0, -1.85, .3));
  const pts = [scribble, scribble.clone().add(V(.5, .5, .9)), scribble.clone().add(V(1.6, 1.4, 1.6))];
  const C = V(3.0, 2.6, 3.4);
  for (let i = 0; i < 26; i++) { const a = i * 2.39996, r = .95 + .5 * Math.sin(i * 1.7), y = Math.sin(i * .9) * 1.15;
    pts.push(C.clone().add(V(Math.cos(a) * r, y, Math.sin(a) * r * .8))); }
  pts.push(V(2.6, .9, 4.4), V(2.75, .2, 5.0), V(3.0, .07, 5.2), V(3.25, .07, 5.38));
  const straightA = V(3.0, .07, 5.2), straightB = V(6.4, .07, 7.6);
  const tangle = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', .5);
  B.tangle = new THREE.Mesh(new THREE.TubeGeometry(tangle, 700, .085, 10, false), M.gold); B.tangle.castShadow = true; B.tangle.userData.segs = 875; /* 700 rings x 10 sides; drawTube counts 8 sides per ring */ scene.add(B.tangle);
  B.path = seg(.085); B.path.castShadow = true; B.pathA = straightA; B.pathB = straightB;
  const head = new THREE.Mesh(new THREE.ConeGeometry(.42, .9, 3), M.gold); head.castShadow = true; scene.add(head); B.head = head;
  // the tiny human: an architectural-model figure in warm ivory
  const fig = new THREE.Group(); scene.add(fig); B.fig = fig;
  const ivory = new THREE.MeshStandardMaterial({ color: '#efe6d2', roughness: .7 });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.05, .13, 6, 12), ivory); torso.position.y = .27; fig.add(torso);
  const hd = new THREE.Mesh(new THREE.SphereGeometry(.042, 16, 12), ivory); hd.position.y = .4; fig.add(hd);
  B.legs = [-1, 1].map(s => { const p = new THREE.Group(); p.position.set(s * .026, .19, 0); const l = new THREE.Mesh(new THREE.CapsuleGeometry(.022, .14, 4, 8), ivory); l.position.y = -.09; p.add(l); fig.add(p); return p; });
  B.arms = [-1, 1].map(s => { const p = new THREE.Group(); p.position.set(s * .065, .33, 0); const a = new THREE.Mesh(new THREE.CapsuleGeometry(.016, .12, 4, 8), ivory); a.position.y = -.08; p.add(a); fig.add(p); return p; });
  fig.traverse(o => { if (o.isMesh) o.castShadow = true; });
  fig.scale.setScalar(2.2);
}
const CAMS = {
  feed: [[0, V(4.5, 8.5, 36), V(1.6, 3.0, 2.0)], [8, V(1.0, 7.6, 33), V(1.6, 3.0, 2.0)]],
  story: [[0, V(4.5, 9.0, 44), V(1.6, 2.4, 2.0)], [8, V(1.0, 8.2, 41), V(1.6, 2.4, 2.0)]],
};
function render(t) {
  const [[, p0, l0], [, p1, l1]] = CAMS[FMT], u = eio(k(t, 0, DURATION));
  camera.position.copy(p0).lerp(p1, u); camera.lookAt(l0.clone().lerp(l1, u)); camera.updateMatrixWorld();
  drawTube(B.tangle, eio(k(t, .2, 3.0)));
  const pf = eio(k(t, 2.9, 3.8)); setSeg(B.path, B.pathA, B.pathB, pf);
  const dir = B.pathB.clone().sub(B.pathA).normalize();
  const tip = B.pathA.clone().lerp(B.pathB, pf).add(dir.clone().multiplyScalar(.4));
  B.head.visible = pf > .02; B.head.position.copy(tip); B.head.quaternion.setFromUnitVectors(V(0, 1, 0), dir); B.head.rotateY(Math.PI / 6); B.head.scale.set(1, 1, .18);
  // the figure walks off the tangle and along the straight path
  const w = k(t, 3.4, 8.0), pos = B.pathA.clone().lerp(B.pathB, .1 + .55 * w); pos.y = .08;
  B.fig.visible = t > 3.2; B.fig.position.copy(pos); B.fig.rotation.y = Math.atan2(dir.x, dir.z);
  const ph = t * 7.5; B.legs[0].rotation.x = Math.sin(ph) * .55; B.legs[1].rotation.x = -Math.sin(ph) * .55; B.arms[0].rotation.x = -Math.sin(ph) * .5; B.arms[1].rotation.x = Math.sin(ph) * .5;
  renderer.render(scene, camera);
  const S = (id, a, dy) => { const el = document.getElementById(id), x = eo(k(t, a, a + .6)); el.style.opacity = x; el.style.transform = `translateY(${((1 - x) * dy).toFixed(1)}px)`; };
  S('brand', .4, -16); S('slogan', 4.6, 30); S('sub', 5.4, 16);
}
window.seek = t => render(t);
window.READY = (async () => { await build(); render(0); return true; })();
if (!params.has('render')) window.READY.then(() => { const t0 = performance.now(); const loop = () => { render(((performance.now() - t0) / 1000) % DURATION); requestAnimationFrame(loop); }; loop(); });
</script>
</body>
</html>
