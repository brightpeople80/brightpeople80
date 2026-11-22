// ------------------------------------------------------------------ helpers
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const k = (t, a, b) => clamp((t - a) / (b - a));
const sm = x => x * x * (3 - 2 * x);
const eo = x => 1 - Math.pow(1 - x, 3);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const bo = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
let seed = 7; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

// ------------------------------------------------------------------ renderer
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(1080, 1920, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#07111f');
scene.fog = new THREE.Fog('#07111f', 90, 180);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environmentIntensity = 0.3;
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(40, 1080 / 1920, 0.5, 300);

scene.add(new THREE.HemisphereLight('#c9d6f0', '#0b1424', 0.32));
const key = new THREE.DirectionalLight('#ffe9c4', 1.15);
key.position.set(-14, 26, 16); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 6; key.shadow.bias = -0.0006;
Object.assign(key.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 80 });
scene.add(key);
const rim = new THREE.DirectionalLight('#8fb3ff', 0.55); rim.position.set(16, 10, -14); scene.add(rim);
const fill = new THREE.PointLight('#ffd38a', 6, 40, 1.6); fill.position.set(4, 9, 14); scene.add(fill);

// ------------------------------------------------------------------ textures
function canvasTex(w, h, draw, repeat) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const g = cv.getContext('2d'); draw(g, w, h);
  const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8;
  if (repeat) { tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(repeat, repeat); }
  tx.userData = { cv, g, draw }; return tx;
}
const grain = (g, w, h, base, amt) => { g.fillStyle = base; g.fillRect(0, 0, w, h);
  const id = g.getImageData(0, 0, w, h); for (let i = 0; i < id.data.length; i += 4) { const n = (rnd() - .5) * amt; id.data[i] += n; id.data[i + 1] += n; id.data[i + 2] += n; } g.putImageData(id, 0, 0); };
const brushed = (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#d9b56a'); gr.addColorStop(.5, '#b08a3e'); gr.addColorStop(1, '#cfa75a');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  for (let i = 0; i < h * 1.4; i++) { g.strokeStyle = `rgba(${rnd() < .5 ? '255,240,200' : '60,40,10'},${rnd() * .12})`; g.lineWidth = rnd() * 1.4; const y = rnd() * h; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + (rnd() - .5) * 2); g.stroke(); } };
const loadTex = src => new Promise(r => new THREE.TextureLoader().load(src, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; r(t); }));

const navyTex = canvasTex(256, 256, (g, w, h) => grain(g, w, h, '#13284a', 14), 6);
const tableTex = canvasTex(256, 256, (g, w, h) => grain(g, w, h, '#0e2140', 12), 40);
const ivoryTex = canvasTex(256, 256, (g, w, h) => grain(g, w, h, '#f1e9d6', 10), 3);
const brassTex = canvasTex(512, 256, brushed);
const M = {
  navy: new THREE.MeshStandardMaterial({ map: navyTex, roughness: .92, metalness: 0 }),
  navyDeep: new THREE.MeshStandardMaterial({ color: '#0d1d36', map: navyTex, roughness: .95 }),
  ivory: new THREE.MeshStandardMaterial({ color: '#eee5cf', map: ivoryTex, roughness: .96 }),
  brass: new THREE.MeshStandardMaterial({ map: brassTex, metalness: .85, roughness: .32, envMapIntensity: 3.5 }),
  gold: new THREE.MeshStandardMaterial({ color: '#fbc312', emissive: '#f2b200', emissiveIntensity: .75, metalness: .3, roughness: .35 }),
  table: new THREE.MeshStandardMaterial({ map: tableTex, roughness: 1 }),
};
const box = (w, h, d, mat) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.castShadow = m.receiveShadow = true; return m; };
const unitBox = mat => box(1, 1, 1, mat);
const faceMats = (side, front, back) => [side, side, side, side, front, back || side];

// ------------------------------------------------------------------ gold line
const Y = V(0, 1, 0);
function seg(r = .07) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 10), M.gold); m.visible = false; scene.add(m); return m; }
function setSeg(m, a, b, f = 1) {
  if (f <= 0.001) { m.visible = false; return; }
  const e = a.clone().lerp(b, f), d = e.clone().sub(a), L = d.length(); if (L < 1e-4) { m.visible = false; return; }
  m.visible = true; m.position.copy(a).add(e).multiplyScalar(.5); m.quaternion.setFromUnitVectors(Y, d.normalize()); m.scale.set(1, L, 1);
}
function tube(points, r = .07, segs = 240) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', .25);
  const g = new THREE.TubeGeometry(curve, segs, r, 8, false); const m = new THREE.Mesh(g, M.gold); m.userData.segs = segs; scene.add(m); return m;
}
const drawTube = (m, f) => { m.visible = f > 0.002; m.geometry.setDrawRange(0, Math.floor(clamp(f) * m.userData.segs) * 8 * 6); };
const dot = () => { const m = new THREE.Mesh(new THREE.SphereGeometry(.16, 16, 12), M.gold); m.visible = false; scene.add(m); return m; };
