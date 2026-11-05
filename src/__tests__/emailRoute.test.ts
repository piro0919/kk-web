import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/[locale]/email/route";

const sendMail = vi.hoisted(() => vi.fn());

vi.mock("nodemailer", () => ({
  default: {
    createTransport: (): { sendMail: typeof sendMail } => ({ sendMail }),
  },
}));
vi.mock("@/env", () => ({
  default: {
    NODEMAILER_AUTH_PASS: "pass",
    NODEMAILER_AUTH_USER: "owner@example.com",
    RECAPTCHA_SECRET_KEY: "secret",
  },
}));

const message = "本文はログに残さない";

/** 連投の制限に掛からないよう、呼ぶたびに別の場所から来たことにする。 */
function createRequest(ip: string, name = "Sender"): NextRequest {
  const body = new FormData();

  body.set("email", "sender@example.com");
  body.set("message", message);
  body.set("name", name);
  body.set("subject", "Subject");

  const request = new NextRequest("https://kkweb.io/ja/email", {
    body,
    headers: { "x-forwarded-for": ip },
    method: "POST",
  });

  request.cookies.set("token", "token");

  return request;
}

describe("POST /[locale]/email", () => {
  const consoleError = vi.spyOn(console, "error");

  beforeEach(() => {
    consoleError.mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("logs why the mail failed without the sender's message", async () => {
    const failure = new Error("smtp down");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ success: true })),
    );
    sendMail.mockRejectedValue(failure);

    const response = await POST(createRequest("192.0.2.1"));

    expect(response.status).toBe(500);
    expect(consoleError).toHaveBeenCalledWith(
      "Failed to send contact email",
      failure,
    );
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(message);
  });

  it("logs when reCAPTCHA cannot be reached", async () => {
    const failure = new Error("network down");

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(failure));

    const response = await POST(createRequest("192.0.2.2"));

    expect(response.status).toBe(403);
    expect(consoleError).toHaveBeenCalledWith(
      "reCAPTCHA verification failed",
      failure,
    );
  });

  it("logs when reCAPTCHA answers with an error status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    );

    const response = await POST(createRequest("192.0.2.3"));

    expect(response.status).toBe(403);
    expect(consoleError).toHaveBeenCalledWith("reCAPTCHA responded with 503");
  });

  it("logs when reCAPTCHA rejects the secret key", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          "error-codes": ["invalid-input-secret"],
          success: false,
        }),
      ),
    );

    const response = await POST(createRequest("192.0.2.5"));

    expect(response.status).toBe(403);
    expect(consoleError).toHaveBeenCalledWith(
      "reCAPTCHA rejected the secret key",
      ["invalid-input-secret"],
    );
  });

  it("answers 400 when the body cannot be read", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ success: true })),
    );

    const request = new NextRequest("https://kkweb.io/ja/email", {
      body: "not a form",
      headers: { "x-forwarded-for": "192.0.2.6" },
      method: "POST",
    });

    request.cookies.set("token", "token");

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("passes the sender's name so symbols cannot break the reply address", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ success: true })),
    );
    sendMail.mockResolvedValue({});

    const response = await POST(
      createRequest("192.0.2.7", "株式会社A: 山田 (営業)"),
    );

    expect(response.status).toBe(200);
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: {
          address: "sender@example.com",
          name: "株式会社A: 山田 (営業)",
        },
      }),
    );
  });

  it("stays quiet when a person simply fails the check", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ success: false })),
    );

    const response = await POST(createRequest("192.0.2.4"));

    expect(response.status).toBe(403);
    expect(consoleError).not.toHaveBeenCalled();
  });
});
