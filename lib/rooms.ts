import type { Dict } from "./i18n";

/*  Здесь остаётся только то, что не переводится: геометрия коридора,
    характер дверей и адреса ссылок. Весь текст живёт в словарях и
    приклеивается к геометрии на месте — так коридор, рил и меню не
    могут разойтись, а перевод не может забыть комнату.  */

export type Ask = { q: string; a: string };

export type DoorStyle = {
  /** цвет полотна */
  panel: string;
  /** цвет света из проёма */
  light: string;
  /** окошко в двери: доля высоты, 0 — глухая */
  window: number;
};

export const CORRIDOR = {
  width: 4.2,
  height: 3.2,
  /** до торца со светом */
  length: 46,
  eye: 1.62,
} as const;

const GEO = [
  {
    slug: "tasks",
    /** позиция двери вдоль коридора, в метрах от входа */
    z: -9,
    side: "left",
    /** материал говорит о проекте раньше, чем ты вошёл */
    door: { panel: "#2b3340", light: "#cfe0f5", window: 0.42 },
    /** iframe с приложением в демо-режиме; данных за ним нет */
    demoSrc: "",
  },
  {
    slug: "recipes",
    z: -20,
    side: "right",
    door: { panel: "#5a3a22", light: "#ffcf8a", window: 0.3 },
    demoSrc: "",
  },
  {
    slug: "about",
    z: -31,
    side: "left",
    door: { panel: "#3a2f45", light: "#e6d2ff", window: 0 },
    demoSrc: "",
  },
] as const;

export type RoomSlug = (typeof GEO)[number]["slug"];

export type Room = {
  slug: RoomSlug;
  z: number;
  side: "left" | "right";
  door: DoorStyle;
  /** табличка на двери */
  plate: string;
  kicker: string;
  title: string;
  stack: string;
  line: string;
  demo?: { src: string; caption: string };
  asks: Ask[];
};

export function roomsOf(t: Dict): Room[] {
  return GEO.map((geo) => {
    const copy = t.rooms[geo.slug];
    return {
      slug: geo.slug,
      z: geo.z,
      side: geo.side,
      door: geo.door,
      plate: copy.plate,
      kicker: copy.kicker,
      title: copy.title,
      stack: copy.stack,
      line: copy.line,
      demo: copy.demo ? { src: geo.demoSrc, caption: copy.demo } : undefined,
      asks: copy.asks,
    };
  });
}

/** Контакты — не дверь. До них надо дойти. Порядок совпадает с подписями в словаре. */
export const FINALE_HREFS = ["mailto:", "#", "#", "#"];

export function finaleOf(t: Dict) {
  return {
    kicker: t.finale.kicker,
    title: t.finale.title,
    line: t.finale.line,
    links: t.finale.links.map((label, i) => ({ label, href: FINALE_HREFS[i] ?? "#" })),
  };
}
