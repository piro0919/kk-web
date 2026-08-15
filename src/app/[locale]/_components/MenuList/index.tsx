import { Link } from "@/i18n/navigation";
import { type ComponentProps } from "react";
import styles from "./style.module.css";

export type MenuListItem = {
  href: ComponentProps<typeof Link>["href"];
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
