import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TransactionTable from "./TransactionTable";
import { demoTransactions, demoPrisms, demoContacts } from "./fixtures/transactionTableData";

const meta: Meta<typeof TransactionTable> = {
  title: "Components/TransactionTable",
  component: TransactionTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    transactions: {
      control: "object",
      description: "Array of transaction data to display in the table",
    },
    prisms: {
      control: "object",
      description: "Array of available prisms for filtering",
    },
    contacts: {
      control: "object",
      description: "Array of contacts for user filtering",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default story with demo data showing the full transaction table with filters and pagination
 */
export const WithDemoData: Story = {
  args: {
    transactions: demoTransactions,
    prisms: demoPrisms,
    contacts: demoContacts,
  },
};

/**
 * Empty state - shows how the table looks with no data
 */
export const Empty: Story = {
  args: {
    transactions: [],
    prisms: [],
    contacts: [],
  },
};

/**
 * Single transaction - useful for testing the table with minimal data
 */
export const SingleTransaction: Story = {
  args: {
    transactions: [demoTransactions[0]],
    prisms: [demoPrisms[0]],
    contacts: [demoContacts[0]],
  },
};

/**
 * Few transactions - shows pagination behavior with limited data
 */
export const FewTransactions: Story = {
  args: {
    transactions: demoTransactions.slice(0, 3),
    prisms: demoPrisms.slice(0, 3),
    contacts: demoContacts.slice(0, 3),
  },
};

/**
 * With favorites - demonstrates transactions marked as favorites
 */
export const WithFavorites: Story = {
  args: {
    transactions: demoTransactions.map((txn, idx) => ({
      ...txn,
      isFavorite: idx % 2 === 0, // Mark every other transaction as favorite
    })),
    prisms: demoPrisms,
    contacts: demoContacts,
  },
};

/**
 * Mixed statuses - shows all different transaction statuses
 */
export const MixedStatuses: Story = {
  args: {
    transactions: [
      { ...demoTransactions[0], status: 'Successful' as const },
      { ...demoTransactions[1], status: 'Pending' as const },
      { ...demoTransactions[2], status: 'Active' as const },
    ],
    prisms: demoPrisms.slice(0, 3),
    contacts: demoContacts.slice(0, 3),
  },
};
