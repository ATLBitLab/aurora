'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Prism {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  createdAt: string;
}

export default function PrismsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prisms, setPrisms] = useState<Prism[]>([]);

  useEffect(() => {
    fetchPrisms();
  }, []);

  const fetchPrisms = async () => {
    try {
      const response = await fetch('/api/prisms');
      if (!response.ok) {
        throw new Error('Failed to fetch prisms');
      }
      const data = await response.json();
      setPrisms(data);
    } catch (err) {
      console.error('Error fetching prisms:', err);
      setError('Failed to load prisms');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-800 rounded"></div>
              <div className="h-20 bg-gray-800 rounded"></div>
              <div className="h-20 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Prisms</h1>
          <Link
            href="/prisms/new"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Create New Prism
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {prisms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No prisms found.</p>
              <p className="text-gray-500 text-sm mt-2">
                Create your first prism to get started.
              </p>
            </div>
          ) : (
            prisms.map((prism) => (
              <div
                key={prism.id}
                className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{prism.name}</h2>
                    <p className="text-gray-400 text-sm mt-1">/{prism.slug}</p>
                    {prism.description && (
                      <p className="text-gray-300 mt-2">{prism.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!prism.active && (
                      <span className="px-2 py-1 bg-red-900/50 text-red-300 text-xs rounded">
                        Inactive
                      </span>
                    )}
                    <Link
                      href={`/prisms/${prism.slug}`}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 