import { Box, Flex, Heading, Link } from "@kuma-ui/core";
import getBreakpoints from "@/libs/getBreakpoints";

export default function Movie(): JSX.Element {
  const items = [
    {
      href: "https://www.youtube.com/channel/UC--pDyTi3aPS5wf6PN6kXDA",
      name: "YouTube",
    },
    {
      href: "https://vimeo.com/piro0919",
      name: "Vimeo",
    },
    {
      href: "http://www.nicovideo.jp/mylist/30473930",
      name: "niconico",
    },
  ].map(({ href, name }, index) => (
    <Link href={href} key={name} target="_blank">
      <Box
        borderTop={index > 0 ? "1px solid var(--color-gray)" : undefined}
        px={getBreakpoints({
          lg: 0,
          sm: 12,
        })}
        py={24}
      >
        <Heading as="h3" fontSize="2.4rem">
          {name}
        </Heading>
      </Box>
    </Link>
  ));

  return (
    <>
      <Box height="0px" overflow="hidden" style={{ opacity: 0 }} width="0px">
        <Heading as="h2">MOVIE</Heading>
      </Box>
      <Flex height="100%" justify="center">
        <Box
          px={getBreakpoints({
            lg: 24,
            sm: 0,
          })}
          width="min(960px, 100%)"
        >
          {items}
        </Box>
      </Flex>
    </>
  );
}
