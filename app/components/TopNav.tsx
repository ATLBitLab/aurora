'use client';

import { useNostr } from '../contexts/NostrContext';
import { Search, Bell, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function TopNav() {
  const { publicKey, npub, logout } = useNostr();
  const router = useRouter();

  // Format npub for display (shortened version)
  const displayNpub = npub ? `${npub.slice(0, 8)}...${npub.slice(-8)}` : 'Not connected';

  // Get user name from npub or use a default
  const displayName = publicKey ? displayNpub : 'Guest User';

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleGeneratePrism = () => {
    router.push('/prisms/new');
  };

  return (
    <nav className="flex items-center justify-center gap-4 px-6 py-3 h-[66px] shrink-0 w-full">
      {/* User Profile Section */}
      <div className="flex gap-2 h-[50px] items-center p-1 rounded-xl shrink-0">
        <div className="flex items-center justify-center relative rounded-full shrink-0 w-[42px] h-[42px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-green-500 rounded-full" />
        </div>
        <div className="flex flex-col gap-2 items-start leading-[14px] relative shrink-0">
          <p className="font-['Albert_Sans',sans-serif] font-medium text-[15px] text-white whitespace-nowrap">
            {displayName}
          </p>
          <p className="opacity-50 font-['Albert_Sans',sans-serif] font-medium text-[10px] text-white whitespace-nowrap">
            Primary Account
          </p>
        </div>
        <button className="h-[25.564px] w-[17px] flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity">
          <ChevronDown className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Middle Section - Search and Actions */}
      <div className="flex gap-4 h-[50px] items-center flex-1 justify-center">
        {/* Search Bar and Buttons */}
        <div className="flex gap-4 items-center justify-center shrink-0">
          {/* Search Bar */}
          <div className="bg-[#111] flex items-center justify-between pl-[26px] pr-[32px] py-[7px] rounded-full shrink-0 w-[571px] max-w-[571px] h-[50px]">
            <div className="flex items-center justify-between relative shrink-0 w-[74px]">
              <Search className="w-3 h-3 text-white shrink-0" />
              <p className="font-['Albert_Sans',sans-serif] font-normal leading-[14px] text-[16px] text-white">
                Search
              </p>
            </div>
            <p className="font-['Albert_Sans',sans-serif] font-normal leading-[14px] text-[#8c8c8c] text-[16px]">
              Ctrl +k
            </p>
          </div>

          {/* Generator New Prism Button */}
          <button
            onClick={handleGeneratePrism}
            className="border-[3px] border-[#07daae] flex gap-1 items-center justify-center px-4 h-[50px] rounded-full shrink-0 hover:bg-[#07daae]/10 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
            <p className="font-['Poppins',sans-serif] font-normal leading-normal text-[13px] text-center text-white whitespace-nowrap">
              Generator New Prism
            </p>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="border-[0.5px] border-[#66706f] flex gap-1.5 items-center justify-center px-4 h-[50px] rounded-full shrink-0 hover:bg-black/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-white shrink-0" />
            <p className="font-['Poppins',sans-serif] font-normal leading-normal text-[13px] text-center text-white whitespace-nowrap">
              Logout
            </p>
          </button>
        </div>
      </div>

      {/* Notifications Icon */}
      <div className="flex items-center justify-center shrink-0 h-[50px]">
        <button className="flex h-[50px] w-[50px] items-center justify-center hover:opacity-70 transition-opacity">
          <Bell className="w-5 h-5 text-white" />
        </button>
      </div>
    </nav>
  );
}

