import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    passWithNoTests: true, // 配った直後（テスト 0 本）でも npm test が通るように
  },
});
