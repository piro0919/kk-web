"use client";
import env from "@/env";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { type ReactElement, type ReactNode, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, Form, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { type Id, toast } from "react-toastify";
import { z } from "zod";
import styles from "./style.module.css";

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(1),
  name: z.string().min(1),
  subject: z.string().min(1),
});

type FieldTypes = z.infer<typeof schema>;

export default function Contact(): React.JSX.Element {
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
  const setCookie = useSetCookie();
  const t = useTranslations("Contact");

  return (
    <>
      <div className={styles.srOnly}>
        <h1>CONTACT</h1>
      </div>
      <div className={styles.wrapper}>
        <Form
          onError={(): void => {
            if (!toastId.current) return;
            toast.update(toastId.current, {
              autoClose: 5000,
              isLoading: false,
              render: t("submitError"),
              type: "error",
            });
          }}
          onSubmit={async (): Promise<void> => {
            if (!ref.current) return;

            const token = await ref.current.executeAsync();

            if (typeof token !== "string") return;
            setCookie("token", token);
            toastId.current = toast(t("submitting"), {
              autoClose: false,
              isLoading: true,
            }) as Id;
          }}
          onSuccess={(): void => {
            if (!toastId.current) return;
            toast.update(toastId.current, {
              autoClose: 5000,
              isLoading: false,
              render: t("submitSuccess"),
              type: "success",
            });
          }}
          action="/email"
          className={styles.form}
          control={control}
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
                    render={({ field }): ReactElement => (
                      <input
                        {...field}
                        autoFocus={name === "name"}
                        className={styles.input}
                        id={name}
                        type={type}
                      />
                    )}
                    control={control}
                    name={name as keyof FieldTypes}
                  />
                  <ErrorMessage
                    render={({ message }): ReactNode => (
                      <div className={styles.error}>{message}</div>
                    )}
                    errors={errors}
                    name={name as keyof FieldTypes}
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
                  render={({ message }): ReactNode => (
                    <div className={styles.error}>{message}</div>
                  )}
                  errors={errors}
                  name="message"
                />
              </div>
            </div>
            <div className={styles.submitWrapper}>
              <button
                className={styles.submitButton}
                disabled={isSubmitting}
                type="submit"
              >
                {t("submitButton")}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}
