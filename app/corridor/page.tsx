"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import type { Target } from "@/components/corridor/Scene";
import { FINALE, type Room } from "@/lib/rooms";
import Cursor from "@/components/Cursor";
import Robot from "@/components/Robot";
import { useVoice } from "@/lib/useVoice";
import styles from "./corridor.module.css";

// Three.js не переживает серверный рендер: у него нет ни canvas, ни WebGL.
const Scene = dynamic(() => import("@/components/corridor/Scene"), { ssr: false });

export default function CorridorPage() {
  const [target, setTarget] = useState<Target>(null);
  const [open, setOpen] = useState<Target>(null);
  const [ready, setReady] = useState(false);
  const [stuck, setStuck] = useState(false);

  const onTarget = useCallback((t: Target) => setTarget(t), []);
  const onReady = useCallback(() => setReady(true), []);

  // WebGL может быть выключен или сломан. Тогда вместо вечной полоски —
  // честное признание и дверь в текстовую версию.
  useEffect(() => {
    if (ready) return;
    const t = setTimeout(() => setStuck(true), 12000);
    return () => clearTimeout(t);
  }, [ready]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(null);
      if (e.key.toLowerCase() === "e" && target && !open) setOpen(target);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [target, open]);

  const hint = target === "finale" ? "E — выйти в свет" : target ? `E — войти: ${target.plate}` : "";

  return (
    <main className={styles.wrap}>
      <Cursor />
      <Scene onTarget={onTarget} locked={open !== null} onReady={onReady} />

      {!ready && (
        <div className={styles.boot}>
          <p className={styles.bootTitle}>{stuck ? "Свет не включается" : "Включаем свет"}</p>
          {!stuck && <div className={styles.bootBar} />}
          <p className={styles.bootHint}>
            {stuck
              ? "Похоже, у вашего браузера не вышло с 3D. Ничего страшного — вот то же самое текстом."
              : "Загружается 3D-сцена. Спешите? Есть текстовая версия."}
          </p>
          <Link href="/plain" className={styles.bootLink}>
            → Обычное портфолио
          </Link>
        </div>
      )}

      <Link href="/" className={styles.exit} data-magnetic>
        ← К выбору
      </Link>

      <p className={styles.keys} aria-hidden>
        <kbd>W</kbd>
        <kbd>S</kbd> идти · мышь — осмотреться · <kbd>E</kbd> — войти
      </p>

      {target && !open && <div className={styles.prompt}>{hint}</div>}

      <div className={styles.touch}>
        <button id="walk-back" aria-label="Назад">
          ↓
        </button>
        <button id="walk-forward" aria-label="Вперёд">
          ↑
        </button>
      </div>

      {open && open !== "finale" && <RoomPanel room={open} onClose={() => setOpen(null)} />}
      {open === "finale" && <FinalePanel onClose={() => setOpen(null)} />}
    </main>
  );
}

/* ─── Комната ─────────────────────────────────────────────────── */

function RoomPanel({ room, onClose }: { room: Room; onClose: () => void }) {
  const [asked, setAsked] = useState<number[]>([]);
  const { speak, stop, toggleMute, mouth, speaking, muted, supported } = useVoice();

  // Уходя из комнаты, робот замолкает — иначе он договаривает в пустой коридор.
  useEffect(() => stop, [stop]);

  const close = () => {
    stop();
    onClose();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal aria-label={room.plate}>
      <article className={styles.card}>
        <p className={styles.kicker}>{room.kicker}</p>
        <h1 className={styles.title}>{room.title}</h1>
        <p className={styles.stack}>{room.stack}</p>

        {room.demo && <div className={styles.demo}>{room.demo.caption}</div>}

        <div className={styles.guide}>
          <Robot mouth={mouth} speaking={speaking} />
          <div className={styles.says}>
            <p className={styles.bubble}>{room.line}</p>
            {supported && (
              <div className={styles.voice}>
                <button className={styles.chip} data-magnetic onClick={() => speak(room.line)}>
                  ▶ Послушать
                </button>
                <button className={styles.chip} data-magnetic onClick={toggleMute} aria-pressed={muted}>
                  {muted ? "🔇 Звук выключен" : "🔊 Звук включён"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.asks}>
          {room.asks.map((ask, i) =>
            asked.includes(i) ? (
              <p key={i} className={styles.answer}>
                {ask.a}
              </p>
            ) : (
              <button
                key={i}
                className={styles.ask}
                data-magnetic
                onClick={() => {
                  setAsked((p) => [...p, i]);
                  speak(ask.a); // клик — это жест пользователя, значит звуку можно
                }}
              >
                {ask.q}
              </button>
            ),
          )}
        </div>

        <button className={styles.ghost} data-magnetic onClick={close}>
          ← Вернуться в коридор
        </button>
      </article>
    </div>
  );
}

/* ─── Финал ───────────────────────────────────────────────────── */

function FinalePanel({ onClose }: { onClose: () => void }) {
  const { speak, stop, mouth, speaking, supported } = useVoice();
  useEffect(() => stop, [stop]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal aria-label={FINALE.title}>
      <article className={`${styles.card} ${styles.lit}`}>
        <p className={styles.kicker}>{FINALE.kicker}</p>
        <h1 className={styles.title}>{FINALE.title}</h1>

        <div className={styles.guide}>
          <Robot mouth={mouth} speaking={speaking} />
          <div className={styles.says}>
            <p className={styles.bubble}>{FINALE.line}</p>
            {supported && (
              <div className={styles.voice}>
                <button className={styles.chip} data-magnetic onClick={() => speak(FINALE.line)}>
                  ▶ Послушать
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.links}>
          {FINALE.links.map((l) => (
            <a key={l.label} href={l.href} className={styles.link} data-magnetic>
              {l.label}
            </a>
          ))}
        </div>

        <div className={styles.ends}>
          <button className={styles.ghost} data-magnetic onClick={onClose}>
            ↺ Остаться в коридоре
          </button>
          <Link href="/" className={styles.ghost} data-magnetic>
            ← К выбору
          </Link>
        </div>
      </article>
    </div>
  );
}
