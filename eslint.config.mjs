// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  ...storybook.configs["flat/recommended"],
  {
    // Disable no-renderer-packages rule only for Storybook files
    // We correctly use @storybook/nextjs-vite but the rule incorrectly flags
    // transitive @storybook/react dependency
    files: ["**/*.stories.@(js|jsx|ts|tsx|mdx)", ".storybook/**/*"],
    rules: {
      "storybook/no-renderer-packages": "off",
    },
  },
];

export default eslintConfig;
