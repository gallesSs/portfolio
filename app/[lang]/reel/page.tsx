import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import Reel from "@/components/reel/Reel";
import { SHOW_CORRIDOR } from "@/lib/flags";
import { dictOf, isLocale } from "@/lib/i18n";

/*  Пока коридора нет, быстрая версия живёт в корне локали, а этот адрес
    только переадресует на неё: ссылки, уже разошедшиеся по переписке и
    скриншотам, не должны упираться в 404.  */

export async function generateMetadata({ params }: PageProps<"/[lang]/reel">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || !SHOW_CORRIDOR) return {};
  const t = dictOf(lang);
  return { title: t.meta.reel.title, description: t.meta.reel.description };
}

export default async function ReelPage({ params }: PageProps<"/[lang]/reel">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (!SHOW_CORRIDOR) redirect(`/${lang}`);

  return <Reel lang={lang} t={dictOf(lang)} />;
}
