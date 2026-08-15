import { Link } from "@/i18n/navigation";
import { type ComponentProps } from "react";
import { FiChevronRight } from "react-icons/fi";
import styles from "./style.module.css";

export type MenuListItem = {
  href: ComponentProps<typeof Link>["href"];
  label: string;
};

export type MenuListProps = {
  heading: string;
  items: MenuListItem[];
};

/** WRITING や PORTFOLIO のような、下位ページへ振り分ける画面で使う。 */
export default function MenuList({
  heading,
  items,
}: MenuListProps): React.JSX.Element {
  return (
    <>
      <h1 className={styles.heading}>{heading}</h1>
      <ul className={styles.list}>
        {items.map(({ href, label }) => (
          <li className={styles.item} key={label}>
            <Link className={styles.itemInner} href={href}>
              <h2 className={styles.title}>{label}</h2>
              <FiChevronRight className={styles.chevron} size={20} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
