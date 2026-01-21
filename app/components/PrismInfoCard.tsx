'use client';

import { useState, useEffect, useRef } from 'react';
import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const prismIconSmall = "https://www.figma.com/api/mcp/asset/10137fb3-e968-48ed-b94b-6b237e0523c2";
const calendarIcon = "https://www.figma.com/api/mcp/asset/d1d1fdb3-e32a-458c-af2f-e4d6f0045934";
const chevronIcon = "https://www.figma.com/api/mcp/asset/05a86a9f-8376-45a7-b3fb-21ee2a64ff27";

interface Prism {
  id: string;
  name: string;
}

interface PrismInfoCardProps {
  totalCollected?: number;
  totalDispatched?: number;
  pending?: number;
  prisms?: Prism[];
  selectedPrismId?: string | 'all';
  onPrismChange?: (prismId: string | 'all') => void;
  dateRange?: { start: Date; end: Date };
  onDateRangeChange?: (range: { start: Date; end: Date }) => void;
}

export default function PrismInfoCard({
  totalCollected = 0,
  totalDispatched = 0,
  pending = 0,
  prisms = [],
  selectedPrismId = 'all',
  onPrismChange,
  dateRange,
  onDateRangeChange,
}: PrismInfoCardProps) {
  const [isPrismDropdownOpen, setIsPrismDropdownOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const prismDropdownRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Calculate total
  const total = totalCollected + totalDispatched + pending;

  // Format currency
  const formatCurrency = (amount: number): string => {
    const parts = amount.toFixed(2).split('.');
    const integerPart = parseInt(parts[0]).toLocaleString();
    return `${integerPart}.${parts[1]}`;
  };

  // Format date range to match Figma: "01June - 08June"
  const formatDateRange = (start: Date, end: Date): string => {
    const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
    const startDay = start.getDate().toString().padStart(2, '0');
    const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
    const endDay = end.getDate().toString().padStart(2, '0');
    return `${startDay}${startMonth} - ${endDay}${endMonth}`;
  };

  // Initialize date range to current week if not provided
  const [currentDateRange, setCurrentDateRange] = useState(() => {
    if (dateRange) return dateRange;
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
    return { start: startOfWeek, end: endOfWeek };
  });

  // Update local state when prop changes
  useEffect(() => {
    if (dateRange) {
      setCurrentDateRange(dateRange);
    }
  }, [dateRange]);

  // Handle date range change
  const handleDateRangeChange = (start: Date, end: Date) => {
    const newRange = { start, end };
    setCurrentDateRange(newRange);
    onDateRangeChange?.(newRange);
    setIsDatePickerOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (prismDropdownRef.current && !prismDropdownRef.current.contains(event.target as Node)) {
        setIsPrismDropdownOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedPrism = selectedPrismId === 'all' 
    ? { id: 'all', name: 'All' }
    : prisms.find(p => p.id === selectedPrismId) || { id: 'all', name: 'All' };

  return (
    <div className="bg-[#030404] border border-white/15 flex flex-col gap-[32px] p-[16px] rounded-[22px] w-[274px] box-border">
      {/* Main Content */}
      <div className="flex flex-col gap-[32px] w-full">
        {/* Title and Total */}
        <div className="flex flex-col gap-[12px] w-full overflow-hidden">
          <p className="text-white text-[12px] font-medium leading-[14.799px]">
            Prism Collection
          </p>
          <div className="flex items-center justify-center w-full overflow-hidden">
            <p className="text-white text-center overflow-hidden">
              <span className="text-[19.732px] font-medium leading-[14.799px]">$ </span>
              <span className="text-[26.31px] font-medium leading-[14.799px]">{formatCurrency(total).split('.')[0]}</span>
              <span className="text-[29.598px] font-medium leading-[14.799px]">. </span>
              <span className="text-[19.732px] font-medium leading-[14.799px]">{formatCurrency(total).split('.')[1]}</span>
            </p>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="flex items-center justify-between w-full">
          {/* Total Deposited (Green) */}
          <div className="flex gap-[3.289px] items-center">
            <div className="bg-[#0acaa1] h-[28.776px] rounded-full w-[2.467px] shrink-0" />
            <div className="flex flex-col gap-[6.577px] items-start">
              <p className="text-[#0acaa1] leading-[14.799px] whitespace-nowrap">
                <span className="text-[9.044px] font-normal">$ </span>
                <span className="text-[12.333px] font-normal">{formatCurrency(totalCollected)}</span>
              </p>
              <p className="text-white text-[9.044px] font-medium leading-[14.799px] whitespace-nowrap">
                Total deposited
              </p>
            </div>
          </div>

          {/* Total Dispatched (Yellow) */}
          <div className="flex gap-[3.289px] items-center">
            <div className="bg-[#ffd905] h-[28.776px] rounded-full w-[2.467px] shrink-0" />
            <div className="flex flex-col gap-[6.577px] items-start">
              <p className="text-[#ffd905] leading-[14.799px] whitespace-nowrap">
                <span className="text-[9.044px] font-normal">$ </span>
                <span className="text-[12.333px] font-normal">{formatCurrency(totalDispatched)}</span>
              </p>
              <p className="text-white text-[9.044px] font-medium leading-[14.799px] whitespace-nowrap">
                Total dispatched
              </p>
            </div>
          </div>

          {/* Pending (Red) */}
          <div className="flex gap-[3.289px] items-center">
            <div className="bg-[#ff0509] h-[28.776px] rounded-full w-[2.467px] shrink-0" />
            <div className="flex flex-col gap-[6.577px] items-start">
              <p className="text-[#ff0509] leading-[14.799px] whitespace-nowrap">
                <span className="text-[9.044px] font-normal">$ </span>
                <span className="text-[12.333px] font-normal">{formatCurrency(pending)}</span>
              </p>
              <p className="text-white text-[9.044px] font-medium leading-[14.799px] whitespace-nowrap">
                Pending
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-start justify-between w-full">
        {/* Prism Filter */}
        <div className="flex gap-[6.577px] items-center relative" ref={prismDropdownRef}>
          <div className="border-[0.5px] border-[#66706f] flex items-center justify-center h-[38px] w-[38px] rounded-full shrink-0 overflow-hidden p-[12px]">
            <div className="flex items-center justify-center w-[14px] h-[14px]">
              <img 
                src={prismIconSmall} 
                alt="Prism icon" 
                className="block max-w-none w-full h-full"
              />
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsPrismDropdownOpen(!isPrismDropdownOpen)}
              className="flex gap-[8px] items-center cursor-pointer"
            >
              <p className="text-white text-[12.333px] font-medium leading-[14.799px]">
                {selectedPrism.name}
              </p>
              <div className="flex h-[5.755px] items-center justify-center w-[9.044px]">
                <div className="flex-none rotate-[270deg]">
                  <img 
                    alt="Chevron" 
                    src={chevronIcon}
                    className="h-[9.044px] w-[5.755px]"
                  />
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isPrismDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-[#030404] border border-white/15 rounded-lg shadow-lg z-50 min-w-[120px]">
                <button
                  onClick={() => {
                    onPrismChange?.('all');
                    setIsPrismDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-white text-sm hover:bg-white/10 ${
                    selectedPrismId === 'all' ? 'bg-white/10' : ''
                  }`}
                >
                  All
                </button>
                {prisms.map((prism) => (
                  <button
                    key={prism.id}
                    onClick={() => {
                      onPrismChange?.(prism.id);
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
        </div>

        {/* Date Range Filter */}
        <div className="relative" ref={datePickerRef}>
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="border-[0.5px] border-[#66706f] flex items-center justify-center gap-[6px] h-[38px] p-[12px] rounded-full shrink-0"
          >
            <img 
              src={calendarIcon}
              alt="Calendar icon"
              className="w-[14px] h-[14px]"
            />
            <p className="text-white text-[13px] font-normal leading-normal text-center">
              {formatDateRange(currentDateRange.start, currentDateRange.end)}
            </p>
          </button>

          {/* Date Picker Dropdown */}
          {isDatePickerOpen && (
            <div className="absolute top-full right-0 mt-2 bg-[#030404] border border-white/15 rounded-lg shadow-lg z-50 p-4 min-w-[280px]">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-white text-xs">Start Date</label>
                  <input
                    type="date"
                    value={currentDateRange.start.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newStart = new Date(e.target.value);
                      if (newStart <= currentDateRange.end) {
                        handleDateRangeChange(newStart, currentDateRange.end);
                      }
                    }}
                    className="bg-[#292e2d] border border-white/15 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-xs">End Date</label>
                  <input
                    type="date"
                    value={currentDateRange.end.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newEnd = new Date(e.target.value);
                      if (newEnd >= currentDateRange.start) {
                        handleDateRangeChange(currentDateRange.start, newEnd);
                      }
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
                      handleDateRangeChange(startOfWeek, endOfWeek);
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
                      handleDateRangeChange(startOfMonth, endOfMonth);
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
      </div>
    </div>
  );
}

