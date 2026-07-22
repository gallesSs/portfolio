import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import Corridor from "@/components/corridor/Corridor";
import { SHOW_CORRIDOR } from "@/lib/flags";
import { dictOf, isLocale } from "@/lib/i18n";
import { finaleOf, roomsOf } from "@/lib/rooms";

/*  Серверная обёртка. Она нужна ровно затем, чтобы словарь и текст
    комнат собрались здесь, а на клиент уехала только одна локаль —
    вместе с разметкой, которую уже прочитал поисковик.

    Коридор снят с публики (см. lib/flags.ts): адрес отвечает
    переадресацией, а не ошибкой, — по нему уже могли ходить.  */

export async function generateMetadata({ params }: PageProps<"/[lang]/corridor">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || !SHOW_CORRIDOR) return {};
  const t = dictOf(lang);
  return { title: t.meta.corridor.title, description: t.meta.corridor.description };
}

export default async function CorridorPage({ params }: PageProps<"/[lang]/corridor">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (!SHOW_CORRIDOR) redirect(`/${lang}`);

  const t = dictOf(lang);
  return <Corridor lang={lang} t={t} rooms={roomsOf(t)} finale={finaleOf(t)} />;
}
