const navigations = [
  {
    href: "/",
    title: "HOME",
  },
  {
    href: "/portfolio",
    navigations: [
      {
        href: "/portfolio/web-service",
        title: "WEB SERVICE",
      },
      {
        href: "/portfolio/web-site",
        title: "WEB SITE",
      },
      {
        href: "/portfolio/application",
        title: "APPLICATION",
      },
      {
        href: "/portfolio/npm-package",
        title: "NPM PACKAGE",
      },
      {
        href: "/portfolio/movie",
        title: "MOVIE",
      },
    ],
    title: "PORTFOLIO",
  },
  {
    href: "/writing",
    navigations: [
      {
        href: "/blog",
        title: "BLOG",
      },
      {
        href: "/note",
        title: "NOTE",
      },
    ],
    title: "WRITING",
  },
  {
    href: "/contact",
    title: "CONTACT",
  },
  {
    href: "/about",
    title: "ABOUT",
  },
] as const;

export default navigations;
