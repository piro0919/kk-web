import { describe, expect, it } from "vitest";
import { emailSchema } from "../app/[locale]/email/schema";

const validData = {
  email: "test@example.com",
  message: "Hello",
  name: "Test User",
  subject: "Test Subject",
};

describe("emailSchema", () => {
  it("should accept valid data", () => {
    const result = emailSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = emailSchema.safeParse({ ...validData, email: "not-email" });

    expect(result.success).toBe(false);
  });

  it("should reject empty name", () => {
    const result = emailSchema.safeParse({ ...validData, name: "" });

    expect(result.success).toBe(false);
  });

  it("should reject empty subject", () => {
    const result = emailSchema.safeParse({ ...validData, subject: "" });

    expect(result.success).toBe(false);
  });

  it("should reject empty message", () => {
    const result = emailSchema.safeParse({ ...validData, message: "" });

    expect(result.success).toBe(false);
  });

  it("should reject email exceeding 254 characters", () => {
    const longEmail = `${"a".repeat(243)}@example.com`;
    const result = emailSchema.safeParse({ ...validData, email: longEmail });

    expect(result.success).toBe(false);
  });

  it("should reject name exceeding 200 characters", () => {
    const result = emailSchema.safeParse({
      ...validData,
      name: "a".repeat(201),
    });

    expect(result.success).toBe(false);
  });

  it("should reject subject exceeding 200 characters", () => {
    const result = emailSchema.safeParse({
      ...validData,
      subject: "a".repeat(201),
    });

    expect(result.success).toBe(false);
  });

  it("should reject message exceeding 10000 characters", () => {
    const result = emailSchema.safeParse({
      ...validData,
      message: "a".repeat(10001),
    });

    expect(result.success).toBe(false);
  });

  it("should reject null values", () => {
    const result = emailSchema.safeParse({
      email: null,
      message: null,
      name: null,
      subject: null,
    });

    expect(result.success).toBe(false);
  });
});
