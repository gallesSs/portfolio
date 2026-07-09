import Link from "next/link";
import styles from "./page.module.css";

/*  Развилка на входе. Коридор — не гейт: спешащему видно, куда свернуть,
    и формулировка снимает чувство, что он что-то упускает.  */

export default function Home() {
  return (
    <main className={styles.wrap}>
      <div className={styles.lede}>
        <p className={styles.kicker}>Портфолио</p>
        <h1 className={styles.h1}>Как вы хотите это смотреть?</h1>
        <p className={styles.sub}>
          Одно и то же содержимое, два способа. Оба ведут к одним и тем же проектам — просто один занимает три минуты,
          а другой тридцать секунд.
        </p>
      </div>

      <div className={styles.paths}>
        <Link href="/corridor" className={`${styles.path} ${styles.hero}`}>
          <span className={styles.icon} aria-hidden>
            🚪
          </span>
          <h2 className={styles.h2}>Пройтись по коридору</h2>
          <p className={styles.p}>
            Идёте от первого лица, заглядываете в двери. За каждой — проект и разговор со мной о том, как он делался.
          </p>
          <span className={styles.tag}>Интерактив · ~3 мин</span>
        </Link>

        <Link href="/plain" className={styles.path}>
          <span className={styles.icon} aria-hidden>
            ▤
          </span>
          <h2 className={styles.h2}>Обычное портфолио</h2>
          <p className={styles.p}>
            Список проектов, стек, контакты. Без анимаций и без ходьбы. Если вы спешите — вам сюда.
          </p>
          <span className={styles.tag}>Текст · ~30 сек</span>
        </Link>
      </div>
    </main>
  );
}
