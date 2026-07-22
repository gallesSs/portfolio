import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";
import { notFound } from "next/navigation";

import { LOCALES, dictOf, isLocale } from "@/lib/i18n";
import "../globals.css";

/*  Корневой макет живёт внутри [lang]: только так атрибут lang у <html>
    может быть настоящим. Врать здесь дороже, чем кажется — от него
    зависят перенос слов, кавычки и то, каким голосом читает скринридер.

    Шрифты забираются на сборке и раздаются со своего домена. Кириллица
    и cyrillic-ext обязательны: без второго не будет украинской «ґ».  */

const display = Unbounded({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-display",
  display: "swap",
});

const ui = Manrope({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-ui",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-mono",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = dictOf(lang);
  return {
    title: t.meta.home.title,
    description: t.meta.home.description,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0d11",
  viewportFit: "cover",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={dictOf(lang).html} className={`${display.variable} ${ui.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
