import { Box, Flex, Heading, Link, Text, VStack } from "@kuma-ui/core";
import getBreakpoints from "@/libs/getBreakpoints";

export default function WebSite(): JSX.Element {
  const items = [
    {
      href: "https://lovvebox.com",
      name: "ラブボックス公式サイト",
      text: "VTuber プロダクション「ラブボックス」のサイトを作成しました。",
    },
    {
      href: "https://www.higapro.jp",
      name: "Higa Production",
      text: "VTuber プロダクション「Higa Production」のサイトを作成しました。",
    },
    {
      href: "https://www.natsuzolab.com",
      name: "Natsuzolab",
      text: "作曲家「成田旬」さんのサイトを作成しました。",
    },
    {
      href: "https://kanaohonten.vercel.app",
      name: "金尾本店",
      text: "広島県福山市で営業している魚屋「金尾本店」のサイトを作成しました。",
    },
    {
      href: "https://www.nbhyakuhati.com",
      name: "7:08",
      text: "イラストレーター「7:08」さんのサイトを作成しました。",
    },
    {
      href: "https://kontaniki.com",
      name: "1stKontact",
      text: "イラストレーター「こんた」さんのサイトを作成しました。",
    },
  ].map(({ href, name, text }, index) => (
    <Link href={href} key={name} target="_blank">
      <VStack
        borderTop={index > 0 ? "1px solid var(--color-gray)" : undefined}
        gap={12}
        px={getBreakpoints({
          lg: 0,
          sm: 12,
        })}
        py={24}
      >
        <Heading as="h3" fontSize="2.4rem">
          {name}
        </Heading>
        <Text color="colors.gray">{text}</Text>
      </VStack>
    </Link>
  ));

  return (
    <>
      <Box height="0px" overflow="hidden" style={{ opacity: 0 }} width="0px">
        <Heading as="h2">WEB SITE</Heading>
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
