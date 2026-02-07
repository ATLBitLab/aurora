import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ContactCard from "./ContactCard";

const meta: Meta<typeof ContactCard> = {
  title: "Components/ContactCard",
  component: ContactCard,
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

const mockContact = {
  id: "1",
  firstName: "Satoshi",
  lastName: "Nakamoto",
  screenName: "satoshi",
  email: "satoshi@bitcoin.org",
  nostrPubkey: "npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
  metadata: {
    telegram: "@satoshi",
    twitter: "@satoshi",
    github: "satoshinakamoto",
    tags: [
      { text: "Bitcoin", color: "#F7931A" },
      { text: "Cypherpunk", color: "#8a05ff" },
    ],
  },
};

export const Default: Story = {
  args: {
    contact: mockContact,
    variant: "open",
  },
};

export const Closed: Story = {
  args: {
    contact: mockContact,
    variant: "close",
  },
};

export const MinimalInfo: Story = {
  args: {
    contact: {
      id: "2",
      firstName: null,
      lastName: null,
      screenName: "anon",
      email: null,
      nostrPubkey: null,
      metadata: null,
    },
    variant: "open",
  },
};

export const WithTags: Story = {
  args: {
    contact: {
      ...mockContact,
      metadata: {
        ...mockContact.metadata,
        tags: [
          { text: "Lightning Network enthusiast", color: "#8a05ff" },
          { text: "bitcoin Conference 2023", color: "#345204" },
          { text: "Developer", color: "#0066cc" },
        ],
      },
    },
    variant: "open",
  },
};

export const NoSocials: Story = {
  args: {
    contact: {
      id: "3",
      firstName: "Alice",
      lastName: "Smith",
      screenName: "alice",
      email: "alice@example.com",
      nostrPubkey: null,
      metadata: {},
    },
    variant: "open",
  },
};
