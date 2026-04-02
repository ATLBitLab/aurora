/**
 * Demo/fixture data for TransactionTable component
 * Used for Storybook stories and development/testing
 */

export interface Transaction {
  id: string;
  date: string;
  prism: string;
  prismId?: string;
  amount: string;
  status: 'Successful' | 'Pending' | 'Active';
  account: string;
  accountId?: string;
  paymentMode?: string;
  isFavorite?: boolean;
}

export const demoTransactions: Transaction[] = [
  {
    id: '1',
    date: '06/2025',
    prism: 'bitcoin Pizza',
    amount: '$1,250.00',
    status: 'Successful',
    account: 'Jamie Smith',
    isFavorite: false,
  },
  {
    id: '2',
    date: '07/2025',
    prism: 'Crypto Feast',
    amount: '$500.00',
    status: 'Pending',
    account: 'Alex Johnson',
    isFavorite: false,
  },
  {
    id: '3',
    date: '09/2025',
    prism: 'Tech Summit',
    amount: '225078764578.00 sats',
    status: 'Successful',
    account: 'QHFI8WE8DYHWEBJhbsbdcus...',
    isFavorite: true,
  },
  {
    id: '4',
    date: '11/2025',
    prism: 'Health Expo',
    amount: '3000.00 Sats',
    status: 'Active',
    account: 'Michael Brown',
    isFavorite: false,
  },
  {
    id: '5',
    date: '06/2024',
    prism: 'The true man show movie...',
    amount: '999999999999999 Sats',
    status: 'Active',
    account: 'deekshasatapathy@twelve.cash',
    isFavorite: false,
  },
  {
    id: '6',
    date: '04/2025',
    prism: 'Fashion Week',
    amount: '56.5643679 Sats',
    status: 'Successful',
    account: 'Jessica Lee',
    isFavorite: false,
  },
  {
    id: '7',
    date: '08/2025',
    prism: 'Food Festival',
    amount: '1 Btc',
    status: 'Successful',
    account: 'kcuabcjbau2e482r982hufwueff...',
    isFavorite: false,
  },
  {
    id: '8',
    date: '12/2025',
    prism: 'Finance Forum',
    amount: '$1,200.00',
    status: 'Pending',
    account: 'Rachel Adams',
    isFavorite: false,
  },
];

export const demoPrisms = [
  { id: '1', name: 'bitcoin Pizza' },
  { id: '2', name: 'Crypto Feast' },
  { id: '3', name: 'Tech Summit' },
  { id: '4', name: 'Health Expo' },
  { id: '5', name: 'The true man show movie...' },
  { id: '6', name: 'Fashion Week' },
  { id: '7', name: 'Food Festival' },
  { id: '8', name: 'Finance Forum' },
];

export const demoContacts = [
  { id: '1', firstName: 'Jamie', lastName: 'Smith', screenName: null, email: 'jamie.smith@example.com' },
  { id: '2', firstName: 'Alex', lastName: 'Johnson', screenName: null, email: 'alex.johnson@example.com' },
  { id: '3', firstName: null, lastName: null, screenName: 'CryptoUser123', email: 'crypto@example.com' },
  { id: '4', firstName: 'Michael', lastName: 'Brown', screenName: null, email: 'michael.brown@example.com' },
  { id: '5', firstName: null, lastName: null, screenName: null, email: 'deekshasatapathy@twelve.cash' },
  { id: '6', firstName: 'Jessica', lastName: 'Lee', screenName: null, email: 'jessica.lee@example.com' },
  { id: '7', firstName: null, lastName: null, screenName: 'BitcoinLover', email: 'btc@example.com' },
  { id: '8', firstName: 'Rachel', lastName: 'Adams', screenName: null, email: 'rachel.adams@example.com' },
];
