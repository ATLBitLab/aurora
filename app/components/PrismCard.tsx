'use client';

import Link from 'next/link';

interface Contact {
  id: string;
  firstName: string | null;
  lastName: string | null;
  screenName: string | null;
  email: string | null;
}

interface PrismCardProps {
  id: string;
  name: string;
  thumbnail?: string | null;
  createdAt?: string | Date;
  active?: boolean;
  totalDeposited?: number | string;
  memberCount?: number;
  category?: string | null;
  primaryAccount?: Contact | null;
}

export default function PrismCard({
  id,
  name,
  thumbnail,
  createdAt,
  active = true,
  totalDeposited = '$0',
  memberCount = 0,
  category,
  primaryAccount,
}: PrismCardProps) {
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formattedDate = formatDate(createdAt);
  const formattedAmount = typeof totalDeposited === 'number'
    ? `$${totalDeposited.toLocaleString()}`
    : totalDeposited;

  const getPrimaryAccountName = (): string => {
    if (!primaryAccount) return 'Unknown';
    if (primaryAccount.firstName && primaryAccount.lastName) {
      return `${primaryAccount.firstName} ${primaryAccount.lastName}`;
    }
    if (primaryAccount.screenName) return primaryAccount.screenName;
    if (primaryAccount.email) return primaryAccount.email;
    return 'Unknown';
  };

  const getInitials = (): string => {
    if (!primaryAccount) return '?';
    if (primaryAccount.firstName) {
      return (primaryAccount.firstName[0] + (primaryAccount.lastName?.[0] || '')).toUpperCase();
    }
    if (primaryAccount.screenName) return primaryAccount.screenName[0].toUpperCase();
    return '?';
  };

  return (
    <Link href={`/prisms/${id}`} className="block">
      <div className="relative w-full max-w-[313px] min-h-[320px] h-[320px] rounded-[12px] overflow-hidden border-2 border-white bg-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
        {/* Top Section */}
        <div className="p-4 flex flex-col gap-3 border-b border-gray-200">
          {/* Date Row */}
          {formattedDate && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <p className="text-gray-500 text-[11px] font-medium leading-[14px] whitespace-nowrap">
                {formattedDate}
              </p>
            </div>
          )}

          {/* Title and Status Row */}
          <div className="flex items-center gap-3">
            <p className="text-black text-[18px] font-semibold leading-tight">
              {name}
            </p>
            {active && (
              <div className="flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-emerald-700 text-[11px] font-medium leading-[14px]">
                  Active
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Middle Section - Amount */}
        <div className="p-4 flex-1">
          <p className="text-black text-[32px] font-bold leading-tight">
            {formattedAmount}
          </p>
          <p className="text-gray-500 text-[10px] font-medium mt-1">
            Total deposited
          </p>
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200 rounded-b-[12px] flex flex-col gap-3">
          {/* Badges */}
          <div className="flex items-center gap-2">
            <div className="border border-gray-300 flex items-center justify-center px-3 py-1.5 rounded-full shrink-0">
              <p className="text-gray-700 text-[11px] font-medium text-center">
                {memberCount} {memberCount === 1 ? 'Member' : 'Members'}
              </p>
            </div>
            {category && (
              <div className="border border-gray-300 flex items-center justify-center px-3 py-1.5 rounded-full shrink-0">
                <p className="text-gray-700 text-[11px] font-medium text-center">
                  {category}
                </p>
              </div>
            )}
          </div>

          {/* Primary Account */}
          <div className="flex gap-2 items-center">
            <div className="rounded-full shrink-0 w-[28px] h-[28px] bg-emerald-500 flex items-center justify-center">
              <span className="text-white text-[11px] font-bold">{getInitials()}</span>
            </div>
            <div className="flex flex-col">
              <p className="text-black text-[11px] font-medium leading-[14px] whitespace-nowrap">
                {getPrimaryAccountName()}
              </p>
              <p className="text-gray-400 text-[11px] font-medium leading-[14px] whitespace-nowrap">
                Primary Account
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
