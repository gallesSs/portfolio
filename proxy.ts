import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/i18n";

/*  Единственная задача — не отдать страницу без языка в адресе.

    Договариваться о языке с браузером умеем в одну строку и без
    зависимостей: нам нужно выбрать из двух вариантов, а не разрулить
    региональные диалекты. Английский — основной, поэтому всё, что не
    просит украинского явно, уходит на него.  */

function pick(header: string | null) {
  if (!header) return DEFAULT_LOCALE;
  const wanted = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of wanted) if (isLocale(tag)) return tag;
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (LOCALES.some((l) => l === first)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${pick(request.headers.get("accept-language"))}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // статика, файлы Next и всё с точкой в имени сюда не заходят
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
