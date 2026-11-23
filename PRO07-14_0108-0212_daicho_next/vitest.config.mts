import { defineConfig } from "vitest/config";

export default defineConfig({
  // tsconfig.json の paths（@/ ＝ このフォルダーの一番上）を、テストでも使う
  resolve: { tsconfigPaths: true },
});
