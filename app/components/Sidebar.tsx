'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Receipt, 
  Users,
  Network,
  Gem,
  ChevronLeft
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  notificationCount?: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notificationCounts, setNotificationCounts] = useState<{
    dashboard?: number;
    prisms?: number;
  }>({});

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  // Fetch notification counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch prisms count
        const prismsResponse = await fetch('/api/prisms');
        if (prismsResponse.ok) {
          const prismsData = await prismsResponse.json();
          const prismsCount = Array.isArray(prismsData) ? prismsData.length : 0;
          setNotificationCounts(prev => ({ ...prev, prisms: prismsCount }));
        }
      } catch (error) {
        console.error('Error fetching notification counts:', error);
      }
    };

    fetchCounts();
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard, notificationCount: notificationCounts.dashboard },
    { label: 'Prisms', href: '/prisms', icon: Gem, notificationCount: notificationCounts.prisms },
    { label: 'Contacts', href: '/contacts', icon: Users },
    { label: 'Node Info', href: '/node', icon: Network },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div 
      className={cn(
        'bg-[#0f1514] flex flex-col items-start h-full shrink-0 transition-all duration-300 relative',
        isCollapsed 
          ? 'w-[72px] px-2 py-4 overflow-visible' 
          : 'w-[207px] pl-0 pr-2 py-4 overflow-visible'
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        'flex items-center justify-center mb-8 w-full transition-all',
        isCollapsed ? 'gap-0 justify-center' : 'gap-3'
      )}>
        <div className="flex items-center justify-center relative rounded-[38px] shrink-0 w-[38px] h-[38px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-green-500 rounded-[38px]" />
        </div>
        {!isCollapsed && (
          <p className="font-['Inter',sans-serif] font-medium leading-[14px] text-[32px] text-white whitespace-nowrap">
            Aurora
          </p>
        )}
      </div>

      {/* Collapse Toggle Button - Floating */}
      <button
        onClick={toggleCollapse}
        className={cn(
          'absolute top-4 z-[99999] bg-[#0f1514] border border-[#07daae] rounded-full p-1 flex items-center justify-center transition-all hover:bg-[#1a2524] hover:border-[#00ffc8] shadow-lg hover:shadow-xl',
          isCollapsed ? '-right-3' : '-right-3',
          'transform hover:scale-110'
        )}
        style={{
          boxShadow: '0 2px 8px rgba(7, 218, 174, 0.3)',
          zIndex: 99999
        }}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft className={cn(
          'w-3 h-3 text-[#00ffc8] transition-transform',
          isCollapsed && 'rotate-180'
        )} />
      </button>

      {/* Navigation Items */}
      <div className="flex flex-col gap-6 items-start w-full">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-start w-full group',
                isCollapsed ? 'gap-0 justify-center' : 'gap-2'
              )}
            >
              {/* Active Indicator Bar */}
              {!isCollapsed && (
                <div className="flex items-center relative self-stretch shrink-0">
                  <div
                    className={cn(
                      'h-[42px] rounded-br-[4px] rounded-tr-[4px] w-[5px] shrink-0 transition-colors',
                      active ? 'bg-[#00ffc8]' : 'bg-transparent'
                    )}
                  />
                </div>
              )}

              {/* Navigation Button */}
              <div
                className={cn(
                  'flex items-center py-1 relative rounded-full shrink-0 transition-all',
                  active
                    ? 'border-[3px] border-[#07daae]'
                    : 'hover:bg-black/20',
                  isCollapsed 
                    ? 'w-full justify-center px-2' 
                    : 'pl-2 pr-3 gap-[18px] w-[186px] justify-between'
                )}
              >
                {isCollapsed ? (
                  <>
                    {/* Collapsed: Just icon and badge */}
                    <div className="flex items-center justify-center relative shrink-0">
                      <div
                        className={cn(
                          'flex items-center justify-center relative shrink-0',
                          active ? 'w-[36px] h-[38px]' : 'w-[36px] h-[36px]'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-4 h-4 shrink-0',
                            active ? 'text-[#00ffc8]' : 'text-white'
                          )}
                        />
                      </div>
                      {item.notificationCount && item.notificationCount > 0 && (
                        <div className="absolute -top-0.5 -right-0.5 bg-red-500 flex items-center justify-center rounded-full shrink-0 w-[16px] h-[16px]">
                          <p className="font-['Inter',sans-serif] font-extrabold leading-[16px] text-[10px] text-white">
                            {item.notificationCount > 9 ? '9+' : item.notificationCount}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center relative shrink-0 w-[132px]">
                      {/* Icon Container */}
                      <div className="flex items-center justify-between relative shrink-0 w-[39px]">
                        <div
                          className={cn(
                            'flex items-center justify-center p-[10px] relative shrink-0 w-[36px]',
                            active ? 'h-[38px]' : 'h-[36px]'
                          )}
                        >
                          <Icon
                            className={cn(
                              'w-4 h-4 shrink-0',
                              active ? 'text-[#00ffc8]' : 'text-white'
                            )}
                          />
                        </div>
                      </div>

                      {/* Label */}
                      <p
                        className={cn(
                          "font-['Inter',sans-serif] font-normal leading-[14px] text-[15px] relative shrink-0 whitespace-nowrap",
                          active ? 'text-[#00ffc8]' : 'text-white'
                        )}
                      >
                        {item.label}
                      </p>
                    </div>

                    {/* Notification Badge */}
                    {item.notificationCount && item.notificationCount > 0 && (
                      <div className="bg-red-500 flex items-center justify-center rounded-full shrink-0 w-[20px] h-[20px] min-w-[20px]">
                        <p className="font-['Inter',sans-serif] font-extrabold leading-[20px] text-[10px] text-white">
                          {item.notificationCount > 9 ? '9+' : item.notificationCount}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}

