'use client';

import Link from 'next/link';

const defaultBackground = 'https://www.figma.com/api/mcp/asset/ec6a8480-973a-4af5-9dff-07703330130f';
const eyeIcon = 'https://www.figma.com/api/mcp/asset/f0079a08-188f-4220-9ed7-13b55032f84b';
const activeDot = 'https://www.figma.com/api/mcp/asset/4e967eae-b5c4-4ac3-b9a2-5f34c5206e9b';
const boltIcon = 'https://www.figma.com/api/mcp/asset/a267a0c2-a136-4748-be4b-1bf53d5711d4';

interface PrismFaceCardProps {
  id: string;
  name: string;
  thumbnail?: string | null;
  createdAt?: string | Date;
  newTransactions?: number;
  memberCount?: number;
  totalAmount?: number | string;
}

export default function PrismFaceCard({
  id,
  name,
  thumbnail,
  createdAt,
  newTransactions = 0,
  memberCount = 0,
  totalAmount = '$0',
}: PrismFaceCardProps) {
  // Format the date to show relative time (e.g., "1 year ago")
  const formatRelativeTime = (date: string | Date | undefined): string => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) return 'Today';
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInDays / 365)} year${Math.floor(diffInDays / 365) > 1 ? 's' : ''} ago`;
  };

  const relativeTime = formatRelativeTime(createdAt);
  
  // Default thumbnail - using a placeholder or the provided thumbnail
  const backgroundImage = thumbnail || defaultBackground;

  return (
    <Link href={`/prisms/${id}`} className="block">
      <div className="relative w-[188px] h-[215px] rounded-[12px] overflow-hidden border border-white/25 hover:border-white/40 transition-colors cursor-pointer">
        {/* Background Image */}
        <img
          src={backgroundImage}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none rounded-[12px]"
        />
        
        {/* Top-left Badge with Eye Icon and Time */}
        {relativeTime && (
          <div className="absolute top-0 left-0 flex items-center gap-[3px] p-[8px] rounded-tl-[12px] rounded-br-[12px] bg-black/40 backdrop-blur-[11.6px]">
            <div className="relative shrink-0 w-[12px] h-[12px]">
              <div className="absolute inset-[21.63%_12.34%]">
                <div className="absolute inset-[-7.34%_-5.53%]">
                  <img src={eyeIcon} alt="Eye icon" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
            <p className="text-white text-[8px] font-medium leading-[14px] whitespace-nowrap">
              {relativeTime}
            </p>
          </div>
        )}

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-[95px] bg-gradient-to-t from-[#030404] from-[17.903%] to-[rgba(55,63,62,0)] to-[252.28%] backdrop-blur-[10px] rounded-[12px] p-3 flex flex-col gap-8">
          {/* Title and Transaction Indicator */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center">
              <p className="text-white text-[14px] font-medium leading-[14px] text-center">
                {name}
              </p>
            </div>
            
            {newTransactions > 0 && (
              <div className="flex items-center gap-1">
                <img src={activeDot} alt="" className="w-1 h-1 shrink-0" />
                <p className="text-[#00ffc8] text-[11px] font-medium leading-[14px]">
                  {newTransactions} new Transaction{newTransactions > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Row: Members and Amount */}
          <div className="flex items-center justify-between w-full">
            {/* Members Count */}
            <div className="flex items-center justify-center">
              <p className="text-white text-center">
                <span className="text-[12px] font-medium leading-[11.2px]">{memberCount} </span>
                <span className="text-[11px] font-medium leading-[11.2px]">Members</span>
              </p>
            </div>

            {/* Amount with Lightning Icon */}
            <div className="flex items-center gap-1">
              <div className="flex items-end">
                <div className="w-[8px] h-[8.176px] relative">
                  <div className="absolute inset-[-6.12%_-6.25%]">
                    <img src={boltIcon} alt="" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
              <p className="text-white text-[15px] font-semibold leading-[11.2px] text-center">
                {typeof totalAmount === 'number' ? `$${totalAmount.toLocaleString()}` : totalAmount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

