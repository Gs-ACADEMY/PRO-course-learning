import { defineConfig } from "vite";

// npm run build に 3 つのページを入れる（npm run dev では、なくても開ける）
export default defineConfig({
  build: {
    rolldownOptions: {
      input: ["index.html", "ts.html", "fixed.html"],
    },
  },
});
