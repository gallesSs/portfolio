import type { Dict } from "./i18n";

/*  Числа и идентификаторы быстрой версии. Подписи к ним — в словарях:
    цифру «98» переводить незачем, а «средний Lighthouse» — надо.  */

export const REEL = {
  /*  География переехала в словари: «Ukraine · remote» и «Україна ·
      віддалено» — это текст, а не настройка.  */
  year: "2026",
  /** хронометраж рила в секундах — из него считается тайм-код в HUD */
  duration: 30,
} as const;

export type ChapterId = keyof Dict["reel"]["chapters"];

/*  Порядок обязан совпадать с порядком секций на странице: HUD берёт
    отсюда идентификаторы и спрашивает у DOM, где они лежат.  */
export const CHAPTERS: { id: ChapterId; n: string }[] = [
  { id: "start", n: "00" },
  { id: "works", n: "01" },
  { id: "stack", n: "02" },
  { id: "how", n: "03" },
  { id: "talk", n: "04" },
];

