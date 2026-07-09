import Link from "next/link";
import { ROOMS, FINALE } from "@/lib/rooms";
import styles from "./plain.module.css";

/*  Честная альтернатива, а не отговорка: те же данные, что и в коридоре,
    только читаются за полминуты. Отсюда же берётся SEO.  */

export default function Plain() {
  return (
    <main className={styles.wrap}>
      <header>
        <h1 className={styles.h1}>Имя Фамилия</h1>
        <p className={styles.sub}>Одно предложение о том, кто вы и чем полезны. Заглушка — перепишите.</p>
      </header>

      <section>
        <h2 className={styles.section}>Проекты</h2>
        {ROOMS.map((r) => (
          <article key={r.slug} className={styles.row}>
            <div>
              <h3 className={styles.rowTitle}>{r.plate}</h3>
              <p className={styles.rowText}>{r.title}</p>
            </div>
            <span className={styles.stack}>{r.stack}</span>
          </article>
        ))}
      </section>

      <section>
        <h2 className={styles.section}>Контакты</h2>
        <div className={styles.links}>
          {FINALE.links.map((l) => (
            <a key={l.label} href={l.href} className={styles.link}>
              {l.label}
            </a>
          ))}
        </div>
      </section>

      <Link href="/" className={styles.ghost}>
        ← К выбору
      </Link>
    </main>
  );
}
