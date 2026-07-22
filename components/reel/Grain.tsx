"use client";

import { useEffect, useRef } from "react";
import s from "./reel.module.css";

/*  Плёночное зерно поверх всего.

    Дешёвый способ: три готовых плитки шума 128×128 и одна заливка
    паттерном на кадр. Перегенерировать шум каждый кадр — это писать
    полтора миллиона пикселей вручную; вместо этого мы тасуем три
    заранее посчитанных и подмешиваем случайный сдвиг, чего глазу
    достаточно, чтобы поверить в живое зерно.

    Холст держим в половину вьюпорта и растягиваем: зерно должно быть
    крупным, а заливка — вчетверо дешевле.  */

const TILE = 128;
const FPS = 14;

export default function Grain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const tiles = Array.from({ length: 3 }, () => {
      const t = document.createElement("canvas");
      t.width = t.height = TILE;
      const tc = t.getContext("2d");
      if (!tc) return t;
      const img = tc.createImageData(TILE, TILE);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 26;
      }
      tc.putImageData(img, 0, 0);
      return t;
    });

    const patterns = tiles.map((t) => ctx.createPattern(t, "repeat"));

    let w = 0;
    let h = 0;
    const size = () => {
      w = cv.width = Math.ceil(window.innerWidth / 2);
      h = cv.height = Math.ceil(window.innerHeight / 2);
    };
    size();
    window.addEventListener("resize", size, { passive: true });

    let raf = 0;
    let last = 0;
    let i = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 1000 / FPS) return;
      last = t;
      const p = patterns[i++ % patterns.length];
      if (!p) return;
      ctx.setTransform(1, 0, 0, 1, -((Math.random() * TILE) | 0), -((Math.random() * TILE) | 0));
      ctx.clearRect(0, 0, w + TILE, h + TILE);
      ctx.fillStyle = p;
      ctx.fillRect(0, 0, w + TILE, h + TILE);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);

  return (
    <div className={s.film} aria-hidden>
      <canvas ref={ref} className={s.grain} />
      <div className={s.vignette} />
      <div className={s.scanlines} />
    </div>
  );
}
