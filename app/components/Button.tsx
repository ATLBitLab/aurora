'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = {
  showIcon?: boolean;
  text?: string;
  style?: 'Primary' | 'Secondary'; // consumed as _style to satisfy lint; reserved for future use
  icon?: ReactNode;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  className?: string;
  disabled?: boolean;
};

export default function Button({
  showIcon = true,
  text = 'Click Here',
  style: _style = 'Primary',
  icon,
  onClick,
  type = 'button',
  className,
  disabled = false,
}: ButtonProps) {
  const defaultIcon = (
    <div className="relative shrink-0 size-2">
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block max-w-none size-full"
      >
        <path
          d="M4 0L4.70711 2.29289L7 3L4.70711 3.70711L4 6L3.29289 3.70711L1 3L3.29289 2.29289L4 0Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );

  const iconElement = showIcon && (icon || defaultIcon);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'border-[0.5px] border-[#66706f] bg-[#030404] relative rounded-full',
        'hover:border-white/50 transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      <div className="box-border content-center flex flex-wrap gap-1 items-center justify-center overflow-clip px-4 py-3 relative rounded-[inherit]">
        {iconElement}
        <span className="font-normal leading-[18px] relative shrink-0 text-[12px] text-center text-nowrap text-white whitespace-pre">
          {text}
        </span>
      </div>
    </button>
  );
}

