import Link, { type LinkProps } from "next/link";
import styles from "./style.module.css";

export type MenuListItem = {
  href: LinkProps["href"];
  label: string;
};

export type MenuListProps = {
  items: MenuListItem[];
};

/** WRITING や PORTFOLIO のような、下位ページへ振り分けるだけの画面で使う。 */
export default function MenuList({ items }: MenuListProps): React.JSX.Element {
  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {items.map(({ href, label }) => (
          <li className={styles.item} key={label}>
            <Link className={styles.itemInner} href={href}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
