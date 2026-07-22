"use client";

import { useEffect, useRef } from "react";

import type { Dict } from "@/lib/i18n";
import { progressOf, useFrame } from "@/lib/scroll";
import Kinetic from "./Kinetic";
import s from "./reel.module.css";

/*  Линия, которую рисует прокрутка.

    Длину пути спрашиваем у самого SVG, а не считаем руками: на резиновой
    вёрстке она меняется с шириной экрана. Дальше это обычный
    stroke-dashoffset — свойство, которое браузер анимирует без layout.

    Шаг загорается, когда линия до него дошла. Не «появился в зоне
    видимости», а именно дошла — тогда причина и следствие совпадают.  */

export default function Process({ t }: { t: Dict }) {
  const box = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);
  const steps = useRef<HTMLLIElement[]>([]);
  const len = useRef(0);

  useEffect(() => {
    const line = path.current;
    if (!line) return;
    const size = () => {
      len.current = line.getTotalLength();
      line.style.strokeDasharray = `${len.current}`;
      line.style.strokeDashoffset = `${len.current}`;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(line);
    return () => ro.disconnect();
  }, []);

  useFrame((f) => {
    const el = box.current;
    if (!el || !len.current) return;
    // Растягиваем середину прогресса: линия должна дорисоваться раньше,
    // чем секция уедет, иначе последний шаг зажигается за кадром.
    const raw = progressOf(el, f.h);
    const p = Math.max(0, Math.min(1, (raw - 0.15) / 0.55));
    if (path.current) path.current.style.strokeDashoffset = `${len.current * (1 - p)}`;

    for (let i = 0; i < steps.current.length; i++) {
      const on = p > (i + 0.5) / steps.current.length;
      const li = steps.current[i];
      if (li && (li.dataset.on === "on") !== on) li.dataset.on = on ? "on" : "";
    }
  });

  return (
    <section id="how" ref={box} className={s.how}>
      <div className={s.howHead}>
        <p className={s.chapterNo}>03</p>
        <Kinetic as="h2" className={s.chapterTitle} text={t.reel.how.title} mode="drift" step={36} />
      </div>

      <div className={s.howBody}>
        <svg className={s.thread} viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden>
          <path ref={path} d="M1 0 L1 100" />
        </svg>

        <ol className={s.steps}>
          {t.reel.how.steps.map((step, i) => (
            <li
              key={step.t}
              className={s.step}
              ref={(el) => {
                if (el) steps.current[i] = el;
              }}
            >
              <span className={s.stepNo}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={s.stepTitle}>{step.t}</h3>
              <p className={s.stepText}>{step.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
