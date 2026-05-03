import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import styles from "./style.module.css";
import type { UmamiMetric, UmamiStats } from "@/libs/umami";
import type { EnrichedMetric } from "@/libs/umami/resolveLabels";

type Props = {
  countries: UmamiMetric[];
  locale: "en" | "ja";
  referrers: UmamiMetric[];
  stats: UmamiStats;
  topPages: EnrichedMetric[];
};

function formatDelta(current: number, prev: number): null | string {
  if (!prev) {
    return null;
  }

  const diff = ((current - prev) / prev) * 100;

  if (Math.abs(diff) < 0.5) {
    return "±0%";
  }

  const sign = diff > 0 ? "↑" : "↓";

  return `${sign}${Math.abs(Math.round(diff))}%`;
}

function countryName(code: string, locale: "en" | "ja"): string {
  try {
    const dn = new Intl.DisplayNames([locale], { type: "region" });

    return dn.of(code) ?? code;
  } catch {
    return code;
  }
}

export default function Stats({
  countries,
  locale,
  referrers,
  stats,
  topPages,
}: Props): React.JSX.Element {
  const t = useTranslations("Stats");
  const summary = [
    {
      delta: formatDelta(stats.pageviews, stats.comparison?.pageviews ?? 0),
      label: t("pageviews"),
      value: stats.pageviews,
    },
    {
      delta: formatDelta(stats.visitors, stats.comparison?.visitors ?? 0),
      label: t("visitors"),
      value: stats.visitors,
    },
    {
      delta: formatDelta(stats.visits, stats.comparison?.visits ?? 0),
      label: t("visits"),
      value: stats.visits,
    },
  ];

  return (
    <>
      <div className={styles.hiddenHeading}>
        <h1>STATS</h1>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.summary}>
            {summary.map(({ delta, label, value }) => (
              <div className={styles.card} key={label}>
                <div className={styles.cardLabel}>{label}</div>
                <div className={styles.cardValue}>{value.toLocaleString()}</div>
                {delta && <div className={styles.cardDelta}>{delta}</div>}
              </div>
            ))}
          </div>
          <h2 className={styles.sectionTitle}>{t("topPages")}</h2>
          <ol className={styles.list}>
            {topPages.map(({ date, href, label, raw, y }) => (
              <li className={styles.row} key={raw}>
                <Link className={styles.link} href={href}>
                  <div className={styles.labelWrapper}>
                    <span className={styles.label}>{label}</span>
                    {date && <span className={styles.date}>{date}</span>}
                  </div>
                  <span className={styles.count}>{y.toLocaleString()} PV</span>
                </Link>
              </li>
            ))}
          </ol>
          <h2 className={styles.sectionTitle}>{t("referrers")}</h2>
          <ol className={styles.list}>
            {referrers.map(({ x, y }) => (
              <li className={styles.row} key={x}>
                <a
                  className={styles.link}
                  href={`https://${x}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className={styles.label}>{x}</span>
                  <span className={styles.count}>{y.toLocaleString()}</span>
                </a>
              </li>
            ))}
          </ol>
          <h2 className={styles.sectionTitle}>{t("countries")}</h2>
          <ol className={styles.list}>
            {countries.map(({ x, y }) => (
              <li className={styles.row} key={x}>
                <div className={styles.link}>
                  <span className={styles.label}>{countryName(x, locale)}</span>
                  <span className={styles.count}>{y.toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
