"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import type { Dict, Locale } from "@/lib/i18n";
import type { Room } from "@/lib/rooms";
import { clamp01, useFrame } from "@/lib/scroll";
import Kinetic from "./Kinetic";
import s from "./reel.module.css";

/*  Работы едут вбок, пока страница едет вниз.

    Высота секции не берётся из головы: она равна горизонтальному пути
    плюс один экран. Тогда лента доезжает ровно до конца в тот момент,
    когда секция уходит из-под липкого позиционирования, — без рывка
    и без пустого хвоста.

    Смещение догоняет цель с запаздыванием, а разницу между целью и
    текущим положением мы превращаем в наклон. Это и есть ощущение
    веса: лента будто не успевает за рукой.  */

type Props = { lang: Locale; t: Dict; rooms: Room[] };

/*  Ширина и вертикальный снос каждого кадра. Одинаковые карточки через
    равные промежутки — это таблица, а не лента: глаз перестаёт их
    различать уже на втором. Числа подобраны на глаз, и в этом весь
    смысл — ритм должен быть неровным.  */
const SHAPE = [
  { w: 560, drop: 0 },
  { w: 500, drop: 62 },
  { w: 600, drop: -38 },
];

export default function Works({ lang, t, rooms }: Props) {
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const holes = useRef<HTMLDivElement>(null);
  const span = useRef(0);
  const stacked = useRef(false);
  const at = useRef(0);

  useEffect(() => {
    const box = outer.current;
    const rail = track.current;
    if (!box || !rail) return;

    const measure = () => {
      //  Горизонталь включает только скрипт: без JS и на узком экране
      //  остаётся обычная вертикальная лента, из которой ничего не выпало.
      //  «Поменьше движения» отменяет её наравне с узким экраном — боковой
      //  проезд под вертикальный скролл ровно тот приём, от которого у
      //  людей с вестибулярной чувствительностью кружится голова.
      stacked.current =
        matchMedia("(max-width: 900px)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches;
      box.dataset.rail = stacked.current ? "" : "on";
      if (stacked.current) {
        box.style.height = "";
        rail.style.transform = "";
        span.current = 0;
        return;
      }
      span.current = Math.max(0, rail.scrollWidth - window.innerWidth);
      box.style.height = `${span.current + window.innerHeight}px`;
    };

    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useFrame((f) => {
    const box = outer.current;
    const rail = track.current;
    if (!box || !rail || stacked.current || !span.current) return;

    const top = box.getBoundingClientRect().top;
    const run = box.offsetHeight - f.h;
    const p = clamp01(-top / Math.max(1, run));
    const want = -p * span.current;

    const lag = want - at.current;
    at.current += lag * 0.14;

    const skew = Math.max(-5, Math.min(5, lag * 0.03));
    rail.style.transform = `translate3d(${at.current.toFixed(2)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
    if (holes.current) holes.current.style.backgroundPositionX = `${(at.current * 0.45).toFixed(1)}px`;
  });

  return (
    <section id="works" ref={outer} className={s.works}>
      <div className={s.worksStick}>
        <div ref={holes} className={s.holes} aria-hidden />

        <div ref={track} className={s.track}>
          <div className={`${s.slide} ${s.slideOpen}`}>
            <p className={s.chapterNo}>01</p>
            <Kinetic as="h2" className={s.chapterTitle} text={t.reel.works.title} step={40} />
            <p className={s.chapterNote}>{t.reel.works.note}</p>
            <p className={`${s.note} ${s.chapterAside}`}>{t.reel.notes.works}</p>
          </div>

          {rooms.map((room, i) => (
            <article
              key={room.slug}
              className={s.slide}
              data-flip={i % 2 === 1 ? "on" : undefined}
              style={
                {
                  "--w": `${SHAPE[i % SHAPE.length].w}px`,
                  "--drop": `${SHAPE[i % SHAPE.length].drop}px`,
                } as React.CSSProperties
              }
            >
              <span className={s.slideIndex} aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className={s.slideBody}>
                <p className={s.slideKicker}>{room.kicker}</p>
                <Kinetic as="h3" className={s.slidePlate} text={room.plate} mode="wipe" step={32} />
                <p className={s.slideTitle}>{room.title}</p>
                <p className={s.slideStack}>{room.stack}</p>
                <p className={s.slideLine}>{room.line}</p>

                {room.demo && <p className={s.slideDemo}>{room.demo.caption}</p>}

                <Link href={`/${lang}/corridor`} className={s.slideCta} data-magnetic>
                  {t.reel.works.cta}
                  <i aria-hidden>→</i>
                </Link>
              </div>

              <span className={s.slideEdge} aria-hidden>
                {room.slug}
              </span>
            </article>
          ))}

          <div className={`${s.slide} ${s.slideOpen} ${s.slideTail}`} aria-hidden>
            <p className={s.chapterNote}>{t.reel.works.tail}</p>
            <p className={s.chapterNo}>02</p>
          </div>
        </div>
      </div>
    </section>
  );
}
