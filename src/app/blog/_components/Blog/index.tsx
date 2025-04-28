"use client";
import { Box, Flex, Heading, Text, VStack } from "@kuma-ui/core";
import axios, { AxiosResponse } from "axios";
import { useCallback, useMemo } from "react";
import InfiniteScroll, { Props } from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import { BareFetcher } from "swr";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import { GetArticlesResponseBody } from "@/app/articles/route";
import NavLink from "@/components/NavLink";
import getBreakpoints from "@/libs/getBreakpoints";
import pageSize from "@/libs/pageSize";

const getKey: SWRInfiniteKeyLoader<GetArticlesResponseBody> = (
  pageIndex,
  previousPageData,
) =>
  previousPageData && !previousPageData.length
    ? null
    : `/articles?page=${pageIndex}`;
const fetcher: BareFetcher<GetArticlesResponseBody> = (url: string) =>
  axios
    .get<GetArticlesResponseBody, AxiosResponse<GetArticlesResponseBody>>(url)
    .then((res) => res.data);

export default function Blog(): JSX.Element {
  const { data, setSize } = useSWRInfinite<GetArticlesResponseBody>(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );
  const articles = useMemo(() => data?.flat() || [], [data]);
  const items = useMemo(
    () =>
      articles.map(({ date, slug, text, title }, index) => (
        <NavLink href={slug} key={slug}>
          <VStack
            borderTop={index > 0 ? "1px solid var(--color-gray)" : undefined}
            gap={8}
            px={getBreakpoints({
              lg: 0,
              sm: 12,
            })}
            py={24}
          >
            <Heading as="h3" fontSize="2.4rem">
              {title}
            </Heading>
            <Box display="table" width="100%">
              <Text
                color="colors.gray"
                display="table-cell"
                maxWidth="0px"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {text}
              </Text>
            </Box>
            <Box fontSize="1.2rem">{date}</Box>
          </VStack>
        </NavLink>
      )),
    [articles],
  );
  const isEmpty = useMemo(() => data?.[0]?.length === 0, [data]);
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < pageSize);
  const next = useCallback<Props["next"]>(() => {
    // eslint-disable-next-line no-void
    void setSize((prevSize) => prevSize + 1);
  }, [setSize]);

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
          <InfiniteScroll
            dataLength={items.length}
            hasMore={!isReachingEnd}
            loader={
              <Flex justify="center" pb={24}>
                <Oval
                  color="#bdc1c6"
                  height={48}
                  secondaryColor="#808080"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                  visible={true}
                  width={48}
                />
              </Flex>
            }
            next={next}
          >
            {items}
          </InfiniteScroll>
        </Box>
      </Flex>
    </>
  );
}
