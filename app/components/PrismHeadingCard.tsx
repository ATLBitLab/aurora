'use client';

const prismIconSmall = "https://www.figma.com/api/mcp/asset/10137fb3-e968-48ed-b94b-6b237e0523c2";

interface PrismHeadingCardProps {
  title?: string;
}

export default function PrismHeadingCard({ title = 'Hot Prisms' }: PrismHeadingCardProps) {
  return (
    <div className="flex items-center gap-[11px] px-1 py-0 w-full">
      {/* Circular Icon Button */}
      <div className="border-[0.5px] border-[#66706f] flex items-center justify-center h-[38px] w-[38px] rounded-full shrink-0 overflow-hidden">
        <div className="flex items-center justify-center p-[10px] w-[14px] h-[14px]">
          <img 
            src={prismIconSmall} 
            alt="Prism icon" 
            className="block max-w-none w-full h-full"
          />
        </div>
      </div>
      
      {/* Title Text */}
      <div className="flex items-center justify-center">
        <p className="text-white text-[18px] font-medium leading-[18px] text-center">
          {title}
        </p>
      </div>
    </div>
  );
}

