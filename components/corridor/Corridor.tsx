"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import type { Target } from "@/components/corridor/Scene";
import Cursor from "@/components/Cursor";
import Lang from "@/components/Lang";
import Robot from "@/components/Robot";
import type { Dict, Locale } from "@/lib/i18n";
import type { Room } from "@/lib/rooms";
import { useVoice } from "@/lib/useVoice";
import styles from "./corridor.module.css";

// Three.js не переживает серверный рендер: у него нет ни canvas, ни WebGL.
const Scene = dynamic(() => import("@/components/corridor/Scene"), { ssr: false });

type Finale = {
  kicker: string;
  title: string;
  line: string;
  links: { label: string; href: string }[];
};

type Props = { lang: Locale; t: Dict; rooms: Room[]; finale: Finale };

export default function Corridor({ lang, t, rooms, finale }: Props) {
  const [target, setTarget] = useState<Target>(null);
  const [open, setOpen] = useState<Target>(null);
  const [ready, setReady] = useState(false);
  const [stuck, setStuck] = useState(false);
  /*  null — ещё не мерили. Пока не знаем ширину, сцену не монтируем:
      на телефон тогда не уезжает ни байта three.js, а не просто
      прячется картинка.  */
  const [wide, setWide] = useState<boolean | null>(null);

  const onTarget = useCallback((next: Target) => setTarget(next), []);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const mq = matchMedia("(min-width: 1280px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // WebGL может быть выключен или сломан. Тогда вместо вечной полоски —
  // честное признание и дверь в текстовую версию.
  useEffect(() => {
    if (ready || wide !== true) return;
    const timer = setTimeout(() => setStuck(true), 12000);
    return () => clearTimeout(timer);
  }, [ready, wide]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(null);
      if (e.key.toLowerCase() === "e" && target && !open) setOpen(target);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [target, open]);

  const hint =
    target === "finale" ? t.corridor.enterFinale : target ? `${t.corridor.enter} ${target.plate}` : "";

  /*  Узкий экран — не «неподдерживаемое устройство», а честный отказ.
      Ходьба от первого лица без клавиатуры превращается в борьбу с
      экраном, и притворяться, что это работает, хуже, чем сказать.  */
  if (wide === false) {
    return (
      <main className={styles.wrap}>
        <div className={styles.boot}>
          <p className={styles.bootTitle}>{t.corridor.gateTitle}</p>
          <p className={styles.bootHint}>{t.corridor.gateText}</p>
          <Link href={`/${lang}/reel`} className={styles.bootLink}>
            {t.corridor.bootLink}
          </Link>
          <Link href={`/${lang}`} className={styles.bootBack}>
            {t.corridor.exit}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.wrap}>
      <Cursor />
      {wide && <Scene rooms={rooms} onTarget={onTarget} locked={open !== null} onReady={onReady} />}

      {!ready && (
        <div className={styles.boot}>
          <p className={styles.bootTitle}>{stuck ? t.corridor.bootStuck : t.corridor.bootOn}</p>
          {!stuck && <div className={styles.bootBar} />}
          <p className={styles.bootHint}>{stuck ? t.corridor.bootHintStuck : t.corridor.bootHintOn}</p>
          <Link href={`/${lang}/reel`} className={styles.bootLink}>
            {t.corridor.bootLink}
          </Link>
        </div>
      )}

      <div className={styles.corner}>
        <Link href={`/${lang}`} className={styles.exit} data-magnetic>
          {t.corridor.exit}
        </Link>
        <Lang lang={lang} />
      </div>

      <p className={styles.keys} aria-hidden>
        <kbd>W</kbd>
        <kbd>S</kbd> {t.corridor.keys} <kbd>E</kbd> {t.corridor.keysEnter}
      </p>

      {target && !open && <div className={styles.prompt}>{hint}</div>}

      <div className={styles.touch}>
        <button id="walk-back" aria-label={t.corridor.backward}>
          ↓
        </button>
        <button id="walk-forward" aria-label={t.corridor.forward}>
          ↑
        </button>
      </div>

      {open && open !== "finale" && <RoomPanel t={t} room={open} onClose={() => setOpen(null)} />}
      {open === "finale" && (
        <FinalePanel lang={lang} t={t} finale={finale} onClose={() => setOpen(null)} />
      )}
    </main>
  );
}

/* ─── Комната ─────────────────────────────────────────────────── */

function RoomPanel({ t, room, onClose }: { t: Dict; room: Room; onClose: () => void }) {
  const [asked, setAsked] = useState<number[]>([]);
  const { speak, stop, toggleMute, mouth, speaking, muted, supported } = useVoice(t.speech);

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
                  {t.corridor.listen}
                </button>
                <button className={styles.chip} data-magnetic onClick={toggleMute} aria-pressed={muted}>
                  {muted ? t.corridor.soundOff : t.corridor.soundOn}
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
                  setAsked((prev) => [...prev, i]);
                  speak(ask.a); // клик — это жест пользователя, значит звуку можно
                }}
              >
                {ask.q}
              </button>
            ),
          )}
        </div>

        <button className={styles.ghost} data-magnetic onClick={close}>
          {t.corridor.back}
        </button>
      </article>
    </div>
  );
}

/* ─── Финал ───────────────────────────────────────────────────── */

function FinalePanel({
  lang,
  t,
  finale,
  onClose,
}: {
  lang: Locale;
  t: Dict;
  finale: Finale;
  onClose: () => void;
}) {
  const { speak, stop, mouth, speaking, supported } = useVoice(t.speech);
  useEffect(() => stop, [stop]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal aria-label={finale.title}>
      <article className={`${styles.card} ${styles.lit}`}>
        <p className={styles.kicker}>{finale.kicker}</p>
        <h1 className={styles.title}>{finale.title}</h1>

        <div className={styles.guide}>
          <Robot mouth={mouth} speaking={speaking} />
          <div className={styles.says}>
            <p className={styles.bubble}>{finale.line}</p>
            {supported && (
              <div className={styles.voice}>
                <button className={styles.chip} data-magnetic onClick={() => speak(finale.line)}>
                  {t.corridor.listen}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.links}>
          {finale.links.map((link) => (
            <a key={link.label} href={link.href} className={styles.link} data-magnetic>
              {link.label}
            </a>
          ))}
        </div>

        <div className={styles.ends}>
          <button className={styles.ghost} data-magnetic onClick={onClose}>
            {t.corridor.stay}
          </button>
          <Link href={`/${lang}`} className={styles.ghost} data-magnetic>
            {t.corridor.exit}
          </Link>
        </div>
      </article>
    </div>
  );
}
