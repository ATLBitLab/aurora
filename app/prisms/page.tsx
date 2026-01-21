'use client';

import { useState, useEffect } from 'react';
import PrismCard from '@/app/components/PrismCard';
import PrismHeadingCard from '@/app/components/PrismHeadingCard';
import PrismFilters from '@/app/components/PrismFilters';

interface Contact {
  id: string;
  firstName: string | null;
  lastName: string | null;
  screenName: string | null;
  email: string | null;
}

interface Prism {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  splits?: Array<{
    percentage: number | string;
    paymentDestination: {
      contact: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        screenName: string | null;
        email: string | null;
      };
    };
  }>;
}

export default function PrismsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prisms, setPrisms] = useState<Prism[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredPrisms, setFilteredPrisms] = useState<Prism[]>([]);
  const [filters, setFilters] = useState<{
    dateRange: { start: Date | null; end: Date | null };
    drafts: boolean;
    userId: string | 'all';
    prismId: string | 'all';
    paymentMode: string | 'all';
  }>({
    dateRange: { start: null, end: null },
    drafts: false,
    userId: 'all',
    prismId: 'all',
    paymentMode: 'all',
  });

  useEffect(() => {
    fetchPrisms();
    fetchContacts();
  }, []);

  const fetchPrisms = async () => {
    try {
      const response = await fetch('/api/prisms');
      if (!response.ok) {
        throw new Error('Failed to fetch prisms');
      }
      const data = await response.json();
      // Fetch detailed data for each prism to get member count
      const prismsWithDetails = await Promise.all(
        data.map(async (prism: Prism) => {
          try {
            const detailResponse = await fetch(`/api/prisms/${prism.id}`);
            if (detailResponse.ok) {
              return await detailResponse.json();
            }
            return prism;
          } catch {
            return prism;
          }
        })
      );
      setPrisms(prismsWithDetails);
      setFilteredPrisms(prismsWithDetails);
    } catch (err) {
      console.error('Error fetching prisms:', err);
      setError('Failed to load prisms');
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };

  // Apply filters when filters or prisms change
  useEffect(() => {
    let filtered = [...prisms];

    // Date filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(prism => {
        const prismDate = new Date(prism.createdAt);
        if (filters.dateRange.start && prismDate < filters.dateRange.start) return false;
        if (filters.dateRange.end && prismDate > filters.dateRange.end) return false;
        return true;
      });
    }

    // Drafts filter (assuming drafts are prisms with active: false)
    if (filters.drafts) {
      filtered = filtered.filter(prism => !prism.active);
    }

    // User filter (filter by contacts in splits)
    if (filters.userId !== 'all') {
      filtered = filtered.filter(prism => {
        if (!prism.splits) return false;
        return prism.splits.some(split => 
          split.paymentDestination.contact.id === filters.userId
        );
      });
    }

    // Prism filter
    if (filters.prismId !== 'all') {
      filtered = filtered.filter(prism => prism.id === filters.prismId);
    }

    // Payment mode filter (this would need to be implemented based on actual payment data)
    // For now, we'll skip this filter as we don't have payment mode data in the prism model

    setFilteredPrisms(filtered);
  }, [filters, prisms]);

  // Calculate member count from splits
  const getMemberCount = (prism: Prism): number => {
    if (!prism.splits) return 0;
    const uniqueContacts = new Set(
      prism.splits.map(split => split.paymentDestination.contact.id)
    );
    return uniqueContacts.size;
  };

  // Get primary account holder (contact with highest percentage, or first one)
  const getPrimaryAccount = (prism: Prism): Contact | null => {
    if (!prism.splits || prism.splits.length === 0) return null;
    
    // Sort by percentage (descending) and get the first one
    const sortedSplits = [...prism.splits].sort((a, b) => {
      const aPct = typeof a.percentage === 'string' ? parseFloat(a.percentage) : Number(a.percentage);
      const bPct = typeof b.percentage === 'string' ? parseFloat(b.percentage) : Number(b.percentage);
      return bPct - aPct;
    });
    
    return sortedSplits[0].paymentDestination.contact;
  };

  // Extract category from description or return null
  const getCategory = (prism: Prism): string | null => {
    // For now, return null. In the future, this could be extracted from description or metadata
    return null;
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-[1136px] mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#030404] rounded w-1/4 mb-8 sm:mb-10"></div>
            <div className="h-[38px] bg-[#030404] rounded w-1/4 mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-full max-w-[313px] h-[320px] bg-[#030404] rounded-[12px] mx-auto sm:mx-0"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-[1136px] mx-auto">
        {/* Page Title */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-[32px] font-medium leading-[18px] text-white">Prisms</h1>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-800 rounded-lg p-4 mb-6 sm:mb-8">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {prisms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No prisms found.</p>
            <p className="text-gray-500 text-sm mt-2">
              Create your first prism to get started.
            </p>
          </div>
        ) : (
          <>
            {/* All Prisms Section */}
            <div className="mb-6 sm:mb-8">
              <PrismHeadingCard title="All Prisms" />
            </div>

            {/* Filters */}
            <div className="mb-6 sm:mb-8">
              <PrismFilters
                contacts={contacts}
                prisms={prisms.map(p => ({ id: p.id, name: p.name }))}
                onFilterChange={setFilters}
              />
            </div>

            {/* Prism Cards */}
            {filteredPrisms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No prisms match the selected filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-6 justify-items-start auto-rows-[320px]">
                {filteredPrisms.map((prism) => (
                  <PrismCard
                    key={prism.id}
                    id={prism.id}
                    name={prism.name}
                    createdAt={prism.createdAt}
                    active={prism.active}
                    totalDeposited={0} // TODO: Calculate from actual transaction data
                    memberCount={getMemberCount(prism)}
                    category={getCategory(prism)}
                    primaryAccount={getPrimaryAccount(prism)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 