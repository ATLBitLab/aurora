import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PrismCard from "./PrismCard";

const meta: Meta<typeof PrismCard> = {
  title: "Components/PrismCard",
  component: PrismCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "320px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPrimaryAccount = {
  id: "1",
  firstName: "Stephen",
  lastName: "DeLorme",
  screenName: "sbddesign",
  email: "stephen@atlbitlab.com",
};

export const Default: Story = {
  args: {
    id: "prism-1",
    name: "ATL BitLab",
    active: true,
    totalDeposited: 250000,
    memberCount: 12,
    category: "Community",
    createdAt: new Date("2024-01-15"),
    primaryAccount: mockPrimaryAccount,
  },
};

export const Inactive: Story = {
  args: {
    id: "prism-2",
    name: "Test Prism",
    active: false,
    totalDeposited: 0,
    memberCount: 3,
    createdAt: new Date("2024-06-01"),
    primaryAccount: mockPrimaryAccount,
  },
};

export const HighValue: Story = {
  args: {
    id: "prism-3",
    name: "Savings Fund",
    active: true,
    totalDeposited: 1500000,
    memberCount: 5,
    category: "Savings",
    createdAt: new Date("2023-12-01"),
    primaryAccount: {
      id: "2",
      firstName: null,
      lastName: null,
      screenName: "satoshi",
      email: null,
    },
  },
};

export const NoCategory: Story = {
  args: {
    id: "prism-4",
    name: "General Fund",
    active: true,
    totalDeposited: 50000,
    memberCount: 8,
    createdAt: new Date("2024-03-20"),
    primaryAccount: mockPrimaryAccount,
  },
};

export const ManyMembers: Story = {
  args: {
    id: "prism-5",
    name: "Conference Pool",
    active: true,
    totalDeposited: 750000,
    memberCount: 150,
    category: "Events",
    createdAt: new Date("2024-02-28"),
    primaryAccount: mockPrimaryAccount,
  },
};
