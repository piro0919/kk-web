"use client";
import { Box, Grid, Heading } from "@kuma-ui/core";
import i18next from "i18next";
import { ReactNode } from "react";
import useMeasure from "react-use-measure";
import { useScrollYPosition } from "react-use-scroll-position";
import { useWindowSize } from "usehooks-ts";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/ja/zod.json";
import Footer from "../Footer";
import Header from "../Header";
import MobileMenu from "../MobileMenu";
import Navigation from "../Navigation";
import getBreakpoints from "@/libs/getBreakpoints";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18next.init({
  lng: "ja",
  resources: {
    ja: { zod: translation },
  },
});

z.setErrorMap(zodI18nMap);

export type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
  const { height: windowHeight } = useWindowSize();
  const scrollY = useScrollYPosition();
  const [ref, { height }] = useMeasure();

  return (
    <Box>
      <Box height="0px" overflow="hidden" style={{ opacity: 0 }} width="0px">
        <Heading>kk-web</Heading>
      </Box>
      <Grid
        gridTemplateRows={getBreakpoints({
          lg: "auto 1fr auto",
          sm: "1fr",
        })}
        minHeight={windowHeight || "100dvh"}
        pb={getBreakpoints({
          lg: "0",
          sm: "48px",
        })}
      >
        <Box display={getBreakpoints({ lg: "block", sm: "none" })}>
          <Header />
        </Box>
        <Box as="main">{children}</Box>
        <Box display={getBreakpoints({ lg: "block", sm: "none" })}>
          <Footer />
        </Box>
      </Grid>
      <Box
        bottom="0px"
        display={getBreakpoints({ lg: "none", sm: "block" })}
        position="fixed"
        width="100%"
      >
        <MobileMenu />
      </Box>
      <Box
        display={getBreakpoints({ lg: "block", sm: "none" })}
        left={0}
        position="fixed"
        top={scrollY > height ? height : 0}
        transform="translateY(-100%)"
        transition="250ms"
        width="100%"
      >
        <div ref={ref}>
          <Navigation />
        </div>
      </Box>
    </Box>
  );
}
