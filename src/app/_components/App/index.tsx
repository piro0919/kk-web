import { Box, Flex } from "@kuma-ui/core";
import dayjs from "dayjs";
import { M_PLUS_1_Code as MPLUS1Code } from "next/font/google";
import Image from "next/image";
import getBreakpoints from "@/libs/getBreakpoints";

const mPLUS1Code = MPLUS1Code({
  fallback: ["sans-serif"],
  preload: true,
  subsets: ["latin"],
  weight: "700",
});

export default function App(): JSX.Element {
  const date = dayjs().date();
  const isTsumugi = date % 2 > 0;

  return (
    <Flex alignItems="center" height="100%" justify="center">
      <Box
        height={getBreakpoints({ lg: "362px", sm: "244px" })}
        position="relative"
        width={getBreakpoints({ lg: "536px", sm: "350px" })}
      >
        <Flex
          alignItems="center"
          height={getBreakpoints({ lg: 272 / 2, sm: 272 / 3 })}
          inset={isTsumugi ? "0 auto auto 0" : "0 0 auto auto"}
          justify="center"
          position="absolute"
          width={getBreakpoints({ lg: 512 / 2, sm: 512 / 3 })}
        >
          <Image
            alt="kk-web"
            fill={true}
            quality={100}
            src="/bubble.webp"
            style={isTsumugi ? undefined : { scale: "-1 1" }}
          />
          <Box
            className={mPLUS1Code.className}
            color="black"
            fontSize={getBreakpoints({ lg: "2.4rem", sm: "1.8rem" })}
            fontStyle="italic"
            ml="-6px"
            mt={getBreakpoints({ lg: "-19.5px", sm: "-13.65px" })}
            position="relative"
          >
            ケーケーウェブ
          </Box>
        </Flex>
        {isTsumugi ? (
          <Box
            height={getBreakpoints({ lg: 953 / 3, sm: 953 / 4.5 })}
            inset="auto 0 0 auto"
            position="absolute"
            width={getBreakpoints({ lg: 1080 / 3, sm: 1080 / 4.5 })}
          >
            <Image alt="kk-web" fill={true} quality={100} src="/tsumugi.webp" />
          </Box>
        ) : (
          <Box
            height={getBreakpoints({ lg: 1772 / 5.5, sm: 1772 / 8.3 })}
            inset="auto auto 0 0"
            position="absolute"
            width={getBreakpoints({ lg: 1990 / 5.5, sm: 1990 / 8.3 })}
          >
            <Image alt="kk-web" fill={true} quality={100} src="/metan.webp" />
          </Box>
        )}
      </Box>
    </Flex>
  );
}
