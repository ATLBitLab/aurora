import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Button text",
    },
    showIcon: {
      control: "boolean",
      description: "Show icon before text",
    },
    style: {
      control: "select",
      options: ["Primary", "Secondary"],
      description: "Button style variant",
    },
    disabled: {
      control: "boolean",
      description: "Disable the button",
    },
    onClick: {
      action: "clicked",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Click Here",
    showIcon: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    text: "No Icon Button",
    showIcon: false,
  },
};

export const Disabled: Story = {
  args: {
    text: "Disabled Button",
    showIcon: true,
    disabled: true,
  },
};

export const CustomText: Story = {
  args: {
    text: "Submit",
    showIcon: true,
  },
};

export const LongText: Story = {
  args: {
    text: "This is a button with longer text",
    showIcon: true,
  },
};
