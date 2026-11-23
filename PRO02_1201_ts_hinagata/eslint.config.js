// ESLint の決まり（12/1 の演習で使う）
// 赤線を消すだけの近道（any・as・!・@ts-ignore）を見つけて止める。npm run lint で動き、npm run build の最初にも動く
// 見るのは TypeScript のファイルだけ。移す前の JavaScript（src/calc.js・src/janken.js）は見ない
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig(
  { ignores: ["dist", "**/*.js"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    linterOptions: {
      // コードの中のコメント（// eslint-disable など）で決まりを外せないようにする
      noInlineConfig: true,
      reportUnusedDisableDirectives: "error",
    },
    rules: {
      // any：何でも入る型
      "@typescript-eslint/no-explicit-any": "error",
      // !：null ではない、と言い切る
      "@typescript-eslint/no-non-null-assertion": "error",
      // @ts-ignore・@ts-expect-error・@ts-nocheck：赤線を理由なく消す
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": true, "ts-nocheck": true, "ts-expect-error": true }],
      // as：この型だ、と言い切る（as const は使える）
      "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
    },
  },
);
