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
    slug: "motion",
    /** позиция двери вдоль коридора, в метрах от входа */
    z: -7,
    side: "left",
    /** материал говорит о проекте раньше, чем ты вошёл */
    door: { panel: "#2b3340", light: "#cfe0f5", window: 0.42 },
    /** iframe с приложением в демо-режиме; данных за ним нет */
    demoSrc: "https://motion-six-murex.vercel.app/demo",
    /** живая ссылка для кнопки на карточке; пусто — кнопки нет */
    href: "https://motion-six-murex.vercel.app/demo",
    /** первый экран проекта, 1440×900; пусто — карточка без картинки */
    shot: "/works/motion.png",
  },
  {
    slug: "snapchef",
    z: -14,
    side: "right",
    door: { panel: "#5a3a22", light: "#ffcf8a", window: 0.3 },
    demoSrc: "https://snap-chef-omega.vercel.app/demo",
    href: "https://snap-chef-omega.vercel.app/demo",
    shot: "/works/snapchef.png",
  },
  {
    /*  Сам этот сайт. Ссылки нет: она вела бы на страницу, на которой
        человек и так стоит.  */
    slug: "portfolio",
    z: -21,
    side: "left",
    door: { panel: "#1d2230", light: "#f0b25e", window: 0.2 },
    demoSrc: "",
    href: "",
    shot: "",
  },
  {
    slug: "axis",
    z: -28,
    side: "right",
    door: { panel: "#22262e", light: "#9fb4cc", window: 0 },
    demoSrc: "",
    href: "https://axios-psi-roan.vercel.app/",
    shot: "",
  },
  {
    slug: "about",
    z: -35,
    side: "left",
    door: { panel: "#3a2f45", light: "#e6d2ff", window: 0 },
    demoSrc: "",
    href: "https://mkeymedia.com/",
    shot: "",
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
  cta?: string;
  /** подпись кнопки-ссылки; пусто — общая «живое демо» */
  link?: string;
  href?: string;
  shot?: string;
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
      cta: copy.cta || undefined,
      link: copy.link || undefined,
      href: geo.href || undefined,
      shot: geo.shot || undefined,
      asks: copy.asks,
    };
  });
}

/*  Контакты — не дверь. До них надо дойти. Порядок совпадает с подписями
    в словаре. Последняя ссылка — резюме: у него своя версия на каждом
    языке, поэтому адрес берётся из словаря, а не отсюда.  */
export const FINALE_HREFS = [
  "mailto:agavrik464@gmail.com",
  "https://t.me/GallessS",
  "https://github.com/gallesSs",
  "https://www.upwork.com/freelancers/galles",
];

export function finaleOf(t: Dict) {
  return {
    kicker: t.finale.kicker,
    title: t.finale.title,
    line: t.finale.line,
    links: t.finale.links.map((label, i) => ({ label, href: FINALE_HREFS[i] ?? t.finale.cv })),
  };
}
