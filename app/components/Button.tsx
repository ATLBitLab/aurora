'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = {
  showIcon?: boolean;
  text?: string;
  style?: 'Primary' | 'Secondary';
  icon?: ReactNode;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  className?: string;
  disabled?: boolean;
};

export default function Button({
  showIcon = true,
  text = 'Click Here',
  style = 'Primary',
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

  if (style === 'Secondary') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'border border-[#5f5f5f] relative rounded-full',
          'bg-gradient-radial from-[#0a0a0a] via-[#171616] to-[#363535]',
          'hover:opacity-90 transition-opacity',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        style={{
          backgroundImage: `radial-gradient(ellipse at top right, rgba(10,10,10,1) 0%, rgba(23,22,22,1) 30.77%, rgba(36,35,35,1) 61.54%, rgba(54,53,53,1) 100%)`,
        }}
      >
        <div className="box-border content-center flex flex-wrap gap-1 items-center justify-center overflow-clip px-4 py-3 relative rounded-[inherit]">
          {iconElement}
          <span className="font-normal leading-[18px] relative shrink-0 text-xs text-center text-nowrap text-white whitespace-pre">
            {text}
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'border border-[#0acaa1] relative rounded-full',
        'hover:opacity-90 transition-opacity',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      style={{
        borderWidth: '3px',
        backgroundImage: `radial-gradient(ellipse at top right, rgba(10,10,10,1) 0%, rgba(23,22,22,1) 30.77%, rgba(36,35,35,1) 61.54%, rgba(54,53,53,1) 100%)`,
      }}
    >
      <div className="box-border content-center flex flex-wrap gap-1 items-center justify-center overflow-clip p-4 relative rounded-[inherit]">
        {iconElement}
        <span className="font-medium leading-[18px] relative shrink-0 text-[13px] text-center text-nowrap text-white whitespace-pre">
          {text}
        </span>
      </div>
    </button>
  );
}

