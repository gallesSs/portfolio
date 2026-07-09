"use client";

import { useEffect, useRef, type RefObject } from "react";
import styles from "./Robot.module.css";

/*  Гид. Взгляд читается как внимание — поэтому глаза важнее рта:
    они следят за курсором всегда, даже когда робот молчит.  */

type Props = {
  /** 0…1, обновляется покадрово голосовым хуком */
  mouth: RefObject<number>;
  speaking: boolean;
};

const EYES = [
  { cx: 40, cy: 52 },
  { cx: 72, cy: 52 },
];

export default function Robot({ mouth, speaking }: Props) {
  const root = useRef<SVGSVGElement>(null);
  const pupils = useRef<(SVGGElement | null)[]>([]);
  const lips = useRef<SVGRectElement>(null);

  useEffect(() => {
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const aim = { x: 0, y: 0 };
    const at = { x: 0, y: 0 };
    let raf = 0;

    const move = (e: PointerEvent) => {
      const box = root.current?.getBoundingClientRect();
      if (!box) return;
      const dx = e.clientX - (box.left + box.width / 2);
      const dy = e.clientY - (box.top + box.height / 2);
      const len = Math.hypot(dx, dy) || 1;
      const reach = Math.min(len / 260, 1); // далеко — глаза уже на упоре
      aim.x = (dx / len) * reach * 5.4;
      aim.y = (dy / len) * reach * 4.2;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);

      at.x += (aim.x - at.x) * 0.12; // зрачок догоняет, а не дёргается
      at.y += (aim.y - at.y) * 0.12;
      for (const p of pupils.current) p?.setAttribute("transform", `translate(${at.x} ${at.y})`);

      if (lips.current) {
        const open = calm ? (speaking ? 0.45 : 0) : mouth.current;
        lips.current.setAttribute("transform", `scale(1 ${0.14 + open * 0.86})`);
      }
    };

    addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [mouth, speaking]);

  return (
    <svg
      ref={root}
      className={`${styles.robot} ${speaking ? styles.live : ""}`}
      viewBox="0 0 112 124"
      role="img"
      aria-label={speaking ? "Гид говорит" : "Гид"}
    >
      {/* антенна */}
      <line x1="56" y1="16" x2="56" y2="4" className={styles.wire} />
      <circle cx="56" cy="4" r="4" className={styles.bulb} />

      {/* голова */}
      <rect x="12" y="16" width="88" height="76" rx="16" className={styles.head} />
      <rect x="20" y="26" width="72" height="44" rx="10" className={styles.visor} />

      {EYES.map((e, i) => (
        <g key={e.cx}>
          <circle cx={e.cx} cy={e.cy} r="11" className={styles.socket} />
          <g
            ref={(g) => {
              pupils.current[i] = g;
            }}
          >
            <circle cx={e.cx} cy={e.cy} r="5.4" className={styles.pupil} />
            <circle cx={e.cx + 1.8} cy={e.cy - 1.8} r="1.6" className={styles.glint} />
          </g>
        </g>
      ))}

      {/* рот: одна планка, которая раскрывается от центра */}
      <g transform="translate(56 80)">
        <rect ref={lips} x="-17" y="-7" width="34" height="14" rx="3" className={styles.mouth} />
      </g>

      {/* шея и плечи — иначе голова висит в пустоте */}
      <rect x="48" y="92" width="16" height="8" className={styles.neck} />
      <path d="M18 124 q38 -26 76 0" className={styles.body} />
    </svg>
  );
}
