import type { Meta, StoryObj } from '@storybook/react';
import TransactionTable from './TransactionTable';
import { demoTransactions } from './TransactionTable.data';

const meta: Meta<typeof TransactionTable> = {
  title: 'Components/TransactionTable',
  component: TransactionTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    showDemoData: {
      control: 'boolean',
      description: 'Show demo data when no transactions provided',
    },
    transactions: {
      control: 'object',
      description: 'Array of transactions to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionTable>;

/**
 * Default state with demo data enabled for visualization
 */
export const WithDemoData: Story = {
  args: {
    showDemoData: true,
  },
};

/**
 * Empty state when no transactions and showDemoData is false
 */
export const Empty: Story = {
  args: {
    showDemoData: false,
    transactions: [],
  },
};

/**
 * With custom transactions passed as props
 */
export const WithCustomData: Story = {
  args: {
    showDemoData: false,
    transactions: [
      {
        id: 'custom-1',
        date: '01/2026',
        prism: 'Monthly Subscription',
        amount: '$9.99',
        status: 'Successful',
        account: 'john@example.com',
        isFavorite: false,
      },
      {
        id: 'custom-2',
        date: '01/2026',
        prism: 'One-time Purchase',
        amount: '50000 Sats',
        status: 'Pending',
        account: 'jane@example.com',
        isFavorite: true,
      },
    ],
  },
};

/**
 * With filters populated (prisms and contacts)
 */
export const WithFilters: Story = {
  args: {
    showDemoData: true,
    prisms: [
      { id: 'prism-1', name: 'Bitcoin Pizza' },
      { id: 'prism-2', name: 'Crypto Feast' },
      { id: 'prism-3', name: 'Tech Summit' },
    ],
    contacts: [
      { id: 'contact-1', firstName: 'Jamie', lastName: 'Smith', email: 'jamie@example.com' },
      { id: 'contact-2', firstName: 'Alex', lastName: 'Johnson', email: 'alex@example.com' },
    ],
  },
};

/**
 * Interactive playground with all controls
 */
export const Playground: Story = {
  args: {
    showDemoData: true,
    transactions: demoTransactions,
    prisms: [
      { id: 'prism-1', name: 'Bitcoin Pizza' },
      { id: 'prism-2', name: 'Crypto Feast' },
    ],
    contacts: [
      { id: 'contact-1', firstName: 'Jamie', lastName: 'Smith' },
    ],
  },
};
