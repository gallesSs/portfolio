"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*  Голос гида и открывание рта.

    Сейчас говорит браузерный speechSynthesis: ноль зависимостей, ноль денег.
    У него есть ровно одно неустранимое ограничение — он не отдаёт аудиопоток,
    поэтому настоящую амплитуду взять неоткуда, и рот приходится анимировать
    правдоподобным ритмом слогов.

    Когда появятся записанные mp3 (свой голос или клон), путь такой:
    HTMLAudioElement → createMediaElementSource → AnalyserNode, и вместо
    синтетической огибающей в mouth.current пойдёт настоящая громкость.
    Всё остальное — робот, комнаты, реплики — не изменится ни на строку.  */

/*  Голос ищем по языку страницы. Украинских голосов в системах пока
    мало, поэтому отсутствие — штатная ситуация: тогда отдаём тег языка
    синтезатору и пусть выкручивается сам, а не читает украинский текст
    английской фонетикой.  */
function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const base = lang.split("-")[0].toLowerCase();
  const all = speechSynthesis.getVoices().filter((v) => v.lang.replace("_", "-").toLowerCase().startsWith(base));
  if (!all.length) return null;
  // мужской, если система его так называет; иначе первый подходящий
  const male = all.find((v) => /male|man|дмитр|павел|artem|pavel|dmitr/i.test(v.name) && !/female/i.test(v.name));
  return male ?? all[0];
}

export function useVoice(lang: string) {
  const mouth = useRef(0); // 0…1, читается роботом покадрово — без ререндеров
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const speakingRef = useRef(false);

  // Поддержка не меняется во времени — это факт среды, а не состояние.
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    // Голоса приезжают асинхронно — иначе первый вызов останется немым.
    const warm = () => pickVoice(lang);
    speechSynthesis.addEventListener("voiceschanged", warm);
    warm();
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", warm);
      speechSynthesis.cancel();
    };
  }, [supported, lang]);

  // Огибающая рта: быстрый слоговой пульс, поверх — медленное дыхание фразы,
  // плюс паузы между словами. Не липсинк, но ритм речи считывается.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = performance.now() / 1000;

      if (!speakingRef.current) {
        mouth.current += (0 - mouth.current) * 0.18;
        return;
      }

      const syllable = 0.5 + 0.5 * Math.sin(t * 15.5);
      const phrase = 0.55 + 0.45 * Math.sin(t * 3.1 + 1.2);
      const pause = Math.sin(t * 1.7) < -0.62 ? 0.06 : 1; // вдох между словами
      const target = syllable * phrase * pause;

      mouth.current += (target - mouth.current) * 0.35;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const stop = useCallback(() => {
    if (!supported) return;
    speechSynthesis.cancel();
    speakingRef.current = false;
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported || muted || !text) return;

      speechSynthesis.cancel(); // перебиваем предыдущую реплику, а не копим очередь

      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice(lang);
      if (v) u.voice = v;
      u.lang = v?.lang ?? lang;
      u.rate = 1.02;
      u.pitch = 0.82; // чуть ниже — робот, а не диктор новостей

      const start = () => {
        speakingRef.current = true;
        setSpeaking(true);
      };
      const end = () => {
        speakingRef.current = false;
        setSpeaking(false);
      };

      u.onstart = start;
      u.onend = end;
      u.onerror = end;

      speechSynthesis.speak(u);
    },
    [muted, supported, lang],
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      if (!m) stop();
      return !m;
    });
  }, [stop]);

  return { speak, stop, toggleMute, mouth, speaking, muted, supported };
}
