import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import tsParser from "@typescript-eslint/parser";
import css from "eslint-plugin-css";
import cssModules from "eslint-plugin-css-modules";
import ext from "eslint-plugin-ext";
import perfectionist from "eslint-plugin-perfectionist";
import promise from "eslint-plugin-promise";
import unusedImports from "eslint-plugin-unused-imports";
import writeGoodComments from "eslint-plugin-write-good-comments";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { fixupPluginRules } from "@eslint/compat";
import filenamesPlugin from "eslint-plugin-filenames";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});
const eslintConfig = [
  // next lint は暗黙に除いていた。eslint を直に呼ぶので自分で書く。
  {
    ignores: [
      ".claude/**",
      ".next/**",
      "coverage/**",
      "dist/**",
      "node_modules/**",
      "public/**",
      // 設定ファイルと型宣言は tsconfig の対象外で、型情報を要する規則が
      // 通らない。next lint が暗黙に外していたのと同じ範囲。
      "**/*.config.{js,mjs,ts}",
      "**/*.d.ts",
      ".prettierrc.js",
      "scripts/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:css/recommended",
    "plugin:no-unsanitized/recommended-legacy",
    "plugin:promise/recommended",
    "plugin:security/recommended-legacy",
    "prettier",
  ),
  // eslint-config-next は 16 から flat 形式を直接出す。互換層を通すと
  // eslint 10 で設定の検証に落ちるので、そのまま読み込む。
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    languageOptions: {
      ecmaVersion: 2024,
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json"],
        warnOnUnsupportedTypeScriptVersion: false,
      },
      sourceType: "module",
    },
    // eslint-plugin-react は React の版を自力で探そうとして、eslint 10 では
    // 落ちる。版を直接教えて、探させない。
    settings: {
      react: { version: "19.2" },
    },
    plugins: {
      css,
      "css-modules": cssModules,
      ext,
      filenames: fixupPluginRules(filenamesPlugin),
      perfectionist,
      promise,
      "unused-imports": unusedImports,
      "write-good-comments": writeGoodComments,
    },
    rules: {
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "css-modules/no-unused-class": [2, { camelCase: true }],
      "css-modules/no-undef-class": [2, { camelCase: true }],
      "ext/lines-between-object-properties": ["error", "never"],
      "filenames/match-exported": ["error", ["camel", "kebab", "pascal"]],
      "filenames/match-regex": "error",
      "filenames/no-index": "off",
      "import/newline-after-import": ["error", { count: 1 }],
      "import/order": "off",
      "import/prefer-default-export": "error",
      "no-alert": "error",
      "no-console": "error",
      "no-duplicate-imports": "error",
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          next: [
            "block",
            "block-like",
            "break",
            "class",
            "const",
            "do",
            "export",
            "function",
            "let",
            "return",
            "switch",
            "try",
            "while",
          ],
          prev: "*",
        },
        {
          blankLine: "always",
          next: "*",
          prev: [
            "block",
            "block-like",
            "break",
            "class",
            "const",
            "do",
            "export",
            "function",
            "let",
            "return",
            "switch",
            "try",
            "while",
          ],
        },
        {
          blankLine: "never",
          next: "import",
          prev: "*",
        },
        {
          blankLine: "never",
          next: ["case", "default"],
          prev: "case",
        },
        {
          blankLine: "never",
          next: "const",
          prev: "const",
        },
        {
          blankLine: "never",
          next: "let",
          prev: "let",
        },
      ],
      "perfectionist/sort-exports": [
        "error",
        {
          order: "asc",
          partitionByNewLine: true,
          type: "natural",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          name: "next/link",
          message: "Please import from `@/i18n/navigation` instead.",
        },
        {
          name: "next/navigation",
          importNames: [
            "redirect",
            "permanentRedirect",
            "useRouter",
            "usePathname",
          ],
          message: "Please import from `@/i18n/navigation` instead.",
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          // perfectionist 5 で "object" という分類が無くなった。
          groups: [
            ["builtin", "external"],
            "internal",
            ["parent", "sibling"],
            "index",
            "type",
            "unknown",
          ],
          newlinesBetween: 0,
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-interfaces": [
        "error",
        {
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-jsx-props": [
        "error",
        {
          // perfectionist 5 で multiline / shorthand の分類名が変わった。
          groups: ["multiline-prop", "shorthand-prop", "unknown"],
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-named-imports": [
        "error",
        {
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-object-types": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
      "perfectionist/sort-objects": [
        "error",
        {
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-union-types": [
        "error",
        {
          order: "asc",
          type: "natural",
        },
      ],
      quotes: ["error", "double"],
      "react-hooks/exhaustive-deps": [
        "error",
        {
          enableDangerousAutofixThisMayCauseInfiniteLoops: true,
        },
      ],
      "react/jsx-boolean-value": ["error", "always"],
      "react/jsx-newline": [
        "error",
        {
          prevent: true,
        },
      ],
      semi: ["error", "always"],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
      "write-good-comments/write-good-comments": "error",
    },
  },
  {
    files: ["src/__tests__/**"],
    rules: {
      "filenames/match-regex": "off",
    },
  },
];

export default eslintConfig;
