import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    // 作業用の複製が .claude 配下に残っていると、同じテストを重ねて拾う。
    exclude: ["**/node_modules/**", ".claude/**"],
  },
});
