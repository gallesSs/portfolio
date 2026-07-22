"use client";

import { useEffect, useRef, type ElementType } from "react";

/*  Текст, который проявляется из помех.

    Важная мелочь: шум подбирается под алфавит цели. Кириллица шумит
    кириллицей, цифры — цифрами. Иначе строка на секунду становится
    латиницей, и глаз читает это как ошибку кодировки, а не как эффект.

    В разметку сразу уходит готовый текст: он нужен и поисковику, и
    человеку без JS. Помехи включаются только после гидратации.  */

const POOLS = {
  ru: "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ",
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  num: "0123456789",
  sym: "▚▞░▒▓/\\|—+*·",
};

function pool(ch: string) {
  if (/[А-Яа-яЁё]/.test(ch)) return POOLS.ru;
  if (/[A-Za-z]/.test(ch)) return POOLS.en;
  if (/[0-9]/.test(ch)) return POOLS.num;
  return POOLS.sym;
}

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** кадров на символ */
  pace?: number;
  /** пересобирать при наведении */
  hover?: boolean;
};

export default function Scramble({ text, as: Tag = "span", className, pace = 2, hover = true }: Props) {
  const host = useRef<HTMLSpanElement>(null);
  // См. Kinetic.tsx: ElementType в пропсах сводит типы к never.
  const Box = Tag as "span";

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = Array.from(text);
    /*  Кадров на символ — потолок, а не константа. При фиксированных
        двух кадрах строка из сорока пяти символов расшифровывается
        полторы секунды, и всё это время человек смотрит на помехи
        вместо текста. Длинные строки просто едут быстрее.  */
    const step = Math.min(pace, 48 / Math.max(1, chars.length));
    let raf = 0;
    let frame = 0;

    const run = () => {
      cancelAnimationFrame(raf);
      frame = 0;
      const tick = () => {
        frame++;
        let done = true;
        let out = "";
        for (let i = 0; i < chars.length; i++) {
          const ready = frame > i * step + 3;
          if (chars[i] === " " || ready) {
            out += chars[i];
          } else {
            done = false;
            const p = pool(chars[i]);
            out += p[(Math.random() * p.length) | 0];
          }
        }
        el.textContent = out;
        if (!done) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        run();
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    if (hover) el.addEventListener("pointerenter", run);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerenter", run);
      el.textContent = text;
    };
  }, [text, pace, hover]);

  return (
    <Box ref={host} className={className}>
      {text}
    </Box>
  );
}
