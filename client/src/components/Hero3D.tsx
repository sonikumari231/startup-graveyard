import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { buildScene, type Built, type Variant } from "./scenes";

interface Runtime {
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera;
  built: Built | null;
  target: { x: number; y: number };
  cur: { x: number; y: number };
  draw: (t: number) => void;
  size: () => void;
}

/** Pointer-responsive floating memorial stones. Shows nothing if WebGL is unavailable. */
export default function Hero3D() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rt = useRef<Runtime>({
    renderer: null, camera: new THREE.PerspectiveCamera(38, 1, 0.1, 80), built: null,
    target: { x: 0, y: 0 }, cur: { x: 0, y: 0 }, draw: () => {}, size: () => {},
  });
  const [variant] = useState<Variant>("floating");
  const [failed, setFailed] = useState(false);
  const reduce = useRef(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // Renderer, camera, pointer and animation loop (set up once)
  useEffect(() => {
    const host = hostRef.current!;
    const canvas = canvasRef.current!;
    const r = rt.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setClearColor(0x000000, 0);
    r.renderer = renderer;

    r.draw = (t: number) => {
      const b = r.built;
      if (!b) return;
      r.cur.x += (r.target.x - r.cur.x) * 0.05;
      r.cur.y += (r.target.y - r.cur.y) * 0.05;
      const d = b.dist(r.camera.aspect);
      r.camera.position.set(r.cur.x * 2.2 + Math.sin(t * 0.00018) * 0.9, b.camY - r.cur.y * 0.6, d);
      r.camera.lookAt(b.look);
      b.update(t, r.cur);
      renderer.render(b.scene, r.camera);
    };
    r.size = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      r.camera.aspect = w / h;
      r.camera.updateProjectionMatrix();
      r.draw(0);
    };

    const onMove = (e: PointerEvent) => {
      const b = host.getBoundingClientRect();
      r.target.x = ((e.clientX - b.left) / b.width - 0.5) * 2;
      r.target.y = ((e.clientY - b.top) / b.height - 0.5) * 2;
    };
    const onLeave = () => { r.target.x = 0; r.target.y = 0; };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    let visible = true;
    let raf = 0;
    const loop = (t: number) => { if (visible) r.draw(t); raf = requestAnimationFrame(loop); };
    const ro = new ResizeObserver(() => r.size());
    ro.observe(host);
    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; });
    io.observe(host);
    r.size();
    if (!reduce.current) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      renderer.dispose();
      r.renderer = null;
    };
  }, []);

  // Build the chosen scene (again whenever the choice changes)
  useEffect(() => {
    const r = rt.current;
    if (!r.renderer) return;
    const prev = r.built;
    r.built = buildScene(variant);
    prev?.dispose();
    r.draw(0);
    return () => { r.built?.dispose(); r.built = null; };
  }, [variant]);

  if (failed) return null;
  return (
    <>
      <div className="scene" ref={hostRef} aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}
