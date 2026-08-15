export type PortfolioItem = {
  /** 畳んだもの。一覧の下にまとめ、公開ページではなくリポジトリへ繋ぐ。 */
  archived?: boolean;
  href: string;
  /** 表示名。翻訳キーがある場合は messages から引く。 */
  name?: string;
  nameKey?: string;
  repo?: string;
  textKey?: string;
};

export type PortfolioCategory = {
  items: PortfolioItem[];
  /** messages の Portfolio 配下の名前空間。 */
  namespace?: string;
};

export const WEB_SERVICES: PortfolioCategory = {
  items: [
    {
      archived: true,
      href: "https://high-low.kkweb.io/",
      nameKey: "highOrLowName",
      repo: "https://github.com/piro0919/high-low",
      textKey: "highOrLowText",
    },
    {
      href: "https://comictime.kkweb.io/",
      nameKey: "comictimeName",
      repo: "https://github.com/piro0919/comic-time",
      textKey: "comictimeText",
    },
    {
      href: "https://ogpimggen.kkweb.io/",
      nameKey: "ogpimggenName",
      repo: "https://github.com/piro0919/ogp-image-generator",
      textKey: "ogpimggenText",
    },
    {
      archived: true,
      href: "https://peraichi.kkweb.io/",
      nameKey: "peraichiName",
      repo: "https://github.com/piro0919/peraichi",
      textKey: "peraichiText",
    },
    {
      archived: true,
      href: "https://youtube-growth.kkweb.io/",
      nameKey: "youtubeName",
      repo: "https://github.com/piro0919/youtube-growth",
      textKey: "youtubeText",
    },
    {
      archived: true,
      href: "https://kantanka.kkweb.io",
      nameKey: "kantankaName",
      repo: "https://github.com/piro0919/kantanka",
      textKey: "kantankaText",
    },
    {
      href: "https://planning-poker.kkweb.io",
      nameKey: "pokerName",
      repo: "https://github.com/piro0919/planning-poker",
      textKey: "pokerText",
    },
    {
      archived: true,
      href: "https://recban.kkweb.io",
      nameKey: "recbanName",
      repo: "https://github.com/piro0919/recban",
      textKey: "recbanText",
    },
    {
      href: "https://omocoro-archive.kkweb.io",
      nameKey: "omocoroName",
      repo: "https://github.com/piro0919/omocoro-archive",
      textKey: "omocoroText",
    },
    {
      href: "https://omocoro-daily.kkweb.io",
      nameKey: "dailyName",
      repo: "https://github.com/piro0919/omocoro-dailyportalz",
      textKey: "dailyText",
    },
    {
      href: "https://siritori-timer.kkweb.io",
      nameKey: "siritoriName",
      repo: "https://github.com/piro0919/siritori-timer",
      textKey: "siritoriText",
    },
    {
      href: "https://recigle.kkweb.io",
      nameKey: "recigleName",
      repo: "https://github.com/piro0919/recigle",
      textKey: "recigleText",
    },
  ],
  namespace: "WebService",
};

export const WEB_SITES: PortfolioCategory = {
  items: [
    {
      href: "https://www.natsuzolab.com",
      nameKey: "natsuzolabName",
      repo: "https://github.com/piro0919/natsuzolab",
      textKey: "natsuzolabText",
    },
    {
      href: "https://kanaohonten.vercel.app",
      nameKey: "kanaoName",
      repo: "https://github.com/piro0919/kanao-honten",
      textKey: "kanaoText",
    },
    {
      href: "https://www.nbhyakuhati.com",
      nameKey: "seven08Name",
      repo: "https://github.com/piro0919/708",
      textKey: "seven08Text",
    },
    {
      href: "https://konta-niki.com/",
      nameKey: "kontanikiName",
      repo: "https://github.com/piro0919/1st-kontact",
      textKey: "kontanikiText",
    },
  ],
  namespace: "WebSite",
};

export const APPLICATIONS: PortfolioCategory = {
  items: [
    {
      href: "https://galopen.kkweb.io/",
      name: "Galopen",
      repo: "https://github.com/piro0919/galopen",
      textKey: "galopenText",
    },
    {
      href: "https://macopy.kkweb.io/",
      name: "Macopy",
      repo: "https://github.com/piro0919/macopy",
      textKey: "macopyText",
    },
    {
      href: "https://mcp.kkweb.io/",
      name: "Mac Classic Player",
      repo: "https://github.com/piro0919/mac-classic-player",
      textKey: "playerText",
    },
  ],
  namespace: "Applications",
};

export const NPM_PACKAGES: PortfolioCategory = {
  items: [
    {
      href: "https://www.npmjs.com/package/@piro0919/next-push",
      name: "@piro0919/next-push",
      repo: "https://github.com/piro0919/next-push",
      textKey: "nextPushText",
    },
    {
      href: "https://www.npmjs.com/package/use-ear",
      name: "use-ear",
      repo: "https://github.com/piro0919/use-ear",
      textKey: "useEarText",
    },
    {
      href: "https://www.npmjs.com/package/use-right-click",
      name: "use-right-click",
      repo: "https://github.com/piro0919/use-right-click",
      textKey: "useRightClickText",
    },
    {
      href: "https://www.npmjs.com/package/next-subrouter",
      name: "next-subrouter",
      repo: "https://github.com/piro0919/next-subrouter",
      textKey: "nextSubrouterText",
    },
    {
      href: "https://www.npmjs.com/package/react-page-border",
      name: "react-page-border",
      repo: "https://github.com/piro0919/react-page-border",
      textKey: "reactPageBorderText",
    },
    {
      href: "https://www.npmjs.com/package/use-show-window-size",
      name: "use-show-window-size",
      repo: "https://github.com/piro0919/use-show-window-size",
      textKey: "useShowWindowSizeText",
    },
    {
      href: "https://www.npmjs.com/package/@piro0919/next-unused",
      name: "@piro0919/next-unused",
      repo: "https://github.com/piro0919/next-unused",
      textKey: "nextUnusedText",
    },
    {
      href: "https://www.npmjs.com/package/react-three-toggle",
      name: "react-three-toggle",
      repo: "https://github.com/piro0919/react-three-toggle",
      textKey: "reactThreeToggleText",
    },
    {
      href: "https://www.npmjs.com/package/react-comic-viewer",
      name: "react-comic-viewer",
      repo: "https://github.com/piro0919/react-comic-viewer",
      textKey: "reactComicViewerText",
    },
    {
      href: "https://www.npmjs.com/package/use-pwa",
      name: "use-pwa",
      repo: "https://github.com/piro0919/use-pwa",
      textKey: "usePwaText",
    },
  ],
  namespace: "Npm",
};

export const EXTENSIONS: PortfolioCategory = {
  items: [],
};

export const MOVIES: PortfolioCategory = {
  items: [
    {
      href: "https://www.youtube.com/channel/UC--pDyTi3aPS5wf6PN6kXDA",
      name: "YouTube",
    },
    {
      href: "http://www.nicovideo.jp/mylist/30473930",
      name: "niconico",
    },
  ],
};
