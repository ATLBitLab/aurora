'use client';

import { useState, useEffect } from 'react';
import { useNostr } from "./contexts/NostrContext";
import Button from "./components/Button";
import PrismFaceCard from "./components/PrismFaceCard";
import PrismHeadingCard from "./components/PrismHeadingCard";
import PrismInfoCard from "./components/PrismInfoCard";
import TransactionTable from "./components/TransactionTable";

interface Prism {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  splits?: Array<{
    paymentDestination: {
      contact: {
        id: string;
      };
    };
  }>;
}

interface Contact {
  id: string;
  firstName: string | null;
  lastName: string | null;
  screenName: string | null;
  email: string | null;
}

export default function Home() {
  const { publicKey, login } = useNostr();
  const [prisms, setPrisms] = useState<Prism[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrismId, setSelectedPrismId] = useState<string | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { start: startOfWeek, end: endOfWeek };
  });

  useEffect(() => {
    if (publicKey) {
      fetchPrisms();
      fetchContacts();
    }
  }, [publicKey]);

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

  const fetchPrisms = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/prisms');
      if (response.ok) {
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
      }
    } catch (err) {
      console.error('Error fetching prisms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to login with Nostr');
    }
  };

  // Calculate member count from splits
  const getMemberCount = (prism: Prism): number => {
    if (!prism.splits) return 0;
    const uniqueContacts = new Set(
      prism.splits.map(split => split.paymentDestination.contact.id)
    );
    return uniqueContacts.size;
  };

  // Calculate amounts based on selected prism and date range
  // TODO: Replace with actual API calls to get transaction data
  const calculateAmounts = () => {
    // For now, return placeholder values
    // In a real implementation, you would:
    // 1. Filter transactions by selectedPrismId and dateRange
    // 2. Calculate totalCollected, totalDispatched, and pending
    return {
      totalCollected: 412000.95,
      totalDispatched: 412000.95,
      pending: 0,
    };
  };

  const amounts = calculateAmounts();

  return (
    <main>
      {publicKey ? (
        // Logged in view
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-[1136px] mx-auto">
            {/* Welcome Section */}
            <div className="mb-8 sm:mb-12">
              <div className="flex flex-col gap-6 sm:gap-8 mb-8 sm:mb-10">
                <h1 className="text-[32px] font-medium leading-[18px] text-white">Welcome to Aurora</h1>
                <p className="text-[#b8b8b8] text-[15px] leading-[24px] max-w-[350px]">
                  Split any payment across wallets or accounts instantly, transparently, and securely.
                </p>
              </div>

              {/* Info Cards */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 mb-8 sm:mb-10">
                <PrismInfoCard
                  totalCollected={amounts.totalCollected}
                  totalDispatched={amounts.totalDispatched}
                  pending={amounts.pending}
                  prisms={prisms.map(p => ({ id: p.id, name: p.name }))}
                  selectedPrismId={selectedPrismId}
                  onPrismChange={setSelectedPrismId}
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                />
              </div>
            </div>

            {/* Hot Prisms Section */}
            <div className="mb-8 sm:mb-14">
              <div className="mb-6 sm:mb-6">
                <PrismHeadingCard />
              </div>

              {/* Prism Cards Grid */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-full max-w-[188px] h-[215px] bg-[#030404] rounded-[12px] animate-pulse mx-auto sm:mx-0"
                    />
                  ))}
                </div>
              ) : prisms.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {prisms.map((prism) => (
                    <PrismFaceCard
                      key={prism.id}
                      id={prism.id}
                      name={prism.name}
                      createdAt={prism.createdAt}
                      memberCount={getMemberCount(prism)}
                      newTransactions={0} // TODO: Calculate from actual transaction data
                      totalAmount="$0" // TODO: Calculate from actual payment data
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No prisms found.</p>
                  <p className="text-gray-500 text-sm">
                    Create your first prism to get started.
                  </p>
                </div>
              )}
            </div>

            {/* Transaction Table */}
            <div className="mt-8 sm:mt-14">
              <TransactionTable 
                prisms={prisms.map(p => ({ id: p.id, name: p.name }))}
                contacts={contacts}
              />
            </div>
          </div>
        </div>
      ) : (
        // Logged out view with aurora background
        <div className="relative min-h-[calc(100vh-4rem)]">
          {/* Abstract Aurora Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
            <div className="absolute inset-0">
              <div className="absolute inset-0 opacity-30">
                {/* Aurora-like gradients */}
                <div className="absolute top-1/4 -left-1/4 w-3/4 h-3/4 bg-purple-500 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute top-1/3 left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full blur-[96px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/3 w-1/3 h-1/3 bg-green-500 rounded-full blur-[64px] animate-pulse" style={{ animationDelay: '2s' }} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 pt-32 pb-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-green-400">
                Welcome to Aurora
              </h1>
              <p className="text-xl text-gray-300 mb-12">
                Your gateway to lightning prisms. Connect with Nostr to begin.
              </p>
              <Button
                onClick={handleLogin}
                text="Connect with Nostr"
                style="Primary"
                showIcon={false}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
