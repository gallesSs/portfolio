"use client";

import { useEffect, useRef } from "react";
import { onFrame } from "@/lib/scroll";
import s from "./reel.module.css";

/*  Бегущая строка, которая слышит скролл.

    Обычный marquee едет с одной скоростью и потому мёртв. Здесь лента
    разгоняется от скорости прокрутки и наклоняется в её сторону —
    получается инерция, как будто у строки есть вес. Остановились —
    лента возвращается к своему ровному ходу.

    Содержимое размножается, сдвиг берётся по модулю одной копии: шва не
    видно и позиция никогда не убегает в бесконечность. Копий именно
    четыре, а не две, — короткая лента из четырёх слов иначе не
    перекрывает широкий экран, и в ней открывается дыра.  */

const COPIES = 4;

type Props = {
  items: readonly string[];
  /** пикселей за кадр; знак задаёт направление */
  speed?: number;
};

export default function Ticker({ items, speed = 0.6 }: Props) {
  const lane = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lane.current;
    if (!el) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) return;

    let x = 0;
    let unit = el.scrollWidth / COPIES;
    const ro = new ResizeObserver(() => (unit = el.scrollWidth / COPIES));
    ro.observe(el);

    const off = onFrame((f) => {
      if (!unit) return;
      const boost = 1 + Math.min(Math.abs(f.v) * 0.09, 5);
      x -= speed * boost;
      if (x <= -unit) x += unit;
      if (x >= 0) x -= unit;
      const skew = Math.max(-6, Math.min(6, -f.v * 0.14));
      el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
    });

    return () => {
      ro.disconnect();
      off();
    };
  }, [speed]);

  return (
    <div className={s.ticker} data-dir={speed > 0 ? "r" : "l"}>
      <div ref={lane} className={s.laneWrap}>
        {Array.from({ length: COPIES }, (_, i) => (
          <span key={i} className={s.lane} aria-hidden>
            {items.map((it) => (
              <span key={it} className={s.laneItem}>
                {it}
                <i className={s.laneDot}>◆</i>
              </span>
            ))}
          </span>
        ))}
      </div>
      <span className="srOnly">{items.join(", ")}</span>
    </div>
  );
}
