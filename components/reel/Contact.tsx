"use client";

import Link from "next/link";

import type { Dict, Locale } from "@/lib/i18n";
import { REEL } from "@/lib/reel";
import Kinetic from "./Kinetic";
import Scramble from "./Scramble";
import s from "./reel.module.css";

/*  Последний кадр.

    Здесь буквы разбегаются от курсора сильнее, чем в шапке: к концу
    страницы человек уже понял правила и начинает играть — пусть слово
    отзывается. Ссылки заливаются слева направо, а подпись под ними
    едет вверх дубликатом: рука видит, куда попала, до клика.  */

type Finale = { links: { label: string; href: string }[] };

export default function Contact({ lang, t, finale }: { lang: Locale; t: Dict; finale: Finale }) {
  return (
    <section id="talk" className={s.talk}>
      {/*  Здесь номер главы намеренно мелкий. Все предыдущие открываются
           крупной цифрой; если и последняя откроется так же, страница
           закончится тем же, чем началась, — и весь проход схлопнется
           в перечисление одинаковых блоков.  */}
      <div className={s.talkHead}>
        <span className={s.talkMark}>04</span>
        <Scramble className={s.meta} text={`${t.reel.place} · ${REEL.year}`} />
      </div>

      {/*  Обёртка обязательна: grid блокифицирует детей, а подгонке кегля
           нужен inline-block — иначе строка «шириной с колонку» всегда
           считается поместившейся.  */}
      <div className={s.talkWrap}>
        <Kinetic as="h2" className={s.talkBig} text={t.reel.talk.big} fit max={300} step={44} flee={34} reach={230} />
      </div>

      <p className={s.talkLine}>{t.reel.talk.line}</p>

      <ul className={s.links}>
        {finale.links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className={s.link} data-magnetic>
              <span className={s.linkLabel}>
                <span>{link.label}</span>
                <span aria-hidden>{link.label}</span>
              </span>
              {/* Пока адреса не проставлены, показываем прочерк, а не «#»:
                  решётка выглядит как недоделка, прочерк — как «пусто». */}
              <span className={s.linkHref} aria-hidden>
                {link.href.replace(/^mailto:|^https?:\/\/|^#$/, "") || "—"}
              </span>
              <i className={s.linkArrow} aria-hidden>
                ↗
              </i>
            </a>
          </li>
        ))}
      </ul>

      <footer className={s.foot}>
        <Link href={`/${lang}`} className={s.footLink} data-magnetic>
          {t.corridor.exit}
        </Link>
        <Link href={`/${lang}/corridor`} className={s.footLink} data-magnetic>
          {t.home.corridor.title} →
        </Link>
      </footer>
    </section>
  );
}
