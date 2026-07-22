import Cursor from "@/components/Cursor";
import type { Dict, Locale } from "@/lib/i18n";
import { finaleOf, roomsOf } from "@/lib/rooms";
import Contact from "./Contact";
import Grain from "./Grain";
import Hero from "./Hero";
import Hud from "./Hud";
import Process from "./Process";
import Stack from "./Stack";
import Works from "./Works";
import s from "./reel.module.css";

/*  Быстрая версия целиком.

    Вынесена в компонент, потому что живёт по двум адресам: пока коридора
    нет — прямо в корне локали, а когда он вернётся — на /reel. Дублировать
    сборку страницы в двух файлах значило бы однажды поправить один и
    забыть про второй.

    Компонент серверный. Секции клиентские, но всё равно отрисовываются на
    сервере: в HTML лежит готовый текст, а скрипты только оживляют то, что
    уже прочитал поисковик.  */

/*  Карточка проекта на ленте — не вся комната. Вопросы и ответы нужны
    только за дверью в коридоре; отдавать их сюда значит класть в HTML
    страницы диалоги, которых на ней нет.  */
function cards(t: Dict) {
  return roomsOf(t).map(({ slug, plate, kicker, title, stack, line, demo }) => ({
    slug,
    plate,
    kicker,
    title,
    stack,
    line,
    demo: demo && { caption: demo.caption },
  }));
}

export default function Reel({ lang, t }: { lang: Locale; t: Dict }) {
  return (
    <main className={s.page}>
      <Cursor />
      <Grain />
      <Hud lang={lang} t={t.reel} />

      <Hero t={t.reel} />
      <Works lang={lang} t={t.reel} rooms={cards(t)} />
      <Stack t={t.reel} />
      <Process t={t.reel} />
      {/* Контактам нужны только ссылки: реплика и заголовок финала звучат
          в конце коридора, а не здесь. */}
      <Contact lang={lang} t={t.reel} finale={{ links: finaleOf(t).links }} />
    </main>
  );
}
