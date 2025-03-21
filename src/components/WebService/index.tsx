import { Box, Flex, Heading, Link, Text, VStack } from "@kuma-ui/core";
import getBreakpoints from "@/libs/getBreakpoints";

export default function WebService(): JSX.Element {
  const items = [
    {
      href: "https://youtube-growth.kk-web.link/",
      name: "YouTube Growth",
      text: "YouTubeチャンネルを解析しアドバイスしてくれるサービスです。",
    },
    {
      href: "https://kantanka.kk-web.link",
      name: "かんたんか",
      text: "短歌が投稿できるサービスです。",
    },
    {
      href: "https://planning-poker.kk-web.link",
      name: "Planning Poker",
      text: "プランニングポーカーができるサービスです。",
    },
    {
      href: "https://recban.kk-web.link",
      name: "りくばん！",
      text: "バンドメンバーを募集したり見つけたりすることができるサービスです。",
    },
    {
      href: "https://omocoro-archive.kk-web.link",
      name: "オモコロアーカイブ",
      text: "メディアサイト「オモコロ」の記事をまとめたサービスです。",
    },
    {
      href: "https://omocoro-daily.kk-web.link",
      name: "オモコロ&デイリーポータルＺ非公式リーダー",
      text: "メディアサイト「オモコロ」と「デイリーポータルＺ」の記事をまとめたサービスです。",
    },
    {
      href: "https://on-memo.kk-web.link",
      name: "おんめも",
      text: "様々なデバイスでメモを共有できるサービスです。",
    },
    {
      href: "https://siritori-timer.kk-web.link",
      name: "限界しりとりタイマー",
      text: "ボードゲーム「限界しりとりパーティー！」のタイマーとして使えるサービスです。",
    },
    {
      href: "https://serifuya.kk-web.link",
      name: "せりふや",
      text: "女の子のボイスをフリー素材として配布しているサービスです。",
    },
    {
      href: "https://recigle.kk-web.link",
      name: "レシグル",
      text: "レシピを検索しやすくしてくれるサービスです。",
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
        <Heading as="h2">WEB SERVICE</Heading>
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
