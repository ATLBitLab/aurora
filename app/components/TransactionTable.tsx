'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronUpIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { demoTransactions } from './TransactionTable.data';

const calendarIcon = "https://www.figma.com/api/mcp/asset/c83e973c-82cb-4edc-a5b4-c87f5774c875";
const starIconFilled = "https://www.figma.com/api/mcp/asset/e4b8e6a1-81fb-4b30-8c31-dad418948756";
const starIconOutline = "https://www.figma.com/api/mcp/asset/af286206-fd17-4ad9-9042-9ba3cc6cf3cc";
const chevronDownIcon = "https://www.figma.com/api/mcp/asset/e353d42f-828c-4a09-a6cf-c4d48027b1b6";
const arrowLeftIcon = "https://www.figma.com/api/mcp/asset/79630a33-05bd-489c-a889-a56fbcdbdc81";

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

interface TransactionTableProps {
  /** Array of transactions to display */
  transactions?: Transaction[];
  /** Available prisms for filtering */
  prisms?: Array<{ id: string; name: string }>;
  /** Available contacts for filtering */
  contacts?: Array<{ id: string; firstName?: string | null; lastName?: string | null; screenName?: string | null; email?: string | null }>;
  /** When true, shows demo data if no transactions provided. Use for Storybook/demos. */
  showDemoData?: boolean;
}

export default function TransactionTable({ 
  transactions = [],
  prisms = [],
  contacts = [],
  showDemoData = false
}: TransactionTableProps) {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filter states
  const [selectedDate, setSelectedDate] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [selectedUserId, setSelectedUserId] = useState<string | 'all'>('all');
  const [selectedPrismId, setSelectedPrismId] = useState<string | 'all'>('all');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string | 'all'>('all');
  
  // Dropdown states
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isPrismDropdownOpen, setIsPrismDropdownOpen] = useState(false);
  const [isPaymentModeDropdownOpen, setIsPaymentModeDropdownOpen] = useState(false);
  const [isRowsPerPageOpen, setIsRowsPerPageOpen] = useState(false);
  
  // Refs for click outside
  const datePickerRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const prismDropdownRef = useRef<HTMLDivElement>(null);
  const paymentModeDropdownRef = useRef<HTMLDivElement>(null);
  const rowsPerPageRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (prismDropdownRef.current && !prismDropdownRef.current.contains(event.target as Node)) {
        setIsPrismDropdownOpen(false);
      }
      if (paymentModeDropdownRef.current && !paymentModeDropdownRef.current.contains(event.target as Node)) {
        setIsPaymentModeDropdownOpen(false);
      }
      if (rowsPerPageRef.current && !rowsPerPageRef.current.contains(event.target as Node)) {
        setIsRowsPerPageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Parse date from MM/YYYY format
  const parseTransactionDate = (dateStr: string): Date => {
    const [month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, 1);
  };

  // Filter transactions based on selected filters
  const filterTransactions = (txns: Transaction[]): Transaction[] => {
    return txns.filter(txn => {
      // Date filter
      if (selectedDate.start || selectedDate.end) {
        try {
          const txDate = parseTransactionDate(txn.date);
          if (selectedDate.start) {
            const startDate = new Date(selectedDate.start);
            startDate.setHours(0, 0, 0, 0);
            if (txDate < startDate) return false;
          }
          if (selectedDate.end) {
            const endDate = new Date(selectedDate.end);
            endDate.setHours(23, 59, 59, 999);
            if (txDate > endDate) return false;
          }
        } catch {
          // If date parsing fails, include the transaction
        }
      }
      
      // User filter
      if (selectedUserId !== 'all' && txn.accountId !== selectedUserId) {
        return false;
      }
      
      // Prism filter
      if (selectedPrismId !== 'all' && txn.prismId !== selectedPrismId) {
        return false;
      }
      
      // Payment mode filter
      if (selectedPaymentMode !== 'all' && txn.paymentMode !== selectedPaymentMode) {
        return false;
      }
      
      return true;
    });
  };

  // Use provided transactions, or demo data if showDemoData is true, otherwise empty
  const displayTransactions = transactions.length > 0 
    ? transactions 
    : (showDemoData ? demoTransactions : []);
  const filteredTransactions = filterTransactions(displayTransactions);
  const totalTransactions = filteredTransactions.length;
  const totalPages = Math.ceil(totalTransactions / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, selectedUserId, selectedPrismId, selectedPaymentMode]);

  // Reset all filters
  const handleResetAll = () => {
    setSelectedDate({ start: null, end: null });
    setSelectedUserId('all');
    setSelectedPrismId('all');
    setSelectedPaymentMode('all');
    setCurrentPage(1);
  };

  // Get unique payment modes from transactions
  const paymentModes: string[] = Array.from(new Set(displayTransactions.map(t => t.paymentMode).filter((m): m is string => Boolean(m))));

  // Get display name for user
  const getUserDisplayName = (contact: { firstName?: string | null; lastName?: string | null; screenName?: string | null; email?: string | null }) => {
    if (contact.firstName && contact.lastName) {
      return `${contact.firstName} ${contact.lastName}`;
    }
    return contact.screenName || contact.email || 'Unknown';
  };

  // Format date for display
  const formatDateFilter = () => {
    if (!selectedDate.start && !selectedDate.end) return 'Select Date';
    if (selectedDate.start && selectedDate.end) {
      return `${selectedDate.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${selectedDate.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    if (selectedDate.start) {
      return `From ${selectedDate.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    if (selectedDate.end) {
      return `Until ${selectedDate.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return 'Select Date';
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Successful':
        return 'text-[#0acaa1]';
      case 'Pending':
        return 'text-[#ff0509]';
      case 'Active':
        return 'text-[#ffd905]';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="bg-[#030404] flex flex-col gap-[40px] items-start justify-center px-6 py-6 rounded-[24px] w-full overflow-x-auto">
      <div className="flex flex-col gap-[40px] items-start w-full min-w-0">
        {/* Header Section */}
        <div className="flex flex-col gap-[24px] items-start w-full">
          {/* Title */}
          <div className="flex items-start justify-between px-1 py-0 w-full">
            <div className="flex flex-1 gap-[11px] items-center min-h-px min-w-px">
              <div className="border-[0.833px] border-[#66706f] flex items-center justify-center rounded-full shrink-0 w-[36px] h-[36px] p-[13.333px]">
                <ChevronUpIcon className="w-[13.333px] h-[13.333px] text-white" />
              </div>
              <p className="text-white text-[18px] font-medium leading-[18px] text-center">
                All transactions
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-[8px] items-center">
              {/* Select Date */}
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="border-[0.5px] border-[#66706f] flex items-center justify-center gap-1 h-full px-4 py-3 rounded-full shrink-0 cursor-pointer hover:border-white/50 transition-colors"
                >
                  <img src={calendarIcon} alt="Calendar" className="w-2 h-2" />
                  <p className="text-white text-[12px] font-normal leading-[18px] text-center">
                    {formatDateFilter()}
                  </p>
                </button>
                {isDatePickerOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-[#030404] border border-white/15 rounded-lg shadow-lg z-50 p-4 min-w-[280px]">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <label className="text-white text-xs">Start Date</label>
                        <input
                          type="date"
                          value={selectedDate.start?.toISOString().split('T')[0] || ''}
                          onChange={(e) => {
                            const newStart = e.target.value ? new Date(e.target.value) : null;
                            setSelectedDate(prev => ({ ...prev, start: newStart }));
                          }}
                          className="bg-[#292e2d] border border-white/15 rounded px-3 py-2 text-white text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-white text-xs">End Date</label>
                        <input
                          type="date"
                          value={selectedDate.end?.toISOString().split('T')[0] || ''}
                          onChange={(e) => {
                            const newEnd = e.target.value ? new Date(e.target.value) : null;
                            setSelectedDate(prev => ({ ...prev, end: newEnd }));
                          }}
                          className="bg-[#292e2d] border border-white/15 rounded px-3 py-2 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Select User */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="border-[0.5px] border-[#66706f] flex items-center justify-center gap-1 h-full px-4 py-3 rounded-full shrink-0 cursor-pointer hover:border-white/50 transition-colors"
                >
                  <p className="text-white text-[12px] font-normal leading-[18px] text-center">
                    {selectedUserId === 'all' ? 'Select User' : getUserDisplayName(contacts.find(c => c.id === selectedUserId) || {})}
                  </p>
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-[#030404] border border-white/15 rounded-lg shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedUserId('all');
                        setIsUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-white text-sm hover:bg-white/10 ${
                        selectedUserId === 'all' ? 'bg-white/10' : ''
                      }`}
                    >
                      All Users
                    </button>
                    {contacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => {
                          setSelectedUserId(contact.id);
                          setIsUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-white text-sm hover:bg-white/10 ${
                          selectedUserId === contact.id ? 'bg-white/10' : ''
                        }`}
                      >
                        {getUserDisplayName(contact)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Select Prism */}
              <div className="relative" ref={prismDropdownRef}>
                <button
                  onClick={() => setIsPrismDropdownOpen(!isPrismDropdownOpen)}
                  className="border-[0.5px] border-[#66706f] flex items-center justify-center gap-1 h-full px-4 py-3 rounded-full shrink-0 cursor-pointer hover:border-white/50 transition-colors"
                >
                  <p className="text-white text-[12px] font-normal leading-[18px] text-center">
                    {selectedPrismId === 'all' ? 'Select Prism' : prisms.find(p => p.id === selectedPrismId)?.name || 'Select Prism'}
                  </p>
                </button>
                {isPrismDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-[#030404] border border-white/15 rounded-lg shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedPrismId('all');
                        setIsPrismDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-white text-sm hover:bg-white/10 ${
                        selectedPrismId === 'all' ? 'bg-white/10' : ''
                      }`}
                    >
                      All Prisms
                    </button>
                    {prisms.map((prism) => (
                      <button
                        key={prism.id}
                        onClick={() => {
                          setSelectedPrismId(prism.id);
                          setIsPrismDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-white text-sm hover:bg-white/10 ${
                          selectedPrismId === prism.id ? 'bg-white/10' : ''
                        }`}
                      >
                        {prism.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mode of payment */}
              <div className="relative" ref={paymentModeDropdownRef}>
                <button
                  onClick={() => setIsPaymentModeDropdownOpen(!isPaymentModeDropdownOpen)}
                  className="border-[0.5px] border-[#66706f] flex items-center justify-center gap-1 h-full px-4 py-3 rounded-full shrink-0 cursor-pointer hover:border-white/50 transition-colors"
                >
                  <p className="text-white text-[12px] font-normal leading-[18px] text-center">
                    {selectedPaymentMode === 'all' ? 'Mode of payment' : selectedPaymentMode}
                  </p>
                </button>
                {isPaymentModeDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-[#030404] border border-white/15 rounded-lg shadow-lg z-50 min-w-[200px]">
                    <button
                      onClick={() => {
                        setSelectedPaymentMode('all');
                        setIsPaymentModeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-white text-sm hover:bg-white/10 ${
                        selectedPaymentMode === 'all' ? 'bg-white/10' : ''
                      }`}
                    >
                      All Modes
                    </button>
                    {paymentModes.map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          if (typeof mode === 'string') setSelectedPaymentMode(mode);
                          setIsPaymentModeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-white text-sm hover:bg-white/10 ${
                          selectedPaymentMode === mode ? 'bg-white/10' : ''
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reset All */}
            <button
              onClick={handleResetAll}
              className="border-[0.5px] border-[#66706f] flex items-center justify-center gap-1 h-[32px] px-4 py-3 rounded-full shrink-0 cursor-pointer hover:border-white/50 transition-colors"
            >
              <p className="text-white text-[12px] font-normal leading-[18px] text-center">
                Reset All
              </p>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col gap-2 items-start justify-center px-3 py-0 w-full overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-[40px_minmax(80px,1fr)_minmax(120px,1.5fr)_minmax(100px,1fr)_minmax(80px,1fr)_minmax(120px,1.5fr)_60px] sm:grid-cols-[40px_100px_180px_130px_100px_180px_60px] md:grid-cols-[40px_120px_200px_140px_120px_200px_80px] gap-3 sm:gap-4 md:gap-5 h-[17px] w-full">
            <div className="col-[1] flex flex-col items-center justify-center">
              <p className="text-white text-[12px] font-semibold leading-[14px]"></p>
            </div>
            <div className="col-[2] flex flex-col items-start justify-center">
              <p className="text-white text-[12px] font-semibold leading-[14px]">Date</p>
            </div>
            <div className="col-[3] flex flex-col items-start justify-center">
              <p className="text-white text-[12px] font-semibold leading-[14px]">Prism</p>
            </div>
            <div className="col-[4] flex flex-col items-end justify-center">
              <p className="text-white text-[12px] font-semibold leading-[14px]">Amount</p>
            </div>
            <div className="col-[5] flex flex-col items-start justify-center">
              <p className="text-white text-[12px] font-semibold leading-[14px]">Status</p>
            </div>
            <div className="col-[6] flex flex-col items-start justify-center">
              <p className="text-white text-[12px] font-semibold leading-[14px]">Account</p>
            </div>
            <div className="col-[7] flex flex-col items-center justify-center">
              <p className="text-white text-[12px] font-semibold leading-[14px] hidden sm:block">
                View Details
              </p>
            </div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col items-start w-full">
            {paginatedTransactions.map((transaction) => {
              const isFavorite = favorites.has(transaction.id) || transaction.isFavorite;
              return (
                <div
                  key={transaction.id}
                  className="border-b border-white/15 grid grid-cols-[40px_minmax(80px,1fr)_minmax(120px,1.5fr)_minmax(100px,1fr)_minmax(80px,1fr)_minmax(120px,1.5fr)_60px] sm:grid-cols-[40px_100px_180px_130px_100px_180px_60px] md:grid-cols-[40px_120px_200px_140px_120px_200px_80px] gap-3 sm:gap-4 md:gap-5 h-auto min-h-[50px] px-0 py-3 w-full"
                >
                  {/* Star Icon - Left Side */}
                  <div className="col-[1] flex items-center justify-center">
                    <button
                      onClick={() => toggleFavorite(transaction.id)}
                      className="w-5 h-5 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <img
                        src={isFavorite ? starIconFilled : starIconOutline}
                        alt={isFavorite ? 'Favorite' : 'Not favorite'}
                        className="w-5 h-5 object-contain"
                      />
                    </button>
                  </div>

                  {/* Date */}
                  <div className="col-[2] flex flex-col items-start justify-center">
                    <p className="text-white/50 text-[12px] font-semibold leading-[14px] break-words">
                      {transaction.date}
                    </p>
                  </div>

                  {/* Prism */}
                  <div className="col-[3] flex flex-col items-start justify-center">
                    <p className="text-white text-[12px] font-semibold leading-[14px] truncate w-full">
                      {transaction.prism}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="col-[4] flex flex-col items-end justify-center">
                    <p className="text-white text-[12px] font-semibold leading-[14px] text-right whitespace-nowrap break-words">
                      {transaction.amount}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-[5] flex flex-col items-start justify-center">
                    <p className={`${getStatusColor(transaction.status)} text-[12px] font-semibold leading-[14px]`}>
                      {transaction.status}
                    </p>
                  </div>

                  {/* Account */}
                  <div className="col-[6] flex flex-col items-start justify-center">
                    <p className="text-white/50 text-[12px] font-semibold leading-[14px] opacity-50 truncate w-full">
                      {transaction.account}
                    </p>
                  </div>

                  {/* View Details Arrow Icon */}
                  <div className="col-[7] flex items-center justify-center">
                    <button
                      onClick={() => {
                        // Navigate to transaction details page
                        router.push(`/transactions/${transaction.id}`);
                      }}
                      className="w-5 h-5 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                      aria-label="View transaction details"
                    >
                      <ArrowRightIcon className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex h-[34px] items-center justify-between w-full">
          <div className="flex items-center justify-center p-[10px]">
            <p className="text-white text-[12px] font-medium leading-[18px]">
              {startIndex + 1} - {Math.min(endIndex, totalTransactions)} of {totalTransactions}
            </p>
          </div>
          <div className="flex gap-[57px] h-[34px] items-center">
            {/* Rows per page */}
            <div className="relative flex gap-3 items-center" ref={rowsPerPageRef}>
              <p className="text-[#aeb9e1] text-[12px] font-medium leading-[18px]">
                Rows per page:
              </p>
              <button
                onClick={() => setIsRowsPerPageOpen(!isRowsPerPageOpen)}
                className="bg-[#030404] border-[0.6px] border-[#66706f] flex items-start overflow-hidden px-2 py-1.5 rounded shadow-[1px_1px_1px_0px_rgba(16,25,52,0.4)] cursor-pointer hover:border-white/30 transition-colors"
              >
                <div className="flex gap-1 items-center">
                  <p className="text-[#d9e1fa] text-[10px] font-medium leading-[14px]">
                    {rowsPerPage}
                  </p>
                  <div className="opacity-80 overflow-hidden shrink-0 w-3 h-3">
                    <img src={chevronDownIcon} alt="Dropdown" className="w-full h-full" />
                  </div>
                </div>
              </button>
              {isRowsPerPageOpen && (
                <div className="absolute top-full right-0 mt-2 bg-[#030404] border border-white/15 rounded-lg shadow-lg z-50 min-w-[100px]">
                  {[5, 10, 20, 50, 100].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setRowsPerPage(num);
                        setCurrentPage(1);
                        setIsRowsPerPageOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-white text-sm hover:bg-white/10 ${
                        rowsPerPage === num ? 'bg-white/10' : ''
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-[7px] h-[34px] items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center rounded-full w-[27px] h-[26px] p-4 disabled:opacity-50"
              >
                <div className="flex-none rotate-[180deg] scale-y-[-100%]">
                  <img src={arrowLeftIcon} alt="Previous" className="w-[18px] h-[18px]" />
                </div>
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center rounded-full w-[27px] h-[26px] p-4 disabled:opacity-50"
              >
                <img src={arrowLeftIcon} alt="Next" className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

