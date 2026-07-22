"use client";

import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

/*  Курсор — видоискатель, а не украшение.

    Перекрестье идёт за рукой мгновенно, рамка из четырёх уголков
    догоняет с запаздыванием — от этого зазора и возникает ощущение
    веса. Над интерактивным элементом рамка садится точно на его
    границы, как автофокус, поймавший объект: размер и положение
    доезжают той же интерполяцией, поэтому захват выглядит движением,
    а не подменой.

    Цвет не задан вовсе. Слой смешивается по difference, и поэтому
    курсор всегда контрастен фону: на графите он белый, на бумажной
    главе — тёмный. Иначе пришлось бы держать две темы курсора и
    переключать их вместе с секцией.  */

const FREE = 34; // размер рамки в свободном полёте
const PAD = 14; // насколько рамка шире пойманного элемента

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function Cursor() {
  const layer = useRef<HTMLDivElement>(null);
  const cross = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Тач и «поменьше движения» — оставляем родной курсор и не мешаем.
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    document.body.dataset.cursor = "custom";

    const aim = { x: innerWidth / 2, y: innerHeight / 2 };
    const now = { x: aim.x, y: aim.y, w: FREE, h: FREE };
    let held: Element | null = null;
    let raf = 0;

    const move = (e: PointerEvent) => {
      if (layer.current) layer.current.dataset.on = "1";
      aim.x = e.clientX;
      aim.y = e.clientY;
      held = (e.target as Element | null)?.closest?.("[data-magnetic]") ?? null;
      if (cross.current) cross.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const press = (on: boolean) => () => {
      if (!layer.current) return;
      if (on) layer.current.dataset.press = "1";
      else delete layer.current.dataset.press;
    };

    const leave = () => {
      if (layer.current) delete layer.current.dataset.on;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!box.current) return;

      /*  Прямоугольник пойманного элемента читаем каждый кадр, а не
          запоминаем при наведении: страница под курсором прокручивается,
          и запомненные координаты через полсекунды показывают в пустоту.  */
      const r = held?.getBoundingClientRect();
      const toX = r ? r.left + r.width / 2 : aim.x;
      const toY = r ? r.top + r.height / 2 : aim.y;
      const toW = r ? r.width + PAD : FREE;
      const toH = r ? r.height + PAD : FREE;

      now.x = lerp(now.x, toX, 0.18);
      now.y = lerp(now.y, toY, 0.18);
      now.w = lerp(now.w, toW, 0.22);
      now.h = lerp(now.h, toH, 0.22);

      const s = box.current.style;
      s.transform = `translate3d(${now.x.toFixed(1)}px, ${now.y.toFixed(1)}px, 0)`;
      s.width = `${now.w.toFixed(1)}px`;
      s.height = `${now.h.toFixed(1)}px`;
    };

    // Ссылки на обработчики держим свои: press(true) каждый раз создаёт
    // новую функцию, и снять её потом было бы нечем.
    const down = press(true);
    const up = press(false);

    addEventListener("pointermove", move);
    addEventListener("pointerdown", down);
    addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);

    return () => {
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
      delete document.body.dataset.cursor;
    };
  }, []);

  return (
    <div ref={layer} className={styles.layer} aria-hidden>
      <div ref={box} className={styles.box}>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div ref={cross} className={styles.cross}>
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
