const navigations = [
  {
    href: "/",
    title: "HOME",
  },
  {
    href: "/portfolio",
    navigations: [
      {
        href: "/web-service",
        title: "WEB SERVICE",
      },
      {
        href: "/web-site",
        title: "WEB SITE",
      },
      {
        href: "/application",
        title: "APPLICATION",
      },
      {
        href: "/npm-package",
        title: "NPM PACKAGE",
      },
      {
        href: "/movie",
        title: "MOVIE",
      },
    ],
    title: "PORTFOLIO",
  },
  {
    href: "/blog",
    title: "BLOG",
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
