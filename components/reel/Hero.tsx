"use client";

import { useRef } from "react";

import type { ReelDict } from "@/lib/i18n";
import { clamp01, useFrame } from "@/lib/scroll";
import Kinetic from "./Kinetic";
import Scramble from "./Scramble";
import s from "./reel.module.css";

/*  Первый кадр.

    Две строки намеренно не равны: верхняя идёт в край, нижняя короче и
    прижата вправо. От этого под ней открывается косой провал слева —
    и текст садится прямо в него, вплотную к буквам, а не отъезжает в
    угол экрана. Симметричная раскладка читалась бы как бланк.

    По загрузке сверху вниз проходит луч — буквы проявляются ровно за
    ним. На уходе строки разъезжаются в разные стороны: разъезд
    открывает следующую главу и сразу объясняет, что страница
    читается прокруткой.  */

export default function Hero({ t }: { t: ReelDict }) {
  const big = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const foot = useRef<HTMLDivElement>(null);

  useFrame((f) => {
    const p = clamp01(f.y / Math.max(1, f.h * 0.85));
    const glide = p * p * 260;
    if (big.current) {
      big.current.style.transform = `translate3d(${-glide}px, 0, 0)`;
      big.current.style.opacity = `${1 - p * 0.9}`;
    }
    if (ghost.current) {
      ghost.current.style.transform = `translate3d(${glide * 1.25}px, 0, 0)`;
      ghost.current.style.opacity = `${1 - p * 0.9}`;
    }
    if (foot.current) foot.current.style.opacity = `${1 - clamp01(p * 2.4)}`;
  });

  return (
    <section id="start" className={s.hero}>
      {/* Экранным читалкам и поисковику — обычное предложение, а не
          россыпь букв из декоративных строк ниже. */}
      <h1 className="srOnly">{`${t.name} — ${t.big} ${t.ghost}`}</h1>

      <div className={s.heroMeta}>
        <Scramble className={s.meta} text={t.label} />
        <Scramble className={s.meta} text={t.place} />
      </div>

      <div className={s.heroType}>
        <p className={s.heroName}>
          <Kinetic as="span" className={s.heroNameText} text={t.name} step={22} />
          <i className={s.rule} aria-hidden />
        </p>

        <div ref={big} className={s.heroLine}>
          <Kinetic className={s.big} text={t.big} fit max={280} step={40} flee={20} hidden />
        </div>

        {/*  Вторая строка занимает свою колонку, а слева от неё стоит
             абзац. Подгонка кегля меряет край по колонке, так что строка
             садится в неё ровно, какой бы длины ни было слово.  */}
        <div className={s.heroSplit}>
          <p className={s.heroPitch}>{t.pitch}</p>
          <div ref={ghost} className={s.heroLine}>
            <Kinetic
              className={`${s.big} ${s.bigGhost}`}
              text={t.ghost}
              fit
              max={240}
              step={34}
              delay={280}
              flee={16}
              hidden
            />
          </div>
        </div>

        <p ref={foot} className={s.heroCue}>
          <span aria-hidden>↓</span>
          {t.cue} <kbd>0</kbd>–<kbd>4</kbd> {t.cueTail}
        </p>
      </div>

      <div className={s.scan} aria-hidden />
    </section>
  );
}
