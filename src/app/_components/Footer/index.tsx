import { Box, Flex, HStack } from "@kuma-ui/core";
import { SocialIcon } from "react-social-icons";
import getBreakpoints from "@/libs/getBreakpoints";
import links from "@/libs/links";

export default function Footer(): JSX.Element {
  const socialIcons = links.map((link) => (
    <SocialIcon
      fgColor="#fff"
      key={link}
      style={{ height: 36, width: 36 }}
      target="_blank"
      url={link}
    />
  ));

  return (
    <Flex as="footer" justify="center">
      <Flex
        alignItems="center"
        justify="space-between"
        px={24}
        py={getBreakpoints({ sm: 12, xl: 24 })}
        width="min(960px, 100%)"
      >
        <Box fontFamily="arial" fontSize="1.2rem">
          &copy; 2018 kk-web
        </Box>
        <HStack gap={12}>{socialIcons}</HStack>
      </Flex>
    </Flex>
  );
}
