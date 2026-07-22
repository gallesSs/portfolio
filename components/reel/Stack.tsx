"use client";

import type { Dict } from "@/lib/i18n";
import Ticker from "./Ticker";
import s from "./reel.module.css";

/*  Единственная светлая глава.

    Весь сайт — тёмный, и ровно поэтому здесь он выключает свет наоборот.
    Контраст даёт не новый цвет, а перепад яркости: после трёх экранов
    графита бумага бьёт сильнее любого неона. HUD это замечает сам и
    переворачивается в чёрное (см. Hud.tsx).

    Заголовок здесь не по центру сверху, а боком у левого края — как
    типографская метка на полосе. Соседние главы открываются крупной
    парой «номер + название»; если и эта откроется так же, страница
    начнёт читаться как бланк, заполненный по образцу.

    Место под лентами занимает утверждение, а не цифры. Цифры на сайте
    — самое проверяемое, что на нём есть; ставить туда неизмеренное
    значит подставиться на первом же вопросе.  */

/*  Скорости лент. Соседние всегда разного знака и разной величины:
    две ленты, идущие рядом с одинаковой скоростью, склеиваются в одну
    и весь приём пропадает.  */
const SPEEDS = [0.75, -0.5, 0.42, -0.64];

export default function Stack({ t }: { t: Dict }) {
  return (
    <section id="stack" className={s.paper}>
      <h2 className={s.edgeMark}>{`02 — ${t.reel.stack.title}`}</h2>

      <div className={s.tickers}>
        {t.reel.stack.rows.map((row, i) => (
          <Ticker key={row[0]} items={row} speed={SPEEDS[i % SPEEDS.length]} />
        ))}
      </div>

      <div className={s.paperFoot}>
        <p className={s.manifest}>{t.reel.stack.manifest}</p>
        <p className={`${s.note} ${s.noteDark}`}>{t.reel.notes.stack}</p>
      </div>
    </section>
  );
}
