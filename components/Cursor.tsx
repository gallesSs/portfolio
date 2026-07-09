"use client";

import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

/*  Точка идёт за мышью мгновенно, кольцо догоняет с запаздыванием —
    от этого зазора и возникает ощущение веса.
    Кольцо примагничивается к элементам с [data-magnetic].  */

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Тач и «поменьше движения» — оставляем родной курсор и не мешаем.
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    document.body.dataset.cursor = "custom";

    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...target };
    let magnet: DOMRect | null = null;
    let raf = 0;

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;

      const hit = (e.target as Element | null)?.closest?.("[data-magnetic]");
      magnet = hit ? hit.getBoundingClientRect() : null;

      if (dot.current) dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!ring.current) return;

      // рядом с кнопкой кольцо липнет к её центру и раздувается по ней
      const gx = magnet ? magnet.left + magnet.width / 2 : target.x;
      const gy = magnet ? magnet.top + magnet.height / 2 : target.y;

      pos.x += (gx - pos.x) * 0.16;
      pos.y += (gy - pos.y) * 0.16;

      const w = magnet ? magnet.width + 14 : 34;
      const h = magnet ? magnet.height + 14 : 34;

      const s = ring.current.style;
      s.transform = `translate(${pos.x}px, ${pos.y}px)`;
      s.width = `${w}px`;
      s.height = `${h}px`;
      s.borderRadius = magnet ? "6px" : "50%";
      s.opacity = magnet ? "0.9" : "0.45";
    };

    addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);

    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      delete document.body.dataset.cursor;
    };
  }, []);

  return (
    <div className={styles.layer} aria-hidden>
      <div ref={ring} className={styles.ring} />
      <div ref={dot} className={styles.dot} />
    </div>
  );
}
