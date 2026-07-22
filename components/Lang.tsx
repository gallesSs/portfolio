"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, swapLocale, type Locale } from "@/lib/i18n";
import s from "./Lang.module.css";

/*  Переключатель языка — две ссылки, а не выпадающий список.

    Двум вариантам список не нужен: он прячет второй язык за лишним
    кликом и не даёт поисковику увидеть связь между версиями. Ссылка
    ведёт на тот же путь в другой локали, так что человек остаётся
    там, где читал, а не вылетает на главную.  */

export default function Lang({ lang, className = "" }: { lang: Locale; className?: string }) {
  const path = usePathname() ?? `/${lang}`;

  return (
    <nav className={`${s.lang} ${className}`} aria-label="Language">
      {LOCALES.map((code) => (
        <Link
          key={code}
          href={swapLocale(path, code)}
          className={s.item}
          hrefLang={code}
          aria-current={code === lang ? "true" : undefined}
          data-magnetic
        >
          {code.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
