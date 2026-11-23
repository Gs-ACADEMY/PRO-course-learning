import { defineConfig } from "vite";

// npm run build に 2 つのページを入れる（npm run dev では、なくても開ける）
export default defineConfig({
  build: {
    rolldownOptions: {
      input: ["index.html", "ai.html"],
    },
  },
});
