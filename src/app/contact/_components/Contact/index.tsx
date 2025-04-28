"use client";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Flex, Heading, Input, Text, VStack } from "@kuma-ui/core";
import { setCookie } from "cookies-next";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, Form, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { Id, toast } from "react-toastify";
import { z } from "zod";
import styles from "./style.module.scss";
import env from "@/env";

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(1),
  name: z.string().min(1),
  subject: z.string().min(1),
});

type FieldTypes = z.infer<typeof schema>;

export default function Contact(): JSX.Element {
  const {
    control,
    formState: { errors, isSubmitting },
    register,
  } = useForm<FieldTypes>({
    defaultValues: {
      email: "",
      message: "",
      name: "",
      subject: "",
    },
    progressive: true,
    resolver: zodResolver(schema),
  });
  const ref = useRef<ReCAPTCHA>(null);
  const toastId = useRef<Id>(null);

  return (
    <>
      <Box height="0px" overflow="hidden" style={{ opacity: 0 }} width="0px">
        <Heading as="h2">CONTACT</Heading>
      </Box>
      <Flex
        alignItems="center"
        height="100%"
        justify="center"
        pb={32}
        pt={12}
        px={12}
      >
        <Form
          action="/email"
          className={styles.form}
          control={control}
          onError={(): void => {
            if (!toastId.current) {
              return;
            }

            toast.update(toastId.current, {
              autoClose: 5000,
              isLoading: false,
              render: "送信に失敗しました",
              type: "error",
            });
          }}
          onSubmit={async (): Promise<void> => {
            if (!ref.current) {
              return;
            }

            const token = await ref.current.executeAsync();

            if (typeof token !== "string") {
              return;
            }

            setCookie("token", token);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            toastId.current = toast("送信しています…", {
              autoClose: false,
              isLoading: true,
            });
          }}
          onSuccess={(): void => {
            if (!toastId.current) {
              return;
            }

            toast.update(toastId.current, {
              autoClose: 5000,
              isLoading: false,
              render: "メッセージを送信しました",
              type: "success",
            });
          }}
        >
          <ReCAPTCHA
            ref={ref}
            sitekey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            size="invisible"
            theme="dark"
          />
          <VStack gap={32}>
            <VStack gap={24}>
              <VStack gap={4}>
                <Box as="label" fontSize="1.0rem" htmlFor="name">
                  Name
                  <Box as="abbr" pl={4}>
                    *
                  </Box>
                </Box>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }): JSX.Element => (
                    <Input
                      {...field}
                      autoFocus={true}
                      bg="colors.lightWhite"
                      color="colors.black"
                      fontFamily="arial"
                      id="name"
                      px={6}
                      py={4}
                    />
                  )}
                />
                <ErrorMessage
                  errors={errors}
                  name="name"
                  render={({ message }): JSX.Element => (
                    <Text
                      color="colors.brandRed"
                      fontFamily="arial"
                      fontSize="1.2rem"
                    >
                      {message}
                    </Text>
                  )}
                />
              </VStack>
              <VStack gap={4}>
                <Box as="label" fontSize="1.0rem" htmlFor="email">
                  Email
                  <Box as="abbr" pl={4}>
                    *
                  </Box>
                </Box>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }): JSX.Element => (
                    <Input
                      {...field}
                      bg="colors.lightWhite"
                      color="colors.black"
                      fontFamily="arial"
                      id="email"
                      px={6}
                      py={4}
                      type="email"
                    />
                  )}
                />
                <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ message }): JSX.Element => (
                    <Text
                      color="colors.brandRed"
                      fontFamily="arial"
                      fontSize="1.2rem"
                    >
                      {message}
                    </Text>
                  )}
                />
              </VStack>
              <VStack gap={4}>
                <Box as="label" fontSize="1.0rem" htmlFor="subject">
                  Subject
                  <Box as="abbr" pl={4}>
                    *
                  </Box>
                </Box>
                <Controller
                  control={control}
                  name="subject"
                  render={({ field }): JSX.Element => (
                    <Input
                      {...field}
                      bg="colors.lightWhite"
                      color="colors.black"
                      fontFamily="arial"
                      id="subject"
                      px={6}
                      py={4}
                    />
                  )}
                />
                <ErrorMessage
                  errors={errors}
                  name="subject"
                  render={({ message }): JSX.Element => (
                    <Text
                      color="colors.brandRed"
                      fontFamily="arial"
                      fontSize="1.2rem"
                    >
                      {message}
                    </Text>
                  )}
                />
              </VStack>
              <VStack gap={4}>
                <Box as="label" fontSize="1.0rem" htmlFor="message">
                  Message
                  <Box as="abbr" pl={4}>
                    *
                  </Box>
                </Box>
                <TextareaAutosize
                  {...register("message")}
                  className={styles.textareaAutosize}
                  id="message"
                  minRows={6}
                />
                <ErrorMessage
                  errors={errors}
                  name="message"
                  render={({ message }): JSX.Element => (
                    <Text
                      color="colors.brandRed"
                      fontFamily="arial"
                      fontSize="1.2rem"
                    >
                      {message}
                    </Text>
                  )}
                />
              </VStack>
            </VStack>
            <Flex justify="center">
              <Button
                bg="colors.brandBlue"
                color="colors.lightWhite"
                fontFamily="arial"
                opacity={isSubmitting ? 0.5 : 1}
                px={24}
                py={8}
                transition="250ms"
              >
                送信する
              </Button>
            </Flex>
          </VStack>
        </Form>
      </Flex>
    </>
  );
}
