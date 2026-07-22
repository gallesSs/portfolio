import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Corridor from "@/components/corridor/Corridor";
import { dictOf, isLocale } from "@/lib/i18n";
import { finaleOf, roomsOf } from "@/lib/rooms";

/*  Серверная обёртка. Она нужна ровно за тем, чтобы словарь и текст
    комнат собрались здесь, а на клиент уехала только одна локаль —
    вместе с разметкой, которую уже прочитал поисковик.  */

export async function generateMetadata({ params }: PageProps<"/[lang]/corridor">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = dictOf(lang);
  return { title: t.meta.corridor.title, description: t.meta.corridor.description };
}

export default async function CorridorPage({ params }: PageProps<"/[lang]/corridor">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictOf(lang);

  return <Corridor lang={lang} t={t} rooms={roomsOf(t)} finale={finaleOf(t)} />;
}
