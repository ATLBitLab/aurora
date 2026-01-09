'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PencilIcon, ArrowUpTrayIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  firstName: string | null;
  lastName: string | null;
  screenName: string | null;
  email: string | null;
  nostrPubkey: string | null;
  metadata: Record<string, unknown> | null;
}

interface SharedPrism {
  id: string;
  name: string;
  slug: string;
  thumbnail?: string | null; // Profile image/thumbnail URL
}

interface Tag {
  text: string;
  color?: string; // Hex color code
}

interface ContactCardProps {
  contact: Contact;
  variant?: 'open' | 'close';
}

export default function ContactCard({ contact, variant = 'open' }: ContactCardProps) {
  // Match Figma variants:
  // - "open": details panel expanded by default
  // - "close": compact card with no details panel
  const [isOpen, setIsOpen] = useState(variant === 'open');
  const [sharedPrisms, setSharedPrisms] = useState<SharedPrism[]>([]);
  const [detailsCount, setDetailsCount] = useState<number>(0);

  // Fetch shared prisms for this contact
  useEffect(() => {
    const fetchSharedPrisms = async () => {
      try {
        const response = await fetch(`/api/contacts/${contact.id}/shared-prisms`);
        if (response.ok) {
          const data = await response.json();
          setSharedPrisms(data.prisms || []);
        }
      } catch (err) {
        console.error('Error fetching shared prisms:', err);
        setSharedPrisms([]);
      }
    };

    fetchSharedPrisms();
  }, [contact.id]);

  // Calculate details count
  useEffect(() => {
    let count = 0;
    if (contact.email) count++;
    if (contact.nostrPubkey) count++;
    const metadata = contact.metadata && typeof contact.metadata === 'object' ? contact.metadata : {};
    if (metadata.telegram) count++;
    if (metadata.twitter) count++;
    if (metadata.github) count++;
    setDetailsCount(count);
  }, [contact]);

  const displayName = contact.firstName && contact.lastName
    ? `${contact.firstName} ${contact.lastName}`
    : contact.screenName || 'Unnamed Contact';

  const initials = contact.firstName && contact.lastName
    ? `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()
    : contact.screenName
    ? contact.screenName[0].toUpperCase()
    : '?';

  const metadata = contact.metadata && typeof contact.metadata === 'object' ? contact.metadata : {};
  const telegram = typeof metadata.telegram === 'string' ? metadata.telegram : null;
  const twitter = typeof metadata.twitter === 'string' ? metadata.twitter : null;
  const github = typeof metadata.github === 'string' ? metadata.github : null;
  
  // Extract tags from metadata with color support
  const tags: Tag[] = [];
  
  // Support tags as array of objects with text and color
  if (Array.isArray(metadata.tags)) {
    metadata.tags.forEach((tag: unknown) => {
      if (typeof tag === 'string') {
        tags.push({ text: tag });
      } else if (typeof tag === 'object' && tag !== null && 'text' in tag) {
        tags.push({
          text: String(tag.text),
          color: 'color' in tag ? String(tag.color) : undefined,
        });
      }
    });
  }
  
  // Support interests as tags
  if (Array.isArray(metadata.interests)) {
    metadata.interests.forEach((interest: unknown) => {
      if (typeof interest === 'string') {
        tags.push({ text: interest });
      }
    });
  }
  
  // Extract tags from bio if it contains specific keywords
  if (typeof metadata.bio === 'string' && metadata.bio) {
    const bioLower = metadata.bio.toLowerCase();
    if (bioLower.includes('lightning')) {
      tags.push({ text: 'Lightning Network enthusiast', color: '#8a05ff' });
    }
    if (bioLower.includes('conference') || bioLower.includes('bitcoin')) {
      tags.push({ text: 'bitcoin Conference 2023', color: '#345204' });
    }
  }
  
  // Format screen name display
  const screenNameDisplay = contact.screenName 
    ? `${contact.firstName || contact.screenName}@${contact.screenName}`
    : contact.email || '';

  const toggleDetails = () => {
    setIsOpen(!isOpen);
  };

  const handleShareProfile = async () => {
    try {
      // Create a shareable link or copy to clipboard
      const profileUrl = `${window.location.origin}/contacts/${contact.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `${displayName}'s Profile`,
          text: `Check out ${displayName}'s contact profile`,
          url: profileUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(profileUrl);
        alert('Profile link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing profile:', err);
    }
  };

  const handleCopyAddress = async () => {
    const address = contact.nostrPubkey || contact.email || screenNameDisplay;
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        // Could show a toast notification here
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // Default tag colors if not specified
  const getTagColor = (index: number, tag: Tag): string => {
    if (tag.color) return tag.color;
    // Default colors: purple, green, blue, orange, etc.
    const defaultColors = ['#8a05ff', '#345204', '#0066cc', '#ff6600', '#cc0066'];
    return defaultColors[index % defaultColors.length];
  };

  // Get remaining prism count (after showing first 3)
  const prismCount = sharedPrisms.length;
  const remainingPrismCount = prismCount > 3 ? prismCount - 3 : 0;
  const visiblePrisms = sharedPrisms.slice(0, 3);

  // Only show the details section for the "open" variant
  const showDetailsSection = variant === 'open';

  return (
    <div className="bg-[#030404] flex flex-col gap-8 items-center min-w-[260px] overflow-hidden p-3 rounded-2xl w-full">
      {/* Header with Shared Prisms and CTAs */}
      <div className="flex items-center justify-between w-full">
        {/* Shared Prisms with Thumbnails */}
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <div className="flex items-center -mr-2">
            {/* Show up to 3 prism thumbnails */}
            {visiblePrisms.map((prism) => (
              <div 
                key={prism.id} 
                className="w-[27px] h-[27px] relative shrink-0 -ml-[10px] first:ml-0 rounded-full overflow-hidden border border-gray-700"
              >
                {prism.thumbnail ? (
                  <img 
                    src={prism.thumbnail} 
                    alt={prism.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to blank if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  // Blank thumbnail if no profile set
                  <div className="w-full h-full bg-gray-800" />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-0.5 ml-1 min-w-0">
            <p className="text-white text-[8px] font-medium leading-[8px] whitespace-nowrap">
              +{prismCount}
            </p>
            <p className="text-white text-[8px] font-medium leading-[8px] whitespace-nowrap">
              prism
            </p>
          </div>
        </div>

        {/* CTA Buttons: Edit Profile and Share Profile */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Link
            href={`/contacts/${contact.id}/edit`}
            className="w-[22px] h-[22px] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Edit Profile"
            title="Edit Profile"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={handleShareProfile}
            className="w-[22px] h-[22px] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Share Profile"
            title="Share Profile"
          >
            <ArrowUpTrayIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-3 items-start w-full">
        {/* Avatar and Name Section */}
        <div className="flex flex-col items-center w-full gap-2">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold text-lg relative overflow-hidden shrink-0">
            {initials}
            {/* Placeholder for avatar image if available */}
          </div>

          {/* Name and Screen Name */}
          <div className="flex flex-col gap-0.5 items-center w-full">
            <p className="text-white text-xl font-medium leading-5 text-center w-full">
              {displayName}
            </p>
            <div className="flex items-center justify-center gap-2 w-full min-w-0">
              <a
                href={contact.email ? `mailto:${contact.email}` : '#'}
                className="text-[#616161] text-[15px] leading-4 cursor-pointer hover:text-gray-400 transition-colors truncate max-w-[200px] text-center"
              >
                {screenNameDisplay}
              </a>
              <button
                onClick={handleCopyAddress}
                className="h-[22px] w-[22px] flex items-center justify-center shrink-0 text-gray-400 hover:text-white transition-colors"
                aria-label="Copy address"
                title="Copy address"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Details Section */}
        {showDetailsSection && (
          <div className="bg-[#292e2d] flex flex-col items-start p-2 rounded-xl w-full">
            <button
              onClick={toggleDetails}
              className="flex items-center justify-between w-full cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <p className="text-white text-xs font-medium leading-4">Details</p>
                {detailsCount > 0 && (
                  <div className="bg-[#030404] flex items-center justify-center p-1 rounded-full w-4 h-4">
                    <p className="text-white text-[8px] font-medium leading-4 text-center w-full">
                      {detailsCount}
                    </p>
                  </div>
                )}
              </div>
              <ChevronUpIcon className={cn("w-3 h-3 text-gray-400 transition-transform", !isOpen && "rotate-180")} />
            </button>

            {/* Expanded Details */}
            {isOpen && (
              <div className="flex flex-col gap-2 items-start w-full mt-2">
                {contact.email && (
                  <div className="flex items-center justify-between w-full">
                    <p className="text-[#616161] text-[11px] font-medium leading-4">Email</p>
                    <p className="text-white text-[11px] font-medium leading-4 truncate max-w-[140px] text-right">
                      {contact.email}
                    </p>
                  </div>
                )}
                
                {contact.nostrPubkey && (
                  <div className="flex items-center justify-between w-full">
                    <p className="text-[#616161] text-[11px] font-medium leading-4">Nostr</p>
                    <p className="text-white text-[11px] font-medium leading-4 font-mono truncate max-w-[140px] text-right">
                      {contact.nostrPubkey.slice(0, 20)}...
                    </p>
                  </div>
                )}

                {telegram && (
                  <div className="flex items-center justify-between w-full">
                    <p className="text-[#616161] text-[11px] font-medium leading-4">Telegram</p>
                    <p className="text-white text-[11px] font-medium leading-4 truncate max-w-[140px] text-right">
                      {telegram}
                    </p>
                  </div>
                )}

                {twitter && (
                  <div className="flex items-center justify-between w-full">
                    <p className="text-[#616161] text-[11px] font-medium leading-4">Twitter</p>
                    <p className="text-white text-[11px] font-medium leading-4 truncate max-w-[140px] text-right">
                      {twitter}
                    </p>
                  </div>
                )}

                {github && (
                  <div className="flex items-center justify-between w-full">
                    <p className="text-[#616161] text-[11px] font-medium leading-4">Github</p>
                    <p className="text-white text-[11px] font-medium leading-4 truncate max-w-[140px] text-right">
                      {github}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tags Section with Varied Colors */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center w-full">
            {tags.map((tag, index) => {
              const tagColor = getTagColor(index, tag);
              return (
                <div
                  key={index}
                  className="flex items-center justify-center px-2.5 py-2 rounded-[20px] shrink-0"
                  style={{ backgroundColor: tagColor }}
                >
                  <p className="text-white text-[8px] font-medium leading-2 text-center whitespace-pre-wrap">
                    {tag.text}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
