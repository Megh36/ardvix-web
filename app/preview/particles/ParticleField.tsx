"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { buildMarkTargets, MARK_HEIGHT_SVG } from "./sampleMark";

const PARTICLE_COUNT = 3600;
const CONVERGE_RATIO = 0.85; // ~85% converge into the mark, rest keep drifting
const COPPER_RATIO = 0.7;
const CURSOR_RADIUS = 120;
const CURSOR_PUSH = 40;
const SPRING_DAMPING = 0.08;
const MARK_HEIGHT_FRACTION = 0.4; // mark occupies ~40% of viewport height

const OBSIDIAN = 0x0b0b0e;
const COPPER = "#E8541D";
const STEEL_MIST = "#ABB8CC";

const VERTEX_SHADER = `
  attribute float size;
  attribute vec3 color;
  uniform float uPixelRatio;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * uPixelRatio;
  }
`;

const FRAGMENT_SHADER = `
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    float alpha = smoothstep(0.5, 0.15, dist);
    if (alpha <= 0.001) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

/** Three.js "chaos organizes into the arrow" prototype. Raw Three.js, a
 * single Points mesh, CPU-driven position updates (the particle count here
 * is small enough that this is simpler and cheap enough vs. a compute
 * shader). See sampleMark.ts for how the target positions are derived from
 * the actual Ardvix mark geometry. */
export default function ParticleField() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState(0);
  const replayRef = useRef<() => void>(() => {});

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(OBSIDIAN, 1);
    mount.appendChild(renderer.domElement);

    const convergingCount = Math.round(PARTICLE_COUNT * CONVERGE_RATIO);

    // raw target points, pre-centered on (0,0) in SVG units — scaled to
    // world space below, and re-scaled on resize
    const rawTargets = buildMarkTargets(convergingCount);

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colorsAttr = new Float32Array(PARTICLE_COUNT * 3);
    const sizesAttr = new Float32Array(PARTICLE_COUNT);

    const simX = new Float32Array(PARTICLE_COUNT);
    const simY = new Float32Array(PARTICLE_COUNT);
    const velX = new Float32Array(PARTICLE_COUNT);
    const velY = new Float32Array(PARTICLE_COUNT);

    const breathPhase = new Float32Array(convergingCount);
    const breathDirX = new Float32Array(convergingCount);
    const breathDirY = new Float32Array(convergingCount);
    const breathAmp = new Float32Array(convergingCount);
    const targetWorldX = new Float32Array(convergingCount);
    const targetWorldY = new Float32Array(convergingCount);

    const copperColor = new THREE.Color(COPPER);
    const steelMistColor = new THREE.Color(STEEL_MIST);

    function randomScatter(i: number) {
      simX[i] = (Math.random() - 0.5) * width;
      simY[i] = (Math.random() - 0.5) * height;
      const angle = Math.random() * Math.PI * 2;
      const speed = 8 + Math.random() * 18; // px/s
      velX[i] = Math.cos(angle) * speed;
      velY[i] = Math.sin(angle) * speed;
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      randomScatter(i);
      positions[i * 3 + 2] = 0;

      const isLarge = Math.random() < 0.1;
      sizesAttr[i] = isLarge ? 3 + Math.random() : 1.5 + Math.random() * 0.5;

      const c = Math.random() < COPPER_RATIO ? copperColor : steelMistColor;
      colorsAttr[i * 3] = c.r;
      colorsAttr[i * 3 + 1] = c.g;
      colorsAttr[i * 3 + 2] = c.b;

      if (i < convergingCount) {
        breathPhase[i] = Math.random() * Math.PI * 2;
        const dirAngle = Math.random() * Math.PI * 2;
        breathDirX[i] = Math.cos(dirAngle);
        breathDirY[i] = Math.sin(dirAngle);
        breathAmp[i] = 2 + Math.random(); // 2-3px
      }
    }

    function recomputeTargets() {
      const scale = (height * MARK_HEIGHT_FRACTION) / MARK_HEIGHT_SVG;
      for (let i = 0; i < convergingCount; i++) {
        targetWorldX[i] = rawTargets[i * 2] * scale;
        targetWorldY[i] = -rawTargets[i * 2 + 1] * scale; // SVG y grows down, world y grows up
      }
    }
    recomputeTargets();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colorsAttr, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizesAttr, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: { uPixelRatio: { value: pixelRatio } },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // cursor interaction — desktop only
    const mouseWorld = { x: 0, y: 0, active: false };
    const isDesktop = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    function onPointerMove(e: PointerEvent) {
      mouseWorld.x = e.clientX - width / 2;
      mouseWorld.y = -(e.clientY - height / 2);
      mouseWorld.active = true;
    }
    function onPointerOut(e: PointerEvent) {
      if (!e.relatedTarget) mouseWorld.active = false;
    }
    if (isDesktop) {
      window.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerout", onPointerOut);
    }

    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      recomputeTargets();
    }
    window.addEventListener("resize", onResize);

    let phaseStart = performance.now();

    function replay() {
      phaseStart = performance.now();
      for (let i = 0; i < PARTICLE_COUNT; i++) randomScatter(i);
    }
    replayRef.current = replay;

    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

    let raf = 0;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    function animate(now: number) {
      raf = requestAnimationFrame(animate);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      frameCount++;
      if (now - fpsTimer >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - fpsTimer)));
        frameCount = 0;
        fpsTimer = now;
      }

      const elapsed = (now - phaseStart) / 1000;
      const phase = elapsed < 2 ? 1 : elapsed < 5 ? 2 : 3;
      const halfW = width / 2;
      const halfH = height / 2;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const converging = i < convergingCount;

        if (!converging || phase === 1) {
          // brownian drift — chaos phase for everyone, or the ~15% that
          // never converge, indefinitely
          velX[i] += (Math.random() - 0.5) * 6 * dt;
          velY[i] += (Math.random() - 0.5) * 6 * dt;
          velX[i] *= 0.995;
          velY[i] *= 0.995;
          simX[i] += velX[i] * dt;
          simY[i] += velY[i] * dt;

          if (simX[i] > halfW) simX[i] -= width;
          if (simX[i] < -halfW) simX[i] += width;
          if (simY[i] > halfH) simY[i] -= height;
          if (simY[i] < -halfH) simY[i] += height;
        } else {
          let tx = targetWorldX[i];
          let ty = targetWorldY[i];

          if (phase === 3) {
            const osc = Math.sin(
              now * 0.001 * ((Math.PI * 2) / 3) + breathPhase[i]
            );
            tx += breathDirX[i] * breathAmp[i] * osc;
            ty += breathDirY[i] * breathAmp[i] * osc;
          }

          simX[i] += (tx - simX[i]) * SPRING_DAMPING;
          simY[i] += (ty - simY[i]) * SPRING_DAMPING;
        }

        let px = simX[i];
        let py = simY[i];

        if (mouseWorld.active) {
          const dx = px - mouseWorld.x;
          const dy = py - mouseWorld.y;
          const dist = Math.hypot(dx, dy);
          if (dist < CURSOR_RADIUS && dist > 0.0001) {
            const force = 1 - dist / CURSOR_RADIUS;
            const push = force * CURSOR_PUSH;
            px += (dx / dist) * push;
            py += (dy / dist) * push;
          }
        }

        positions[i * 3] = px;
        positions[i * 3 + 1] = py;
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (isDesktop) {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerout", onPointerOut);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div ref={mountRef} className="fixed inset-0" />

      <div
        data-testid="particle-hud"
        className="fixed top-4 left-4 font-mono text-copper text-xs tracking-widest pointer-events-none select-none"
      >
        FPS: {fps} · PARTICLES: {PARTICLE_COUNT}
      </div>

      <button
        data-testid="particle-replay"
        onClick={() => replayRef.current()}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 font-mono text-copper text-xs tracking-widest border border-copper/40 rounded px-4 py-2 hover:bg-copper/10 transition-colors"
      >
        REPLAY
      </button>
    </>
  );
}
