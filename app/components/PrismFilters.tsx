'use client';

import { useState, useEffect, useRef } from 'react';

const calendarIcon = "https://www.figma.com/api/mcp/asset/db94ab8f-fda5-466b-8270-035516a1e835";

interface Contact {
  id: string;
  firstName: string | null;
  lastName: string | null;
  screenName: string | null;
  email: string | null;
}

interface Prism {
  id: string;
  name: string;
}

interface PrismFiltersProps {
  contacts?: Contact[];
  prisms?: Prism[];
  onFilterChange?: (filters: {
    dateRange: { start: Date | null; end: Date | null };
    drafts: boolean;
    userId: string | 'all';
    prismId: string | 'all';
    paymentMode: string | 'all';
  }) => void;
}

export default function PrismFilters({
  contacts = [],
  prisms = [],
  onFilterChange,
}: PrismFiltersProps) {
  const [selectedDate, setSelectedDate] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [drafts, setDrafts] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | 'all'>('all');
  const [selectedPrismId, setSelectedPrismId] = useState<string | 'all'>('all');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string | 'all'>('all');

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isPrismDropdownOpen, setIsPrismDropdownOpen] = useState(false);
  const [isPaymentModeDropdownOpen, setIsPaymentModeDropdownOpen] = useState(false);

  const datePickerRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const prismDropdownRef = useRef<HTMLDivElement>(null);
  const paymentModeDropdownRef = useRef<HTMLDivElement>(null);

  const paymentModes = ['Lightning', 'On-chain', 'Fiat'];

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange?.({
      dateRange: selectedDate,
      drafts,
      userId: selectedUserId,
      prismId: selectedPrismId,
      paymentMode: selectedPaymentMode,
    });
  }, [selectedDate, drafts, selectedUserId, selectedPrismId, selectedPaymentMode, onFilterChange]);

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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResetAll = () => {
    setSelectedDate({ start: null, end: null });
    setDrafts(false);
    setSelectedUserId('all');
    setSelectedPrismId('all');
    setSelectedPaymentMode('all');
  };

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

  const getUserDisplayName = (contact: Contact): string => {
    if (contact.firstName && contact.lastName) return `${contact.firstName} ${contact.lastName}`;
    if (contact.screenName) return contact.screenName;
    if (contact.email) return contact.email;
    return 'Unknown';
  };

  return (
    <div className="flex items-center justify-between w-full gap-2 flex-wrap">
      {/* Left side filters */}
      <div className="flex gap-2 items-center flex-wrap">
        {/* Select Date */}
        <div className="relative" ref={datePickerRef}>
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="border-[0.5px] border-[#66706f] flex items-center gap-1 px-4 py-3 rounded-full shrink-0 cursor-pointer hover:border-white/50 transition-colors"
          >
            <div className="w-2 h-2 shrink-0">
              <img src={calendarIcon} alt="Calendar" className="w-full h-full object-contain" />
            </div>
            <p className="text-white text-[12px] font-normal leading-[18px] text-center whitespace-nowrap">
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
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      const today = new Date();
                      const startOfWeek = new Date(today);
                      startOfWeek.setDate(today.getDate() - today.getDay());
                      const endOfWeek = new Date(startOfWeek);
                      endOfWeek.setDate(startOfWeek.getDate() + 6);
                      setSelectedDate({ start: startOfWeek, end: endOfWeek });
                      setIsDatePickerOpen(false);
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded"
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date();
                      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                      setSelectedDate({ start: startOfMonth, end: endOfMonth });
                      setIsDatePickerOpen(false);
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded"
                  >
                    This Month
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drafts */}
        <button
          onClick={() => setDrafts(!drafts)}
          className={`border-[0.5px] border-[#66706f] flex items-center justify-center px-4 py-3 rounded-full shrink-0 cursor-pointer hover:border-white/50 transition-colors ${
            drafts ? 'bg-white/10 border-white/50' : ''
          }`}
        >
          <p className="text-white text-[12px] font-normal leading-[18px] text-center whitespace-nowrap">
            Drafts
          </p>
        </button>

        {/* Select User */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="border-[0.5px] border-[#66706f] flex items-center justify-center px-4 py-3 rounded-full shrink-0 cursor-pointer hover:border-white/50 transition-colors"
          >
            <p className="text-white text-[12px] font-normal leading-[18px] text-center whitespace-nowrap">
              {selectedUserId === 'all' ? 'Select User' : getUserDisplayName(contacts.find(c => c.id === selectedUserId) || contacts[0])}
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
            className="border-[0.5px] border-[#66706f] flex items-center justify-center px-4 py-3 rounded-full shrink-0 cursor-pointer hover:border-white/50 transition-colors"
          >
            <p className="text-white text-[12px] font-normal leading-[18px] text-center whitespace-nowrap">
              {selectedPrismId === 'all' ? 'Select Prism' : (prisms.find(p => p.id === selectedPrismId)?.name || 'Select Prism')}
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
            className="border-[0.5px] border-[#66706f] flex items-center justify-center px-4 py-3 rounded-full shrink-0 cursor-pointer hover:border-white/50 transition-colors"
          >
            <p className="text-white text-[12px] font-normal leading-[18px] text-center whitespace-nowrap">
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
                    setSelectedPaymentMode(mode);
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

      {/* Reset All button */}
      <button
        onClick={handleResetAll}
        className="border-[0.5px] border-[#66706f] flex items-center justify-center px-4 py-3 h-[32px] rounded-full shrink-0 cursor-pointer hover:border-white/50 transition-colors"
      >
        <p className="text-white text-[12px] font-normal leading-[18px] text-center whitespace-nowrap">
          Reset All
        </p>
      </button>
    </div>
  );
}

