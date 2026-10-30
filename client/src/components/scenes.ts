import * as THREE from "three";

export type Variant = "house" | "floating" | "coffin" | "graveyard";

export const VARIANTS: { id: Variant; label: string }[] = [
  { id: "house", label: "Haunted house" },
  { id: "floating", label: "Floating stones" },
  { id: "coffin", label: "Coffin" },
  { id: "graveyard", label: "Graveyard" },
];

export interface Built {
  scene: THREE.Scene;
  /** Camera height and look-at point. */
  camY: number;
  look: THREE.Vector3;
  /** Camera distance for a given canvas aspect ratio (wider canvases can sit closer). */
  dist: (aspect: number) => number;
  /** Called every frame. `t` is time in ms, `cur` is the smoothed pointer position (-1 to 1). */
  update: (t: number, cur: { x: number; y: number }) => void;
  dispose: () => void;
}

type Disposable = { dispose: () => void };

function tracker() {
  const list: Disposable[] = [];
  const track = <T extends Disposable>(x: T): T => { list.push(x); return x; };
  const disposeAll = () => { list.forEach((d) => d.dispose()); list.length = 0; };
  return { track, disposeAll };
}
type Track = <T extends Disposable>(x: T) => T;

const AMBER = 0xd98a63;

function std(track: Track, color: number, extra: THREE.MeshStandardMaterialParameters = {}) {
  return track(new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...extra }));
}
function basic(track: Track, color: number, extra: THREE.MeshBasicMaterialParameters = {}) {
  return track(new THREE.MeshBasicMaterial({ color, ...extra }));
}

function ground(track: Track, color = 0x18221b) {
  const g = new THREE.Mesh(track(new THREE.CircleGeometry(20, 56)), std(track, color, { roughness: 1 }));
  g.rotation.x = -Math.PI / 2;
  return g;
}

function addMoon(scene: THREE.Scene, track: Track, x: number, y: number, z: number, r = 1.5) {
  const moon = new THREE.Mesh(track(new THREE.SphereGeometry(r, 36, 36)), basic(track, 0xffefc4, { fog: false }));
  moon.position.set(x, y, z);
  const halo = new THREE.Mesh(
    track(new THREE.SphereGeometry(r * 1.75, 36, 36)),
    basic(track, AMBER, { transparent: true, opacity: 0.06, fog: false, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  halo.position.copy(moon.position);
  scene.add(moon, halo);
  return halo;
}

/** A cloud of small points (fireflies, embers, dust). */
function makePoints(track: Track, n: number, place: (i: number) => [number, number, number], color: number, size: number, opacity = 0.9) {
  const pos = new Float32Array(n * 3);
  const seed: number[] = [];
  for (let i = 0; i < n; i++) {
    const [x, y, z] = place(i);
    pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
    seed.push(Math.random() * 6.28);
  }
  const geo = track(new THREE.BufferGeometry());
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const points = new THREE.Points(geo, track(new THREE.PointsMaterial({ color, size, transparent: true, opacity })));
  return { points, pos, seed, geo };
}

function tombstone(track: Track, w: number, h: number, d: number, cross: boolean, stoneMat: THREE.Material, baseMat: THREE.Material, goldMat: THREE.Material) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(track(new THREE.BoxGeometry(w, h, d)), stoneMat);
  body.position.y = h / 2;
  g.add(body);
  const top = new THREE.Mesh(track(new THREE.CylinderGeometry(w / 2, w / 2, d, 30)), stoneMat);
  top.rotation.x = Math.PI / 2;
  top.position.y = h;
  g.add(top);
  const base = new THREE.Mesh(track(new THREE.BoxGeometry(w * 1.28, h * 0.09, d * 1.7)), baseMat);
  base.position.y = h * 0.045;
  g.add(base);
  if (cross) {
    const v = new THREE.Mesh(track(new THREE.BoxGeometry(w * 0.1, w * 0.52, 0.06)), goldMat);
    v.position.set(0, h * 0.98, d / 2 + 0.02);
    g.add(v);
    const hz = new THREE.Mesh(track(new THREE.BoxGeometry(w * 0.34, w * 0.1, 0.06)), goldMat);
    hz.position.set(0, h * 1.04, d / 2 + 0.02);
    g.add(hz);
  }
  return g;
}

function stoneMaterials(track: Track) {
  return {
    stone: std(track, 0x879486, { roughness: 0.85, metalness: 0.05 }),
    base: std(track, 0x536454),
    gold: std(track, AMBER, { emissive: AMBER, emissiveIntensity: 0.4, roughness: 0.5 }),
  };
}

function baseLights(scene: THREE.Scene, ambient = 3.1, dir = 3.0) {
  const amb = new THREE.AmbientLight(0x657461, ambient);
  const moonLight = new THREE.DirectionalLight(0xd5dbc5, dir);
  moonLight.position.set(-6, 9, 5);
  scene.add(amb, moonLight);
  return { amb, moonLight };
}

/* ------------------------------------------------------------------ */
/* 1. Haunted house with dead trees, bats and lightning                */
/* ------------------------------------------------------------------ */
function house(): Built {
  const { track, disposeAll } = tracker();
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x111712, 12, 32);
  const world = new THREE.Group();
  scene.add(world);
  world.add(ground(track));

  const wall = std(track, 0x2f3560);
  const roofMat = std(track, 0x1a1d38);
  const dark = std(track, 0x0e1022);
  const glow = basic(track, 0xffc766);
  const lit = basic(track, 0xffe0a0);

  const h = new THREE.Group();
  h.position.set(0, 0, -2.5);
  world.add(h);
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(track(geo), mat);
    m.position.set(x, y, z);
    h.add(m);
    return m;
  };
  add(new THREE.BoxGeometry(4.4, 2.8, 3.2), wall, 0, 1.4, 0);
  const roof = add(new THREE.ConeGeometry(3.5, 1.9, 4), roofMat, 0, 3.75, 0);
  roof.rotation.y = Math.PI / 4;
  roof.scale.z = 0.75;
  add(new THREE.CylinderGeometry(0.75, 0.75, 4.6, 18), wall, -2.7, 2.3, -0.2);
  add(new THREE.ConeGeometry(1.05, 1.7, 18), roofMat, -2.7, 5.45, -0.2);
  add(new THREE.BoxGeometry(0.45, 1.1, 0.45), wall, 1.3, 3.7, 0);
  add(new THREE.BoxGeometry(0.9, 1.4, 0.12), dark, 0, 0.7, 1.62);
  // windows (the flickering ones use their own material)
  const flick = [lit, basic(track, 0xffc766), basic(track, 0xffc766)];
  add(new THREE.PlaneGeometry(0.55, 0.85), flick[0], -1.35, 1.7, 1.61);
  add(new THREE.PlaneGeometry(0.55, 0.85), flick[1], 1.35, 1.7, 1.61);
  add(new THREE.PlaneGeometry(0.4, 0.7), flick[2], -2.7, 3.4, 0.57);
  add(new THREE.PlaneGeometry(0.4, 0.6), glow, -2.7, 4.5, 0.57);
  add(new THREE.PlaneGeometry(0.5, 0.5), glow, 1.2, 3.0, 1.2).rotation.y = 0;
  // fence posts
  for (let i = -4; i <= 4; i++) add(new THREE.BoxGeometry(0.1, 0.9, 0.1), dark, i * 0.7, 0.45, 2.4);

  // dead trees
  const treeMat = std(track, 0x0f1124);
  const tree = (x: number, z: number, hgt: number, lean: number) => {
    const t = new THREE.Group();
    const trunk = new THREE.Mesh(track(new THREE.CylinderGeometry(0.1, 0.22, hgt, 7)), treeMat);
    trunk.position.y = hgt / 2;
    t.add(trunk);
    [[0.65, 0.9, 0.9], [0.45, -0.8, 0.7], [0.8, 0.5, -0.8], [0.3, -0.5, -0.6]].forEach(([at, ang, len], i) => {
      const b = new THREE.Mesh(track(new THREE.CylinderGeometry(0.03, 0.07, len, 5)), treeMat);
      b.position.set(Math.sin(ang) * len * 0.4, hgt * at + len * 0.3, i % 2 ? 0.1 : -0.1);
      b.rotation.z = -ang;
      t.add(b);
    });
    t.position.set(x, 0, z);
    t.rotation.z = lean;
    world.add(t);
  };
  tree(-6.2, -1.5, 3.8, 0.06); tree(6.0, -1.2, 4.2, -0.07); tree(-8.6, -4.5, 3.2, 0.1); tree(8.4, -4.8, 3.6, -0.05); tree(-3.6, 1.8, 2.6, -0.08);

  // a few gravestones in front
  const m = stoneMaterials(track);
  [[-3.4, 2.6, 0.9, 1.2, 0.12], [3.3, 2.8, 0.9, 1.1, -0.15], [-5.2, 0.8, 0.8, 1.0, 0.2], [5.4, 1.2, 0.85, 1.1, -0.1]].forEach(([x, z, w, hh, ry]) => {
    const s = tombstone(track, w, hh, 0.3, false, m.stone, m.base, m.gold);
    s.position.set(x, 0, z);
    s.rotation.y = ry;
    world.add(s);
  });

  const halo = addMoon(scene, track, 4.8, 7.2, -15, 1.6);
  const { amb, moonLight } = baseLights(scene);
  const inside = new THREE.PointLight(0xffb85c, 18, 11, 1.3);
  inside.position.set(0, 1.6, -0.6);
  scene.add(inside);

  // bats
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0); wingShape.lineTo(0.5, 0.28); wingShape.lineTo(0.95, 0.12); wingShape.lineTo(0.72, -0.04); wingShape.lineTo(0.46, -0.12); wingShape.lineTo(0.2, -0.05); wingShape.closePath();
  const wingGeo = track(new THREE.ShapeGeometry(wingShape));
  const batMat = basic(track, 0x040510, { side: THREE.DoubleSide });
  const bodyGeo = track(new THREE.SphereGeometry(0.1, 8, 8));
  const bats = Array.from({ length: 8 }, (_, i) => {
    const g = new THREE.Group();
    const l = new THREE.Mesh(wingGeo, batMat);
    const r = new THREE.Mesh(wingGeo, batMat);
    r.scale.x = -1;
    g.add(l, r, new THREE.Mesh(bodyGeo, batMat));
    g.scale.setScalar(0.7);
    scene.add(g);
    return { g, l, r, rad: 4 + (i % 4) * 1.1, y: 4.2 + (i % 3) * 0.9, sp: 0.00035 + i * 0.00002, ph: i * 0.9 };
  });

  const flies = makePoints(track, 60, () => [(Math.random() - 0.5) * 18, 0.4 + Math.random() * 3, -8 + Math.random() * 11], 0xf7cf8e, 0.08);
  world.add(flies.points);

  let nextFlash = 3500, flashUntil = 0;
  return {
    scene, camY: 2.6, look: new THREE.Vector3(0, 2.4, -2.5),
    dist: (a) => (a < 1.1 ? 19 : a < 1.8 ? 15.5 : 13),
    update(t, cur) {
      world.rotation.y = Math.sin(t * 0.00012) * 0.1 + cur.x * 0.1;
      if (t > nextFlash) { flashUntil = t + 140; nextFlash = t + 5500 + Math.random() * 6000; }
      const flash = t < flashUntil ? 1 : 0;
      moonLight.intensity = 3 + flash * 7;
      amb.intensity = 3.1 + flash * 3;
      halo.scale.setScalar(1 + Math.sin(t * 0.0007) * 0.04 + flash * 0.25);
      inside.intensity = 17 + Math.sin(t * 0.012) * 2.4 + Math.sin(t * 0.031) * 1.4;
      flick[0].color.setHex(Math.sin(t * 0.009) > -0.7 ? 0xffe0a0 : 0xb3772f);
      flick[1].color.setHex(Math.sin(t * 0.0057 + 2) > -0.8 ? 0xffc766 : 0x6d4a1c);
      flick[2].color.setHex(Math.sin(t * 0.0081 + 4) > -0.6 ? 0xffc766 : 0x6d4a1c);
      bats.forEach((b) => {
        const a = t * b.sp + b.ph;
        b.g.position.set(Math.cos(a) * b.rad, b.y + Math.sin(a * 2.3) * 0.5, -2.5 + Math.sin(a) * b.rad * 0.55);
        b.g.rotation.y = -a + Math.PI;
        const flap = Math.sin(t * 0.018 + b.ph) * 0.7;
        b.l.rotation.z = flap; b.r.rotation.z = -flap;
      });
      const p = flies.geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < 60; i++) {
        p.array[i * 3 + 1] += Math.sin(t * 0.0012 + flies.seed[i]) * 0.0025;
        p.array[i * 3] += Math.cos(t * 0.0009 + flies.seed[i]) * 0.002;
      }
      p.needsUpdate = true;
    },
    dispose: disposeAll,
  };
}

/* ------------------------------------------------------------------ */
/* 2. Floating stones orbiting a glowing orb                            */
/* ------------------------------------------------------------------ */
function floating(): Built {
  const { track, disposeAll } = tracker();
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x111712, 11, 28);
  scene.add(ground(track));

  const orb = new THREE.Mesh(track(new THREE.SphereGeometry(0.62, 32, 32)), basic(track, 0xf3d8c2, { fog: false }));
  orb.position.set(0, 2.5, 0);
  const halo1 = new THREE.Mesh(track(new THREE.SphereGeometry(1.2, 32, 32)), basic(track, AMBER, { transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  const halo2 = new THREE.Mesh(track(new THREE.SphereGeometry(2.1, 32, 32)), basic(track, AMBER, { transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  halo1.position.copy(orb.position); halo2.position.copy(orb.position);
  scene.add(orb, halo1, halo2);
  const light = new THREE.PointLight(AMBER, 34, 16, 1.2);
  light.position.copy(orb.position);
  scene.add(light);
  baseLights(scene, 2.4, 2.4);

  const ringMat = basic(track, AMBER, { transparent: true, opacity: 0.55, fog: false });
  const rings = [[1.6, 0.4, 0], [2.2, 1.2, 0.5], [2.9, 0.8, 1.1]].map(([r, tx, tz]) => {
    const m = new THREE.Mesh(track(new THREE.TorusGeometry(r, 0.016, 8, 96)), ringMat);
    m.position.copy(orb.position);
    m.rotation.set(tx, 0, tz);
    scene.add(m);
    return m;
  });

  const floor = new THREE.Mesh(
    track(new THREE.RingGeometry(3.9, 4.05, 96)),
    basic(track, AMBER, { transparent: true, opacity: 0.55, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.03;
  scene.add(floor);

  const m = stoneMaterials(track);
  const N = 9;
  const stones = Array.from({ length: N }, (_, i) => {
    const w = 1 + (i % 3) * 0.12, hh = 1.5 + (i % 4) * 0.22;
    const s = tombstone(track, w, hh, 0.42, i % 3 === 0, m.stone, m.base, m.gold);
    scene.add(s);
    return { s, a: (i / N) * Math.PI * 2, r: 4 + (i % 3) * 0.55, y: 0.7 + (i % 4) * 0.35, ph: i * 1.3 };
  });

  const embers = makePoints(track, 110, () => {
    const a = Math.random() * 6.28, r = Math.random() * 5.5;
    return [Math.cos(a) * r, Math.random() * 6, Math.sin(a) * r];
  }, 0xe7a27b, 0.07);
  scene.add(embers.points);

  return {
    scene, camY: 3.2, look: new THREE.Vector3(0, 2.1, 0),
    dist: (a) => (a < 1.1 ? 17 : a < 1.8 ? 13.5 : 11.5),
    update(t, cur) {
      stones.forEach((o) => {
        const a = o.a + t * 0.00014;
        o.s.position.set(Math.cos(a) * o.r, o.y + Math.sin(t * 0.0009 + o.ph) * 0.25, Math.sin(a) * o.r * 0.8);
        o.s.rotation.set(0, Math.atan2(-Math.cos(a), -Math.sin(a * 0.8 + 0.0)), Math.sin(t * 0.0008 + o.ph) * 0.07);
      });
      rings.forEach((r, i) => { r.rotation.y = t * 0.0003 * (i % 2 ? -1 : 1) * (1 + i * 0.3); });
      const pulse = 1 + Math.sin(t * 0.002) * 0.06;
      orb.scale.setScalar(pulse); halo1.scale.setScalar(pulse); halo2.scale.setScalar(1 + Math.sin(t * 0.0013) * 0.08);
      light.intensity = 32 + Math.sin(t * 0.004) * 3;
      floor.scale.setScalar(1 + Math.sin(t * 0.0015) * 0.02);
      const p = embers.geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < 110; i++) {
        p.array[i * 3 + 1] += 0.006 + (i % 5) * 0.0012;
        p.array[i * 3] += Math.sin(t * 0.001 + embers.seed[i]) * 0.003;
        if (p.array[i * 3 + 1] > 6.5) p.array[i * 3 + 1] = 0;
      }
      p.needsUpdate = true;
      scene.rotation.y = cur.x * 0.18;
    },
    dispose: disposeAll,
  };
}

/* ------------------------------------------------------------------ */
/* 3. Coffin lit by candles                                             */
/* ------------------------------------------------------------------ */
function coffin(): Built {
  const { track, disposeAll } = tracker();
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x111712, 12, 30);
  scene.add(ground(track, 0x12162c));

  // soft glow behind the coffin
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,200,120,0.85)"); g.addColorStop(0.45, "rgba(240,185,107,0.28)"); g.addColorStop(1, "rgba(240,185,107,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  }
  const glowTex = track(new THREE.CanvasTexture(c));
  const glow = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })));
  glow.scale.set(11, 11, 1);
  glow.position.set(0, 2.7, -2.2);
  scene.add(glow);

  // coffin body
  const shape = new THREE.Shape();
  shape.moveTo(-0.52, -2.2); shape.lineTo(0.52, -2.2); shape.lineTo(0.88, 0.85); shape.lineTo(0.58, 2.2);
  shape.lineTo(-0.58, 2.2); shape.lineTo(-0.88, 0.85); shape.closePath();
  const geo = track(new THREE.ExtrudeGeometry(shape, { depth: 0.7, bevelEnabled: true, bevelSize: 0.07, bevelThickness: 0.07, bevelSegments: 3 }));
  geo.center();
  const wood = std(track, 0x4a2c1c, { roughness: 0.55, metalness: 0.12 });
  const woodLight = std(track, 0x6a4129, { roughness: 0.5, metalness: 0.15 });
  const gold = std(track, AMBER, { emissive: AMBER, emissiveIntensity: 0.5, roughness: 0.35, metalness: 0.6 });
  const cf = new THREE.Group();
  const body = new THREE.Mesh(geo, wood);
  const panel = new THREE.Mesh(geo, woodLight);
  panel.scale.set(0.74, 0.86, 0.12);
  panel.position.z = 0.44;
  const edges = new THREE.LineSegments(track(new THREE.EdgesGeometry(geo)), track(new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0.45 })));
  const cv = new THREE.Mesh(track(new THREE.BoxGeometry(0.14, 1.1, 0.06)), gold);
  cv.position.set(0, 0.55, 0.52);
  const ch = new THREE.Mesh(track(new THREE.BoxGeometry(0.62, 0.14, 0.06)), gold);
  ch.position.set(0, 0.85, 0.52);
  cf.add(body, panel, edges, cv, ch);
  cf.position.set(0, 2.9, 0);
  cf.rotation.z = 0.05;
  scene.add(cf);

  // candles
  const wax = std(track, 0xe8dcc0, { roughness: 0.7 });
  const flameMat = basic(track, 0xffd07a, { fog: false });
  const candleGeo = track(new THREE.CylinderGeometry(0.11, 0.11, 1, 12));
  const flameGeo = track(new THREE.SphereGeometry(0.085, 10, 10));
  const flames: THREE.Mesh[] = [];
  Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + 0.3;
    const hgt = 0.5 + ((i * 37) % 7) * 0.12;
    const cd = new THREE.Mesh(candleGeo, wax);
    cd.scale.y = hgt;
    cd.position.set(Math.cos(a) * 3.4, hgt / 2, Math.sin(a) * 2.6);
    const fl = new THREE.Mesh(flameGeo, flameMat);
    fl.scale.set(1, 1.5, 1);
    fl.position.set(cd.position.x, hgt + 0.12, cd.position.z);
    scene.add(cd, fl);
    flames.push(fl);
  });
  const l1 = new THREE.PointLight(0xffb85c, 14, 12, 1.3); l1.position.set(-2.6, 1.4, 2.2);
  const l2 = new THREE.PointLight(0xffb85c, 14, 12, 1.3); l2.position.set(2.6, 1.4, 2.2);
  scene.add(l1, l2);
  baseLights(scene, 2.0, 2.0);

  const dust = makePoints(track, 90, () => [(Math.random() - 0.5) * 12, Math.random() * 6, -3 + Math.random() * 7], 0xffd9a0, 0.06, 0.7);
  scene.add(dust.points);

  return {
    scene, camY: 3.0, look: new THREE.Vector3(0, 2.4, 0),
    dist: (a) => (a < 1.1 ? 17 : a < 1.8 ? 13.5 : 11.5),
    update(t, cur) {
      cf.rotation.y = Math.sin(t * 0.0004) * 0.75 + cur.x * 0.5;
      cf.position.y = 2.9 + Math.sin(t * 0.001) * 0.12;
      l1.intensity = 13 + Math.sin(t * 0.011) * 2 + Math.sin(t * 0.029) * 1.2;
      l2.intensity = 13 + Math.sin(t * 0.013 + 1) * 2 + Math.sin(t * 0.023) * 1.2;
      flames.forEach((f, i) => { f.scale.set(1 + Math.sin(t * 0.02 + i) * 0.12, 1.5 + Math.sin(t * 0.017 + i * 2) * 0.25, 1); });
      glow.material.opacity = 0.85 + Math.sin(t * 0.0012) * 0.1;
      const p = dust.geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < 90; i++) {
        p.array[i * 3 + 1] += Math.sin(t * 0.0008 + dust.seed[i]) * 0.003;
        p.array[i * 3] += Math.cos(t * 0.0006 + dust.seed[i]) * 0.002;
      }
      p.needsUpdate = true;
    },
    dispose: () => { disposeAll(); },
  };
}

/* ------------------------------------------------------------------ */
/* 4. Graveyard (the original scene)                                    */
/* ------------------------------------------------------------------ */
function graveyard(): Built {
  const { track, disposeAll } = tracker();
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x111712, 10, 26);
  const world = new THREE.Group();
  scene.add(world);
  world.add(ground(track, 0x18221b));
  const m = stoneMaterials(track);
  const layout: [number, number, number, number, number, number, boolean?][] = [
    [0, 0, 1.7, 2.7, 0, 0, true], [-3.2, -1.2, 1.25, 1.9, 0.14, 0.04], [3.3, -1.0, 1.3, 2.1, -0.12, -0.03],
    [-5.8, -3, 1.15, 1.6, 0.22, 0.05], [5.9, -2.8, 1.2, 1.8, -0.2, -0.04], [-1.9, -4.2, 1.1, 1.7, 0.05, -0.02],
    [2.1, -4.8, 1.2, 1.9, -0.07, 0.03], [-8, -1, 1, 1.4, 0.28, 0.06], [8.1, -1.1, 1, 1.5, -0.25, -0.05],
    [-4.3, -6.2, 1.2, 1.7, 0.1, 0.02], [4.6, -6.6, 1.2, 1.8, -0.1, -0.03],
  ];
  layout.forEach(([x, z, w, h, ry, lz, cross]) => {
    const s = tombstone(track, w, h, 0.5, !!cross, m.stone, m.base, m.gold);
    s.position.set(x, 0, z);
    s.rotation.set(0, ry, lz);
    world.add(s);
  });
  const halo = addMoon(scene, track, -5.6, 5.4, -13);
  baseLights(scene);
  const candle = new THREE.PointLight(AMBER, 22, 12, 1.4);
  candle.position.set(0, 1.3, 2);
  scene.add(candle);
  const flies = makePoints(track, 70, () => [(Math.random() - 0.5) * 16, 0.4 + Math.random() * 3.6, -6 + Math.random() * 8], 0xf7cf8e, 0.09);
  world.add(flies.points);
  return {
    scene, camY: 2.5, look: new THREE.Vector3(0, 1.5, 0),
    dist: (a) => (a < 1.1 ? 15 : a < 1.8 ? 12.5 : 10.5),
    update(t, cur) {
      world.rotation.y = Math.sin(t * 0.00012) * 0.12 + cur.x * 0.08;
      candle.intensity = 20 + Math.sin(t * 0.011) * 2.2 + Math.sin(t * 0.027) * 1.2;
      halo.scale.setScalar(1 + Math.sin(t * 0.0007) * 0.04);
      const p = flies.geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < 70; i++) {
        p.array[i * 3 + 1] += Math.sin(t * 0.0012 + flies.seed[i]) * 0.0025;
        p.array[i * 3] += Math.cos(t * 0.0009 + flies.seed[i]) * 0.002;
      }
      p.needsUpdate = true;
    },
    dispose: disposeAll,
  };
}

export function buildScene(v: Variant): Built {
  switch (v) {
    case "house": return house();
    case "floating": return floating();
    case "coffin": return coffin();
    default: return graveyard();
  }
}
