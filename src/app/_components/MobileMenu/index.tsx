"use client";
import { Box, Grid } from "@kuma-ui/core";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import NavLink from "../../../components/NavLink";
import navigations from "@/libs/navigations";

const montserrat = Montserrat({
  fallback: ["sans-serif"],
  preload: true,
  subsets: ["latin"],
});

export default function MobileMenu(): JSX.Element {
  const pathname = usePathname();
  const navLinks = useMemo(
    () =>
      navigations.map(({ href, title, ...navigation }, index) => {
        return (
          <Grid
            borderLeft={index > 0 ? "1px solid var(--color-gray)" : undefined}
            borderTop="1px solid var(--color-gray)"
            className={montserrat.className}
            fontSize="1.2rem"
            key={title}
          >
            {"navigations" in navigation ? (
              <Menu
                align="center"
                arrow={true}
                direction="top"
                key={title}
                menuButton={<MenuButton>{title}</MenuButton>}
                theming="dark"
                transition={true}
              >
                {navigation.navigations.map(
                  ({ href: navigationHref, title }) => (
                    <MenuItem key={navigationHref}>
                      <NavLink href={`${href}${navigationHref}`}>
                        {title}
                      </NavLink>
                    </MenuItem>
                  ),
                )}
              </Menu>
            ) : (
              <NavLink
                href={href}
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  as="span"
                  style={
                    pathname === href
                      ? { borderBottom: "1px solid var(--color-brand-red)" }
                      : undefined
                  }
                >
                  {title}
                </Box>
              </NavLink>
            )}
          </Grid>
        );
      }),
    [pathname],
  );

  return (
    <Grid
      as="nav"
      bg="rgba(var(--color-black-text), 0.95)"
      gridTemplateColumns="repeat(5, 1fr)"
      height="48px"
      style={{
        backdropFilter: "blur(1px)",
      }}
    >
      {navLinks}
    </Grid>
  );
}
