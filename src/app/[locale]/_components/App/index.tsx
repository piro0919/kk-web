import clsx from "clsx";
import { format, getDate } from "date-fns";
import { Noto_Sans as NotoSans } from "next/font/google";
import Image from "next/image";
import seedrandom from "seedrandom";
import styles from "./style.module.css";

const notoSans = NotoSans({
  fallback: ["sans-serif"],
  preload: true,
  subsets: ["latin"],
  weight: "700",
});

export default function App(): React.JSX.Element {
  const today = new Date();
  const date = getDate(today);
  const isTsumugi = date % 2 > 0;
  const seed = format(today, "yyyy-MM-dd");
  const rng = seedrandom(seed);
  const num = Math.floor(rng() * (isTsumugi ? 28 : 14));

  return (
    <div className={styles.wrapper}>
      <div className={styles.srOnly}>
        <h1>kk-web</h1>
      </div>
      <div className={styles.container}>
        <div
          className={clsx(
            styles.bubble,
            isTsumugi ? styles.left : styles.right,
          )}
        >
          <Image
            alt=""
            fill={true}
            quality={100}
            src="/bubble.png"
            style={isTsumugi ? undefined : { scale: "-1 1" }}
          />
          <div className={clsx(notoSans.className, styles.text)}>kk-web</div>
        </div>
        {isTsumugi ? (
          <div className={styles.tsumugi}>
            <Image
              alt="春日部つむぎ"
              fill={true}
              priority={true}
              quality={100}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              src={`/tsumugi_${num.toString().padStart(2, "0")}.png`}
            />
          </div>
        ) : (
          <div className={styles.metan}>
            <Image
              alt="四国めたん"
              blurDataURL="data:image/jpeg;base64,/9j//gAQTGF2YzYxLjE5LjEwMQD/2wBDAAgEBAQEBAUFBQUFBQYGBgYGBgYGBgYGBgYHBwcICAgHBwcGBgcHCAgICAkJCQgICAgJCQoKCgwMCwsODg4RERT/xACIAAACAgMBAAAAAAAAAAAAAAAIBgMBAgAEBwEAAwEBAQAAAAAAAAAAAAAAAAMEAgEFEAACAgIBAgQEBwEBAAAAAAACAQMEBREGEgAjIRMHMTYiCLF1c3LBs0E1FBEAAQMDAgUEAAcBAAAAAAAAARECAwQhABIxM1EiE3FBYbIFsaKRFeFyMmL/wAARCAASABQDARIAAhIAAxIA/9oADAMBAAIRAxEAPwDL2M4/RxXDcaWQw2DmvanyEFv/AM8Mt1hM/DE5SBk3GJtGxeo0KHe0++bifuDh5qOCirhFUgsDLjw3ZiBjHTRRQdIHIMzjYjF1S9HpCchoj6l3TFSjtNc5Orb/AJ5L6L7YxssbooRcISA0IhAUFVuVsbbc8ti+sqQKUDtrUPHUW6jExFJK9O35rZ6FNXwuELWpGyQGFS9oIDQQxASoG3UiKTfHEeB4bGR5C5PxDFQVcuXp5CYIoSU8cq+MkXWbBkZkWxBaJrfn3NmOYzSRV8RNgrdMblUJAtDfqy14JJYozGMSgHrmlmERCNihHq6us239SI30M8hijXWVAVhA6d9J1Jfcc8RS0jmVLHvlYGNIdtfpOxtb3TIv22j7skcFU6V+lwZG9rUe4Lu8AIuzSNvVcKUwNqmlzxH2zK+RxJCBhsACf9Fbbjlgy85q42jy/NVcZSmxtOC5JFBUnkcskIhpaZkZsk3sgbJvpa2+2z3a4ZyrOcvPJ08DkQjtVKpNzhBAchRpwuRC5m2j9PfU3ve09a13qRmh7moQhS/8ZureySYuYukpkMjHRyOY5pYWkgtNyPbHfazR1VX3YjqBYwOKIrgEP62OKvDG5MwAG2QKCbQl5itsd6T8lv8A3uuE/wDbX6Mn4j3mLiN84RcRvnFQXkA84QcQYVWZ8HivF44/DAfWAQD6RQRiIxiktJCApIF8BS0u9zvyxxj99r+O+1ADZ5Et1Dbwc7U8eT+4/A5llw5b2PyGEezvB+QzwL7g7dqvzepFDPNFGGHq9McchgA7sWifSItJbJtvS822+4/uJ+e635PU/vs9rOBwwz//2Q=="
              fill={true}
              placeholder="blur"
              priority={true}
              quality={100}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              src={`/metan_${num.toString().padStart(2, "0")}.png`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
