import { defineConfig } from "vite";

// npm run build に 2 つのページ（計算・じゃんけん）を入れる（npm run dev では、なくても開ける）
export default defineConfig({
  build: {
    rolldownOptions: {
      input: ["index.html", "janken.html"],
    },
  },
});
