"use client";
import { Box, HStack } from "@kuma-ui/core";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import NavLink from "@/components/NavLink";
import getBreakpoints from "@/libs/getBreakpoints";
import navigations from "@/libs/navigations";

const montserrat = Montserrat({
  fallback: ["sans-serif"],
  preload: true,
  subsets: ["latin"],
});

export default function Header(): JSX.Element {
  const pathname = usePathname();
  const navLinks = useMemo(
    () =>
      navigations.map(({ href, title, ...navigation }) =>
        "navigations" in navigation ? (
          <Menu
            align="center"
            arrow={true}
            direction="bottom"
            key={title}
            menuButton={<MenuButton>{title}</MenuButton>}
            theming="dark"
            transition={true}
          >
            {navigation.navigations.map(({ href: navigationHref, title }) => (
              <MenuItem key={navigationHref}>
                <NavLink href={`${href}${navigationHref}`}>{title}</NavLink>
              </MenuItem>
            ))}
          </Menu>
        ) : (
          <NavLink
            href={href}
            key={title}
            style={
              pathname === href
                ? { borderBottom: "1px solid var(--color-brand-red)" }
                : undefined
            }
          >
            {title}
          </NavLink>
        ),
      ),
    [pathname],
  );

  return (
    <HStack as="header" className={montserrat.className} justify="center">
      <Box as="nav" py={getBreakpoints({ sm: 24, xl: 36 })}>
        <HStack gap={getBreakpoints({ sm: 64, xl: 84 })}>{navLinks}</HStack>
      </Box>
    </HStack>
  );
}
