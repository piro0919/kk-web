"use client";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import { ReactElement, ReactNode, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, Form, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { Id, toast } from "react-toastify";
import { z } from "zod";
import styles from "./style.module.css";
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
      <div className={styles.srOnly}>
        <h2>CONTACT</h2>
      </div>
      <div className={styles.wrapper}>
        <Form
          action="/email"
          className={styles.form}
          control={control}
          onError={(): void => {
            if (!toastId.current) return;
            toast.update(toastId.current, {
              autoClose: 5000,
              isLoading: false,
              render: "送信に失敗しました",
              type: "error",
            });
          }}
          onSubmit={async (): Promise<void> => {
            if (!ref.current) return;

            const token = await ref.current.executeAsync();

            if (typeof token !== "string") return;
            setCookie("token", token);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            toastId.current = toast("送信しています…", {
              autoClose: false,
              isLoading: true,
            });
          }}
          onSuccess={(): void => {
            if (!toastId.current) return;
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
          <div className={styles.vStackOuter}>
            <div className={styles.vStackInner}>
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Subject", name: "subject", type: "text" },
              ].map(({ label, name, type }) => (
                <div className={styles.vStack} key={name}>
                  <label className={styles.label} htmlFor={name}>
                    {label}
                    <abbr className={styles.required}>*</abbr>
                  </label>
                  <Controller
                    control={control}
                    name={name as keyof FieldTypes}
                    render={({ field }): ReactElement => (
                      <input
                        {...field}
                        autoFocus={name === "name"}
                        className={styles.input}
                        id={name}
                        type={type}
                      />
                    )}
                  />
                  <ErrorMessage
                    errors={errors}
                    name={name as keyof FieldTypes}
                    render={({ message }): ReactNode => (
                      <div className={styles.error}>{message}</div>
                    )}
                  />
                </div>
              ))}
              <div className={styles.vStack}>
                <label className={styles.label} htmlFor="message">
                  Message
                  <abbr className={styles.required}>*</abbr>
                </label>
                <TextareaAutosize
                  {...register("message")}
                  className={styles.textareaAutosize}
                  id="message"
                  minRows={6}
                />
                <ErrorMessage
                  errors={errors}
                  name="message"
                  render={({ message }): ReactNode => (
                    <div className={styles.error}>{message}</div>
                  )}
                />
              </div>
            </div>
            <div className={styles.submitWrapper}>
              <button
                className={styles.submitButton}
                disabled={isSubmitting}
                type="submit"
              >
                送信する
              </button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}
