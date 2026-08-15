"use client";
import env from "@/env";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import {
  type ReactElement,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, Form, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import styles from "./style.module.css";

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(1),
  name: z.string().min(1),
  subject: z.string().min(1),
});

type FieldTypes = z.infer<typeof schema>;

const FIELDS = [
  { label: "Name", name: "name", type: "text" },
  { label: "Email", name: "email", type: "email" },
  { label: "Subject", name: "subject", type: "text" },
] as const;

type Status = "" | "error" | "sending" | "success";

function getStatusKey(status: Status): null | string {
  switch (status) {
    case "error":
      return "submitError";
    case "sending":
      return "submitting";
    case "success":
      return "submitSuccess";
    default:
      return null;
  }
}

export default function ContactForm(): React.JSX.Element {
  const {
    control,
    formState: { errors, isSubmitting },
    register,
  } = useForm<FieldTypes>({
    defaultValues: { email: "", message: "", name: "", subject: "" },
    progressive: true,
    resolver: zodResolver(schema),
  });
  const ref = useRef<ReCAPTCHA>(null);
  const setCookie = useSetCookie();
  const [status, setStatus] = useState<Status>("");
  // バッジは fixed で置かれるが、親に filter が掛かっているとその中に閉じ込められる。
  // body 直下へ出して画面の右下に固定させる。
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const t = useTranslations("Contact");
  const statusKey = getStatusKey(status);

  return (
    <Form
      onError={(): void => {
        setStatus("error");
      }}
      onSubmit={async (): Promise<void> => {
        if (!ref.current) return;

        const token = await ref.current.executeAsync();

        if (typeof token !== "string") return;

        setCookie("token", token);
        setStatus("sending");
      }}
      onSuccess={(): void => {
        setStatus("success");
      }}
      action="/email"
      className={styles.form}
      control={control}
    >
      {isMounted
        ? createPortal(
            <ReCAPTCHA
              ref={ref}
              sitekey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              size="invisible"
            />,
            document.body,
          )
        : null}
      {FIELDS.map(({ label, name, type }) => (
        <div className={styles.field} key={name}>
          <label className={styles.label} htmlFor={name}>
            {label}
            <abbr className={styles.required}>*</abbr>
          </label>
          <Controller
            render={({ field }): ReactElement => (
              <input
                {...field}
                className={styles.input}
                id={name}
                type={type}
              />
            )}
            control={control}
            name={name}
          />
          <ErrorMessage
            render={({ message }): ReactNode => (
              <p className={styles.error}>{message}</p>
            )}
            errors={errors}
            name={name}
          />
        </div>
      ))}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="message">
          Message
          <abbr className={styles.required}>*</abbr>
        </label>
        <TextareaAutosize
          {...register("message")}
          className={styles.input}
          id="message"
          minRows={6}
        />
        <ErrorMessage
          render={({ message }): ReactNode => (
            <p className={styles.error}>{message}</p>
          )}
          errors={errors}
          name="message"
        />
      </div>
      <p className={styles.recaptcha}>
        {t.rich("recaptcha", {
          privacy: (chunks) => (
            <a
              className={styles.recaptchaLink}
              href="https://policies.google.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              {chunks}
            </a>
          ),
          terms: (chunks) => (
            <a
              className={styles.recaptchaLink}
              href="https://policies.google.com/terms"
              rel="noopener noreferrer"
              target="_blank"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
      <div className={styles.submitBlock}>
        {statusKey === null ? null : (
          <p className={styles.status}>{t(statusKey)}</p>
        )}
        <button
          className={styles.submitButton}
          disabled={isSubmitting}
          type="submit"
        >
          {t("submitButton")}
        </button>
      </div>
    </Form>
  );
}
