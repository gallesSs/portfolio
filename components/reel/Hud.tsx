"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Lang from "@/components/Lang";
import type { Dict, Locale } from "@/lib/i18n";
import { CHAPTERS, REEL } from "@/lib/reel";
import { useFrame } from "@/lib/scroll";
import s from "./reel.module.css";

/*  HUD монтажной: тайм-код, глава, шкала с засечками.

    Идея всей страницы в одной строке справа сверху. Главная обещает
    «тридцать секунд» — здесь это обещание видно и его можно проверить:
    прокрутка и есть время. Заодно шкала честно показывает, сколько
    осталось, — на длинных лендингах этого не хватает больше всего.

    Позиции глав не зашиты в проценты, а спрашиваются у DOM. Секция
    выросла на абзац — засечка уехала сама.  */

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const stamp = (sec: number) => `00:${String(Math.round(sec)).padStart(2, "0")}`;

export default function Hud({ lang, t }: { lang: Locale; t: Dict }) {
  const time = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const fps = useRef<HTMLSpanElement>(null);

  const [marks, setMarks] = useState<number[]>([]);
  const [dev, setDev] = useState(false);

  const spots = useRef<number[]>([]);
  const paper = useRef<HTMLElement | null>(null);
  //  Подписи считаем на каждый рендер, а не кладём в ref: useFrame всегда
  //  вызывает свежее замыкание, так что смена языка доезжает сама.
  const names = CHAPTERS.map((c) => `${c.n} · ${t.reel.chapters[c.id]}`);

  const jump = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  }, []);

  // Где начинается каждая глава и куда ставить засечку на шкале.
  useEffect(() => {
    const survey = () => {
      const doc = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const tops = CHAPTERS.map((c) => {
        const el = document.getElementById(c.id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
      spots.current = tops;
      setMarks(tops.map((top) => Math.min(1, top / doc)));
    };
    paper.current = document.getElementById("stack");
    survey();
    document.fonts?.ready.then(survey).catch(() => {});
    const ro = new ResizeObserver(survey);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  useFrame((f) => {
    if (fill.current) fill.current.style.transform = `scaleX(${f.p})`;
    if (time.current) time.current.textContent = stamp(f.p * REEL.duration);

    if (label.current) {
      const eye = f.y + f.h * 0.35;
      let at = 0;
      for (let i = 0; i < spots.current.length; i++) if (spots.current[i] <= eye) at = i;
      const next = names[at];
      if (label.current.textContent !== next) label.current.textContent = next;
    }

    // На светлой главе HUD переворачивается в чёрное по бумаге.
    if (root.current && paper.current) {
      const r = paper.current.getBoundingClientRect();
      const lit = r.top < f.h * 0.3 && r.bottom > f.h * 0.7;
      if (root.current.dataset.lit !== String(lit)) root.current.dataset.lit = String(lit);
    }
  });

  // Konami — режиссёрская версия: сетка по вёрстке и счётчик кадров.
  useEffect(() => {
    let seq = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const i = CHAPTERS.findIndex((c) => c.n === `0${e.key}`);
      if (i >= 0) {
        e.preventDefault();
        jump(CHAPTERS[i].id);
      }

      const hit = (n: number) => e.key === KONAMI[n] || e.key.toLowerCase() === KONAMI[n];
      seq = hit(seq) ? seq + 1 : hit(0) ? 1 : 0;
      if (seq === KONAMI.length) {
        seq = 0;
        setDev((v) => !v);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [jump]);

  useEffect(() => {
    document.documentElement.dataset.dev = dev ? "on" : "";
    if (!dev) return;

    let raf = 0;
    let n = 0;
    let mark = performance.now();
    const beat = () => {
      raf = requestAnimationFrame(beat);
      n++;
      const now = performance.now();
      if (now - mark < 500) return;
      if (fps.current) fps.current.textContent = String(Math.round((n * 1000) / (now - mark)));
      n = 0;
      mark = now;
    };
    raf = requestAnimationFrame(beat);
    return () => cancelAnimationFrame(raf);
  }, [dev]);

  return (
    <div ref={root} className={s.hud}>
      <div className={s.hudTop}>
        <span className={s.hudLeft}>
          <span className={s.rec}>
            <i aria-hidden />
            {t.reel.hud.rec}
          </span>
          <Lang lang={lang} className={s.hudLang} />
        </span>

        <span ref={label} className={s.hudChapter}>
          {names[0]}
        </span>

        <span className={s.hudTime}>
          <span ref={time}>00:00</span>
          <em>/ {stamp(REEL.duration)}</em>
        </span>
      </div>

      <div className={s.scrub}>
        <div className={s.scrubTrack}>
          <div ref={fill} className={s.scrubFill} />
        </div>
        {marks.map((at, i) => (
          <button
            key={CHAPTERS[i].id}
            className={s.mark}
            style={{ left: `${at * 100}%` }}
            onClick={() => jump(CHAPTERS[i].id)}
            data-magnetic
            title={names[i]}
          >
            <span className={s.markDot} aria-hidden />
            <span className={s.markText}>{CHAPTERS[i].n}</span>
            <span className="srOnly">{`${t.reel.hud.jump}: ${t.reel.chapters[CHAPTERS[i].id]}`}</span>
          </button>
        ))}
      </div>

      {dev && (
        <div className={s.dev}>
          <span>{t.reel.hud.dev}</span>
          <span>
            <span ref={fps}>60</span> fps
          </span>
          <span>{t.reel.hud.devOff}</span>
        </div>
      )}
    </div>
  );
}
