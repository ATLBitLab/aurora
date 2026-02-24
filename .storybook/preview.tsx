import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import React from "react";

// Import global styles for Tailwind and CSS variables
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Set dark background as default
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#030404" },
        { name: "light", value: "#ffffff" },
      ],
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    // Wrap stories in a div with the proper background/foreground colors
    (Story) => (
      <div
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          padding: "1rem",
          minHeight: "100vh",
        }}
      >
        <Story />
      </div>
    ),
    // Theme switcher
    withThemeByClassName({
      themes: {
        dark: "dark",
        light: "light",
      },
      defaultTheme: "dark",
    }),
  ],
};

export default preview;
