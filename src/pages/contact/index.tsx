import * as yup from "yup";
import React, { FC, useCallback, useMemo, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { PageProps } from "gatsby";
import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import useFetch from "use-http";

import ContactForm, {
  ContactFormProps,
} from "components/organisms/ContactForm";
import Input from "components/atoms/Input";
import Textarea from "components/atoms/Textarea";
import Button from "components/atoms/Button";
import Layout from "components/templates/Layout";
import Seo from "components/templates/Seo";

type FieldValues = {
  email: string;
  message: string;
  name: string;
  subject: string;
};

export type ContactProps = PageProps;

const Contact: FC<ContactProps> = () => {
  const resolver = useMemo<Resolver<FieldValues>>(
    () =>
      yupResolver(
        yup.object().shape({
          email: yup
            .string()
            .email("Invalid Email Address")
            .required("Email Is Required"),
          message: yup.string().required("Message Is Required"),
          name: yup.string().required("Name Is Required"),
        })
      ),
    []
  );
  const { handleSubmit: handleSubmitUseForm, register } = useForm<FieldValues>({
    resolver,
  });
  const {
    error,
    loading,
    post,
    response: { ok },
  } = useFetch(process.env.GATSBY_BASE_URL);
  const callback = useCallback<Parameters<typeof handleSubmitUseForm>[0]>(
    ({ email, message: text, name, subject }) => {
      post("/sendMail", {
        email,
        name,
        subject,
        text,
      });
    },
    [post]
  );
  const items = useMemo<ContactFormProps["items"]>(
    () => [
      {
        description: (
          <Input inputRef={register({ required: true })} name="name" />
        ),
        term: "Name*",
      },
      {
        description: (
          <Input inputRef={register({ required: true })} name="email" />
        ),
        term: "Email*",
      },
      {
        description: <Input inputRef={register} name="subject" />,
        term: "Subject",
      },
      {
        description: (
          <Textarea name="message" textareaRef={register({ required: true })} />
        ),
        term: "Message*",
      },
    ],
    [register]
  );
  const formCallback = useCallback<ContactFormProps["callback"]>(
    (children) => (
      <form onSubmit={handleSubmitUseForm(callback)}>{children}</form>
    ),
    [callback, handleSubmitUseForm]
  );

  useEffect(() => {
    if (!ok) {
      return;
    }

    toast.success("Send Success Email!");
  }, [ok]);

  useEffect(() => {
    if (!error) {
      return;
    }

    toast.error("An Unknown Network Error Has Occurred");
  }, [error]);

  return (
    <>
      <Seo path="/contact" title="Contact" />
      <Layout>
        <ContactForm
          callback={formCallback}
          items={items}
          submitButton={
            <Button disabled={loading} type="submit">
              Submit
            </Button>
          }
        />
        <ToastContainer pauseOnFocusLoss={false} position="bottom-right" />
      </Layout>
    </>
  );
};

export default Contact;
