import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Cursor from "@/components/Cursor";
import Contact from "@/components/reel/Contact";
import Grain from "@/components/reel/Grain";
import Hero from "@/components/reel/Hero";
import Hud from "@/components/reel/Hud";
import Process from "@/components/reel/Process";
import Stack from "@/components/reel/Stack";
import Works from "@/components/reel/Works";
import s from "@/components/reel/reel.module.css";
import { dictOf, isLocale } from "@/lib/i18n";
import { finaleOf, roomsOf } from "@/lib/rooms";

/*  Быстрая версия — не отговорка и не запасной аэродром.

    Те же проекты, что в коридоре, и тот же источник данных, но другая
    грамматика: коридор — про пространство, рил — про время и буквы.
    Тридцать секунд, обещанные на входе, здесь превращены в приём:
    прокрутка и есть перемотка, а тайм-код в углу показывает, сколько
    осталось.

    Страница серверная. Секции клиентские, но всё равно отрисовываются
    на сервере: в HTML лежит готовый текст, а скрипты только оживляют
    то, что уже прочитал поисковик.  */

export async function generateMetadata({ params }: PageProps<"/[lang]/reel">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = dictOf(lang);
  return { title: t.meta.reel.title, description: t.meta.reel.description };
}

export default async function ReelPage({ params }: PageProps<"/[lang]/reel">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictOf(lang);

  return (
    <main className={s.page}>
      <Cursor />
      <Grain />
      <Hud lang={lang} t={t} />

      <Hero t={t} />
      <Works lang={lang} t={t} rooms={roomsOf(t)} />
      <Stack t={t} />
      <Process t={t} />
      <Contact lang={lang} t={t} finale={finaleOf(t)} />
    </main>
  );
}
