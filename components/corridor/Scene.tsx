"use client";

/* eslint-disable react-hooks/immutability --
   В R3F камера, свет и материалы мутируются покадрово внутри useFrame:
   пропустить их через setState значило бы 60 ререндеров в секунду.
   Это не обход правила, а рабочая модель библиотеки. */

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

import { CORRIDOR, type Room } from "@/lib/rooms";
import { wallTexture, wallBump, floorTexture } from "@/lib/textures";
import styles from "./Scene.module.css";

const { width: W, height: H, length: LEN, eye: EYE } = CORRIDOR;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Что сейчас под рукой у идущего: комната, финал или ничего. */
export type Target = Room | "finale" | null;

/* ─── Стены, пол, потолок ─────────────────────────────────────── */

function Shell() {
  const [wall, bump, floor] = useMemo(() => {
    const w = wallTexture();
    w.repeat.set(LEN / 4, 1);
    const b = wallBump();
    b.repeat.set(LEN / 4, 1);
    const f = floorTexture();
    f.repeat.set(2, LEN / 3);
    return [w, b, f];
  }, []);

  useEffect(() => () => [wall, bump, floor].forEach((t) => t.dispose()), [wall, bump, floor]);

  const mid = -LEN / 2;

  return (
    <group>
      <mesh position={[0, 0, mid]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, LEN]} />
        <meshStandardMaterial map={floor} roughness={0.86} metalness={0.05} />
      </mesh>

      <mesh position={[0, H, mid]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, LEN]} />
        <meshStandardMaterial color="#10131a" roughness={1} />
      </mesh>

      <mesh position={[-W / 2, H / 2, mid]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[LEN, H]} />
        <meshStandardMaterial map={wall} bumpMap={bump} bumpScale={0.6} roughness={0.92} />
      </mesh>

      <mesh position={[W / 2, H / 2, mid]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[LEN, H]} />
        <meshStandardMaterial map={wall} bumpMap={bump} bumpScale={0.6} roughness={0.92} />
      </mesh>

      {/* стена за спиной: без неё в первом кадре зияет чернота */}
      <mesh position={[0, H / 2, 1.5]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#12151c" roughness={1} />
      </mesh>
    </group>
  );
}

/* ─── Потолочные лампы ────────────────────────────────────────── */

const LAMPS = [-4, -14.5, -25, -36].map((z, i) => ({ z, flicker: i === 2 }));

function Lamps() {
  const lights = useRef<(THREE.PointLight | null)[]>([]);
  const panels = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    LAMPS.forEach((lamp, i) => {
      const light = lights.current[i];
      const panel = panels.current[i];
      if (!light || !panel) return;

      // одна лампа барахлит — от этого коридор перестаёт быть стерильным
      const f = lamp.flicker ? 0.55 + 0.45 * Math.abs(Math.sin(t * 9.3) * Math.sin(t * 2.1)) : 1;
      light.intensity = 1.9 * f;
      (panel.material as THREE.MeshBasicMaterial).opacity = 0.35 + 0.5 * f;
    });
  });

  return (
    <>
      {LAMPS.map((lamp, i) => (
        <group key={lamp.z} position={[0, H - 0.02, lamp.z]}>
          <mesh
            ref={(m) => {
              panels.current[i] = m;
            }}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.5, 1.7]} />
            <meshBasicMaterial color="#cfe0f5" transparent toneMapped={false} />
          </mesh>
          <pointLight
            ref={(l) => {
              lights.current[i] = l;
            }}
            position={[0, -0.25, 0]}
            color="#bcd2ea"
            distance={9}
            decay={2}
          />
        </group>
      ))}
    </>
  );
}

/* ─── Дверь ───────────────────────────────────────────────────── */

function Door({ room }: { room: Room }) {
  const light = useRef<THREE.PointLight>(null!);
  const hinge = useRef<THREE.Group>(null!);
  const glow = useRef<THREE.Mesh>(null!);
  const plate = useRef<HTMLDivElement>(null);
  const { camera } = useThree();

  const left = room.side === "left";
  const x = left ? -W / 2 + 0.03 : W / 2 - 0.03;
  const ry = left ? Math.PI / 2 : -Math.PI / 2;

  useFrame(() => {
    const dz = Math.abs(camera.position.z - room.z);
    const prox = clamp(1 - dz / 11) ** 2; // вблизи свет разгорается резко, как настоящий

    light.current.intensity = 1.2 + prox * 15; // щель света видна издалека и зовёт подойти
    hinge.current.rotation.y = -prox * 1.2; // распахивается внутрь комнаты, а не в коридор
    (glow.current.material as THREE.MeshBasicMaterial).opacity = 0.2 + prox * 0.8;
    if (plate.current) plate.current.style.opacity = (0.15 + prox * 0.85).toFixed(2);
  });

  return (
    <group position={[x, 0, room.z]} rotation={[0, ry, 0]}>
      {/* проём: то, что светится */}
      <mesh ref={glow} position={[0, 1.1, 0]}>
        <planeGeometry args={[1.15, 2.2]} />
        <meshBasicMaterial color={room.door.light} transparent toneMapped={false} />
      </mesh>

      <pointLight ref={light} position={[0, 1.3, 0.5]} color={room.door.light} distance={9} decay={2} />

      {/* полотно на петле у левого косяка */}
      <group ref={hinge} position={[-0.575, 0, 0.06]}>
        <mesh position={[0.575, 1.1, 0]}>
          <boxGeometry args={[1.15, 2.2, 0.06]} />
          <meshStandardMaterial color={room.door.panel} roughness={0.7} metalness={0.15} />
        </mesh>

        {room.door.window > 0 && (
          <mesh position={[0.575, 1.55, 0.04]}>
            <planeGeometry args={[0.6, 2.2 * room.door.window]} />
            <meshBasicMaterial color={room.door.light} transparent opacity={0.28} toneMapped={false} />
          </mesh>
        )}

        <mesh position={[1.0, 1.05, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.022, 0.16, 4, 8]} />
          <meshStandardMaterial color="#8ea3ba" roughness={0.35} metalness={0.8} />
        </mesh>
      </group>

      <Html position={[0, 2.55, 0.04]} center distanceFactor={7} zIndexRange={[5, 0]}>
        <div ref={plate} className={styles.plate}>
          {room.plate}
        </div>
      </Html>
    </group>
  );
}

/* ─── Торец: то, ради чего идут до конца ──────────────────────── */

function EndWall() {
  const light = useRef<THREE.PointLight>(null!);
  const portal = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();
  const z = -LEN;

  useFrame(() => {
    const prox = clamp(1 - (Math.abs(camera.position.z - z) - 2) / 16) ** 2;
    light.current.intensity = 2 + prox * 26;
    (portal.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + prox * 0.65;
  });

  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, H / 2, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#0d1015" roughness={1} />
      </mesh>

      <mesh ref={portal} position={[0, 1.25, 0.03]}>
        <planeGeometry args={[1.3, 2.5]} />
        <meshBasicMaterial color="#fff0d4" transparent toneMapped={false} />
      </mesh>

      <pointLight ref={light} position={[0, 1.4, 1.2]} color="#f0b25e" distance={22} decay={2} />
    </group>
  );
}

/* ─── Ходьба ──────────────────────────────────────────────────── */

const ACCEL = 26;
const FRICTION = 7;
const MAX_SPEED = 3.1;
const STOP = -(LEN - 1.4);

function Walker({ rooms, onTarget, locked }: { rooms: Room[]; onTarget: (t: Target) => void; locked: boolean }) {
  const { camera } = useThree();
  const vel = useRef(0);
  const yaw = useRef(0);
  const yawTarget = useRef(0);
  const bob = useRef(0);
  const keys = useRef(new Set<string>());
  const touch = useRef(0);
  const current = useRef<Target>(null);

  const reduced = useMemo(
    () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // R3F наводит дефолтную камеру на центр сцены. Стоя на высоте 1.62 м,
  // она смотрит в пол — выпрямляем и фиксируем порядок осей.
  useEffect(() => {
    camera.rotation.order = "YXZ";
    camera.rotation.set(0, 0, 0);
    camera.position.set(0, EYE, 0);
  }, [camera]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    // мышь вправо — голова вправо. Инверсия лечится знаком ровно здесь.
    const move = (e: PointerEvent) => {
      yawTarget.current = -(e.clientX / window.innerWidth - 0.5) * 0.62;
    };
    const blur = () => keys.current.clear();

    addEventListener("keydown", down);
    addEventListener("keyup", up);
    addEventListener("pointermove", move);
    addEventListener("blur", blur);
    return () => {
      removeEventListener("keydown", down);
      removeEventListener("keyup", up);
      removeEventListener("pointermove", move);
      removeEventListener("blur", blur);
    };
  }, []);

  useEffect(() => {
    const fwd = document.getElementById("walk-forward");
    const back = document.getElementById("walk-back");
    if (!fwd || !back) return;

    const hold = (node: HTMLElement, dir: number) => {
      const on = (e: PointerEvent) => {
        e.preventDefault();
        touch.current = dir;
        node.setPointerCapture(e.pointerId);
      };
      const off = () => (touch.current = 0);
      node.addEventListener("pointerdown", on);
      node.addEventListener("pointerup", off);
      node.addEventListener("pointercancel", off);
      return () => {
        node.removeEventListener("pointerdown", on);
        node.removeEventListener("pointerup", off);
        node.removeEventListener("pointercancel", off);
      };
    };

    const a = hold(fwd, 1);
    const b = hold(back, -1);
    return () => {
      a();
      b();
    };
  }, []);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05); // вкладка была в фоне — не телепортируемся

    const k = keys.current;
    const dir = locked
      ? 0
      : (k.has("w") || k.has("arrowup") ? 1 : 0) - (k.has("s") || k.has("arrowdown") ? 1 : 0) + touch.current;

    vel.current += dir * ACCEL * d;
    vel.current -= vel.current * FRICTION * d; // трение: без него ходьба как переключение слайдов
    vel.current = clamp(vel.current, -MAX_SPEED, MAX_SPEED);

    const z = clamp(camera.position.z - vel.current * d, STOP, 0);
    if (z === 0 || z === STOP) vel.current = 0;
    camera.position.z = z;

    if (!locked) yaw.current += (yawTarget.current - yaw.current) * Math.min(1, 8 * d);
    camera.rotation.y = yaw.current;

    bob.current += Math.abs(vel.current) * d * 7;
    const sway = reduced ? 0 : Math.sin(bob.current) * 0.012 * clamp(Math.abs(vel.current) / 2);
    camera.position.y = EYE + sway;

    let next: Target = null;
    for (const r of rooms) if (Math.abs(z - r.z) < 1.7) next = r;
    if (z < STOP + 3) next = "finale"; // у торца финал важнее любой двери

    if (next !== current.current) {
      current.current = next;
      onTarget(next);
    }
  });

  return null;
}

/* ─── Сцена ───────────────────────────────────────────────────── */

export default function Scene({
  rooms,
  onTarget,
  locked,
  onReady,
}: {
  rooms: Room[];
  onTarget: (t: Target) => void;
  locked: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      className={styles.canvas}
      // Теней нет намеренно: тень от точечного источника — это шесть рендеров
      // сцены в кубическую карту за кадр, на каждый источник. В тёмном
      // коридоре её почти не видно, а стоит она дороже всего остального.
      shadows={false}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 68, near: 0.1, far: 90, position: [0, EYE, 0] }}
      onCreated={() => requestAnimationFrame(() => onReady())}
    >
      <color attach="background" args={["#05070a"]} />
      <fog attach="fog" args={["#05070a", 6, 34]} />

      <ambientLight intensity={0.32} />
      <hemisphereLight args={["#2a3444", "#05070a", 0.5]} />

      <Lamps />
      <Shell />
      {rooms.map((r) => (
        <Door key={r.slug} room={r} />
      ))}
      <EndWall />

      <Walker rooms={rooms} onTarget={onTarget} locked={locked} />

      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.42} luminanceSmoothing={0.4} mipmapBlur />
        <Vignette darkness={0.72} offset={0.25} />
      </EffectComposer>
    </Canvas>
  );
}
