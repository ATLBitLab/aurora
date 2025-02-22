'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import NostrLogin from './NostrLogin';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Prisms', href: '/prisms' },
    { label: 'Contacts', href: '/contacts' },
    { label: 'Node Info', href: '/node' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
              Aurora
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-gray-300 hover:text-white transition-colors",
                  isActive(item.href) && "text-purple-400 hover:text-purple-300"
                )}
              >
                {item.label}
              </Link>
            ))}
            <NostrLogin />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'md:hidden fixed inset-0 top-16 bg-gray-900 transform transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex flex-col p-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "py-2 text-gray-300 hover:text-white transition-colors",
                isActive(item.href) && "text-purple-400 hover:text-purple-300"
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="py-2">
            <NostrLogin />
          </div>
        </nav>
      </div>
    </header>
  );
} 