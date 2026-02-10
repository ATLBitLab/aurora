// Demo data for TransactionTable component
// Use in Storybook or when showDemoData prop is true

import type { Transaction } from './TransactionTable';

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
