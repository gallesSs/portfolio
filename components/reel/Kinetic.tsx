"use client";

import { Fragment, useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { onFrame } from "@/lib/scroll";
import s from "./Kinetic.module.css";

/*  Строка, разобранная на буквы.

    Три вложенных span на символ — не блажь: у каждого своё дело.
    .char — маска (overflow: hidden), .in — выезд из-под маски,
    .fl — реакция на курсор. Если сложить выезд и курсор в один
    transform, они начнут спорить за одно свойство, и буква дёрнется.

    fit — подгонка кегля под ширину родителя. Метрики шрифта заранее
    неизвестны (Unbounded широкий, системный fallback — нет), поэтому
    «на глаз в vw» всегда либо не дотягивает до края, либо вылезает.
    Меряем и делим — строка садится в край ровно, на любом экране.  */

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** задержка между буквами, мс */
  step?: number;
  /** задержка всей строки, мс */
  delay?: number;
  /** тянуть кегль до ширины родителя */
  fit?: boolean;
  /** потолок кегля в пикселях, чтобы на 4K строка не съела экран */
  max?: number;
  /*  Как строка появляется. Один и тот же выезд на всей странице —
      главный признак, что вёрстку никто не смотрел глазами: к третьей
      секции движение перестают замечать. Поэтому у каждой главы свой
      способ.  */
  mode?: "rise" | "wipe" | "drift";
  /** насколько буквы разбегаются от курсора, px; 0 — не реагируют */
  flee?: number;
  /** радиус влияния курсора, px */
  reach?: number;
  hidden?: boolean;
};

export default function Kinetic({
  text,
  as: Tag = "span",
  className = "",
  step = 26,
  delay = 0,
  fit = false,
  max = 260,
  mode = "rise",
  flee = 0,
  reach = 190,
  hidden = false,
}: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  /*  TypeScript, увидев ElementType, честно пересекает пропсы всех тегов
      сразу и получает never. Тег здесь всегда простой контейнер, поэтому
      берём пропсы span — от h1 и p они в нужной нам части не отличаются.  */
  const Box = Tag as "span";

  // Показать, когда доехало до экрана. Один раз: повторный проезд
  // мимо уже прочитанного заголовка раздражает.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add(s.on);
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !fit) return;
    const parent = el.parentElement;
    if (!parent) return;

    /*  Подгонка сходится за пару шагов: поставили кегль — строка стала
        другой ширины — поправили. Порог в полпикселя обрывает цикл и
        не даёт ему звенеть на субпикселях.  */
    const apply = () => {
      const box = getComputedStyle(parent);
      const room = parent.clientWidth - parseFloat(box.paddingLeft) - parseFloat(box.paddingRight);
      const now = parseFloat(getComputedStyle(el).fontSize);
      const wide = el.getBoundingClientRect().width;
      if (!room || !wide || !now) return;
      const next = Math.min((now * room) / wide, max);
      if (Math.abs(next - now) < 0.5) return;
      el.style.fontSize = `${next}px`;
    };

    /*  Наблюдаем и за родителем, и за самой строкой. Второе важнее:
        document.fonts.ready умеет разрешиться до того, как шрифт реально
        применён, и тогда мы посчитали бы по метрикам fallback. А вот
        подмена шрифта обязательно меняет ширину строки — и наблюдатель
        об этом узнает, когда бы она ни случилась.  */
    const ro = new ResizeObserver(apply);
    ro.observe(parent);
    ro.observe(el);
    apply();
    return () => ro.disconnect();
  }, [fit, max, text]);

  useEffect(() => {
    const el = root.current;
    if (!el || !flee) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const glyphs = Array.from(el.querySelectorAll<HTMLElement>(`.${s.fl}`));
    let spots: { x: number; y: number }[] = [];
    let last = glyphs.map(() => ({ x: 0, y: 0 }));

    const remeasure = () => {
      // Меряем в покое: собственный сдвиг буквы исказил бы её же центр.
      for (const g of glyphs) g.style.transform = "";
      spots = glyphs.map((g) => {
        const r = g.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 + window.scrollY };
      });
      last = glyphs.map(() => ({ x: 0, y: 0 }));
    };

    // Сначала буквы доезжают из-под маски, и только потом их можно мерить.
    const warm = setTimeout(remeasure, 1200);
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);

    const off = onFrame((f) => {
      if (!spots.length || !f.moved) return;
      const cx = f.mx * f.w;
      const cy = f.my * f.h + f.y;
      const r2 = reach * reach;

      for (let i = 0; i < glyphs.length; i++) {
        const dx = spots[i].x - cx;
        const dy = spots[i].y - cy;
        const d2 = dx * dx + dy * dy;
        const pull = Math.exp(-d2 / r2);
        const d = Math.sqrt(d2) || 1;
        const tx = (dx / d) * pull * flee;
        const ty = (dy / d) * pull * flee * 0.6;
        // Пишем в стиль только когда есть что писать: 30 букв × 60 fps
        // складываются в заметный счёт, если гонять их вхолостую.
        if (Math.abs(tx - last[i].x) < 0.08 && Math.abs(ty - last[i].y) < 0.08) continue;
        last[i] = { x: tx, y: ty };
        glyphs[i].style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      }
    });

    return () => {
      clearTimeout(warm);
      ro.disconnect();
      off();
    };
  }, [flee, reach]);

  let n = 0;

  return (
    <Box
      ref={root}
      className={`${s.root} ${s[mode]} ${fit ? s.fit : ""} ${className}`}
      style={{ "--step": `${step}ms`, "--delay": `${delay}ms` } as CSSProperties}
      aria-label={hidden ? undefined : text}
      aria-hidden={hidden || undefined}
    >
      {words.map((word, w) => (
        <Fragment key={w}>
          {w > 0 && " "}
          <span className={s.word} aria-hidden>
            {Array.from(word).map((ch, c) => (
              <span key={c} className={s.char} style={{ "--i": n++ } as CSSProperties}>
                <span className={s.in}>
                  <span className={s.fl}>{ch}</span>
                </span>
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </Box>
  );
}
