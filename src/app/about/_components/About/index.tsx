import { Box, Flex, HStack, Heading, Link, VStack } from "@kuma-ui/core";
import { SocialIcon } from "react-social-icons";
import links from "@/libs/links";

export default function About(): JSX.Element {
  const socialIcons = links.map((link) => (
    <SocialIcon
      fgColor="#fff"
      key={link}
      style={{ height: 36, width: 36 }}
      target="_blank"
      url={link}
    />
  ));
  const items = [
    {
      name: "Name",
      text: "Kouhei Kawamura",
    },
    { name: "Handle", text: "piro" },
    { name: "Address", text: "Tokyo, Japan" },
    { name: "Job", text: "Freelancer (Front End Programmer, Video Creator)" },
    {
      name: "Resume",
      text: (
        <Link
          color="colors.brandRed"
          href="https://www.wantedly.com/id/kawamura_kouhei"
          target="_blank"
        >
          Wantedly
        </Link>
      ),
    },
    { name: "Link", text: <HStack gap={12}>{socialIcons}</HStack> },
  ].map(({ name, text }) => (
    <VStack gap={2} key={name}>
      <Box fontSize="1.0rem">{name}</Box>
      {typeof text === "string" ? <Box>{text}</Box> : text}
    </VStack>
  ));

  return (
    <>
      <Box height="0px" overflow="hidden" style={{ opacity: 0 }} width="0px">
        <Heading as="h2">ABOUT</Heading>
      </Box>
      <Flex alignItems="center" height="100%" justify="center">
        <VStack gap={24}>{items}</VStack>
      </Flex>
    </>
  );
}
