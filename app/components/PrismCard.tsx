'use client';

import Link from 'next/link';

const backgroundImage = "https://www.figma.com/api/mcp/asset/72b8d852-b32d-4ef9-8172-702438e2ed8e";
const eyeIcon = "https://www.figma.com/api/mcp/asset/62285819-7cca-4389-853d-b265d2b380ab";
const activeDotIcon = "https://www.figma.com/api/mcp/asset/03c77357-b591-4692-a64b-5e9f7bd4664a";
const icon1 = "https://www.figma.com/api/mcp/asset/20e39bbb-9ca1-4674-9d21-a8b96abb2207";
const icon2 = "https://www.figma.com/api/mcp/asset/f56321b8-5a73-41f8-8107-334aad1f1b50";
const icon3 = "https://www.figma.com/api/mcp/asset/c75d0b2d-d6f4-4358-864b-d042460e4e23";
const avatarMask = "https://www.figma.com/api/mcp/asset/b5173cd2-f68a-4d0f-a434-5ed8a91de376";
const defaultAvatar = "https://www.figma.com/api/mcp/asset/75fef49e-9d96-4ddd-8b5f-d484c4c78024";

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

  const cardBackgroundImage = thumbnail || backgroundImage;
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

  return (
    <Link href={`/prisms/${id}`} className="block">
      <div className="relative w-full max-w-[313px] min-h-[320px] h-[320px] rounded-[12px] overflow-hidden border border-white/25 bg-[#0a0f0e] shadow-[0_0_0_1px_rgba(255,255,255,0.12)] hover:border-white/40 transition-colors cursor-pointer">
        {/* Background Image */}
        <img
          src={cardBackgroundImage}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none rounded-[12px]"
        />

        {/* Top Section */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="backdrop-blur-[11.6px] bg-black/60 rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] p-2 flex flex-col gap-4 w-full">
            {/* Date Row */}
            {formattedDate && (
              <div className="flex items-center gap-[3px] px-1">
                <div className="w-[14px] h-[14px] shrink-0 relative">
                  <div className="absolute inset-[21.61%_12.35%_21.64%_12.34%]">
                    <div className="absolute inset-[-7.34%_-5.53%]">
                      <img src={eyeIcon} alt="Eye icon" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
                <p className="text-white text-[11px] font-medium leading-[14px] whitespace-nowrap">
                  {formattedDate}
                </p>
              </div>
            )}

            {/* Title and Status Row */}
            <div className="flex items-center gap-3 h-[14px] px-1">
              <div className="flex items-center justify-center">
                <p className="text-white text-[18px] font-medium leading-[14px] text-center">
                  {name}
                </p>
              </div>
              {active && (
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 shrink-0">
                    <img src={activeDotIcon} alt="Active" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[#00ffc8] text-[11px] font-medium leading-[14px]">
                    Active
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 from-[17.903%] to-[rgba(102,102,102,0)] to-[252.28%] backdrop-blur-[10.55px] rounded-[12px] p-3 flex flex-col gap-4">
          {/* Amount and Icons Row */}
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-2 items-start justify-center">
              <div className="flex items-center justify-center">
                <p className="text-white text-[32px] font-bold leading-[14px]">
                  {formattedAmount}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-[#838383] text-[10px] font-medium leading-[14px]">
                  Total deposited
                </p>
              </div>
            </div>
            <div className="flex gap-2 h-[41px] items-center">
              <div className="h-[27px] w-[25.951px] shrink-0">
                <img src={icon1} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="h-[27.898px] w-[27.881px] shrink-0">
                <img src={icon2} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="flex h-[25.358px] items-center justify-center w-[16.664px]">
                <div className="flex-none rotate-90">
                  <div className="h-[16.664px] w-[25.358px]">
                    <img src={icon3} alt="" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Badges and Primary Account */}
          <div className="flex items-center justify-between w-full">
            {/* Badges */}
            <div className="flex items-center gap-[7px]">
              <div className="border-[0.5px] border-white flex items-center justify-center p-[10px] rounded-full shrink-0">
                <p className="text-white text-[11px] font-medium leading-[11.2px] text-center">
                  {memberCount} Members
                </p>
              </div>
              {category && (
                <div className="border-[0.5px] border-white flex items-center justify-center p-[10px] rounded-full shrink-0">
                  <p className="text-white text-[11px] font-medium leading-[11.2px] text-center">
                    {category}
                  </p>
                </div>
              )}
            </div>

            {/* Primary Account */}
            <div className="flex gap-2 items-center p-1 rounded-[12px]">
              <div className="relative rounded-full shrink-0 w-[28px] h-[28px] overflow-clip">
                <img
                  src={defaultAvatar}
                  alt={getPrimaryAccountName()}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 items-start">
                <p className="text-white text-[11px] font-medium leading-[14px] whitespace-nowrap">
                  {getPrimaryAccountName()}
                </p>
                <p className="text-white/50 text-[11px] font-medium leading-[14px] whitespace-nowrap">
                  Primary Account
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

