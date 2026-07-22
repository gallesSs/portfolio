import { en, type Dict } from "./en";
import { uk } from "./uk";

/*  Словари статические, а не подгружаемые: обе локали вместе весят
    единицы килобайт, зато страницы остаются полностью статическими и
    на клиент уезжает только та, что нужна текущей странице, — потому
    что словарь передаётся пропсом из серверного компонента.  */

export const DICTS = { en, uk } as const;

export type Locale = keyof typeof DICTS;
export type { Dict };

export const LOCALES = Object.keys(DICTS) as Locale[];

/** Английский основной: без префикса и по умолчанию. */
export const DEFAULT_LOCALE: Locale = "en";

export const isLocale = (v: string): v is Locale => v in DICTS;

export const dictOf = (locale: Locale): Dict => DICTS[locale];

/** Тот же путь в другой локали: /uk/reel ↔ /en/reel */
export function swapLocale(pathname: string, next: Locale) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && isLocale(parts[0])) parts[0] = next;
  else parts.unshift(next);
  return `/${parts.join("/")}`;
}
