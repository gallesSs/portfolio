"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/*  Один requestAnimationFrame на всю страницу, один слушатель курсора.
    Никакого Lenis: нативный скролл не перехватываем — иначе ломается
    position: sticky, поиск по странице, скролл с клавиатуры и тачпадная
    инерция, которая у системы всё равно лучше. Сглаживаем не сам скролл,
    а то, что из него считается: сдвиги, скорость, перекос.  */

export type Frame = {
  /** прокрутка в пикселях */
  y: number;
  /** сглаженная скорость, px за кадр; знак — направление */
  v: number;
  /** прогресс по документу, 0..1 */
  p: number;
  /** вьюпорт */
  h: number;
  w: number;
  /** курсор в долях вьюпорта, сглаженный */
  mx: number;
  my: number;
  /** курсор вообще двигали? до первого движения его «центр» — выдумка */
  moved: boolean;
};

type Sub = (f: Frame) => void;

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 0 — элемент только выехал снизу, 1 — уже ушёл за верх */
export function progressOf(el: Element, h: number) {
  const r = el.getBoundingClientRect();
  return clamp01((h - r.top) / (h + r.height));
}

const frame: Frame = { y: 0, v: 0, p: 0, h: 0, w: 0, mx: 0.5, my: 0.5, moved: false };
const subs = new Set<Sub>();

let raf = 0;
let prevY = 0;
let docH = 0;
let rawX = 0.5;
let rawY = 0.5;
let ro: ResizeObserver | null = null;

/*  Высоту документа читаем не каждый кадр: подписчики в этом же кадре пишут
    стили, и чтение геометрии следом заставляло бы браузер пересчитывать
    layout по два раза за кадр. Пересчитываем по ресайзу и по факту.  */
function measure() {
  frame.h = window.innerHeight;
  frame.w = window.innerWidth;
  docH = Math.max(0, document.documentElement.scrollHeight - frame.h);
}

function onMove(e: PointerEvent) {
  rawX = e.clientX / Math.max(1, frame.w);
  rawY = e.clientY / Math.max(1, frame.h);
  // Первое движение ставим без сглаживания: иначе курсор «прилетает»
  // из центра экрана и тянет за собой всё, что на него подписано.
  if (!frame.moved) {
    frame.mx = rawX;
    frame.my = rawY;
    frame.moved = true;
  }
}

function tick() {
  raf = requestAnimationFrame(tick);

  const y = window.scrollY;
  const step = y - prevY;
  prevY = y;

  frame.v = lerp(frame.v, step, 0.2);
  if (Math.abs(frame.v) < 0.02) frame.v = 0;
  frame.y = y;
  frame.p = docH > 0 ? clamp01(y / docH) : 0;
  frame.mx = lerp(frame.mx, rawX, 0.1);
  frame.my = lerp(frame.my, rawY, 0.1);

  for (const s of subs) s(frame);
}

function start() {
  if (raf) return;
  measure();
  prevY = window.scrollY;
  frame.y = prevY;
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("pointermove", onMove, { passive: true });
  ro = new ResizeObserver(measure);
  ro.observe(document.body);
  raf = requestAnimationFrame(tick);
}

function stop() {
  cancelAnimationFrame(raf);
  raf = 0;
  window.removeEventListener("resize", measure);
  window.removeEventListener("pointermove", onMove);
  ro?.disconnect();
  ro = null;
}

export function onFrame(fn: Sub) {
  subs.add(fn);
  start();
  return () => {
    subs.delete(fn);
    if (!subs.size) stop();
  };
}

/** Подписка живёт всю жизнь компонента, а вызывается всегда свежее замыкание. */
export function useFrame(fn: Sub) {
  const held = useRef(fn);
  // Обновляем ссылку после отрисовки, а не во время: во время рендера
  // ref трогать нельзя, и линтер про это справедливо ругается.
  useEffect(() => {
    held.current = fn;
  });
  useEffect(() => onFrame((f) => held.current(f)), []);
}

/** «Поменьше движения» — это не «чуть медленнее», а «выключить». */
export function useCalm() {
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setCalm(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return calm;
}

export function useInView<T extends Element>(ref: RefObject<T | null>, margin = "0px 0px -14% 0px") {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, seen]);
  return seen;
}
