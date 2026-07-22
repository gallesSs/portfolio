import Link from "next/link";
import { notFound } from "next/navigation";

import Lang from "@/components/Lang";
import { dictOf, isLocale } from "@/lib/i18n";
import styles from "./page.module.css";

/*  Развилка на входе. Коридор — не гейт: спешащему видно, куда свернуть,
    и формулировка снимает чувство, что он что-то упускает.  */

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictOf(lang);

  return (
    <main className={styles.wrap}>
      <Lang lang={lang} className={styles.lang} />

      <div className={styles.lede}>
        <p className={styles.kicker}>{t.home.kicker}</p>
        <h1 className={styles.h1}>{t.home.h1}</h1>
        <p className={styles.sub}>{t.home.sub}</p>
      </div>

      <div className={styles.paths}>
        <Link href={`/${lang}/corridor`} className={`${styles.path} ${styles.hero}`}>
          <span className={styles.icon} aria-hidden>
            🚪
          </span>
          <h2 className={styles.h2}>{t.home.corridor.title}</h2>
          <p className={styles.p}>{t.home.corridor.text}</p>
          <span className={styles.tag}>{t.home.corridor.tag}</span>
        </Link>

        <Link href={`/${lang}/reel`} className={styles.path}>
          <span className={styles.icon} aria-hidden>
            ▦
          </span>
          <h2 className={styles.h2}>{t.home.reel.title}</h2>
          <p className={styles.p}>{t.home.reel.text}</p>
          <span className={styles.tag}>{t.home.reel.tag}</span>
        </Link>
      </div>

      {/*  Ниже 1280 карточки коридора нет, но знать о нём стоит: строка
           объясняет, куда он делся, и не оставляет мёртвой плашки на
           экране. Прячет и показывает CSS — развилка отдаётся статикой,
           и подмена после гидратации была бы видна глазом.  */}
      <p className={styles.aside}>{t.home.narrow}</p>
    </main>
  );
}
