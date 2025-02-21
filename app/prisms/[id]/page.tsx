'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import PrismForm, { PrismFormData } from '@/app/components/PrismForm';

interface Split {
  id: string;
  destinationId: string;
  percentage: number;
  description?: string;
  paymentDestination: {
    id: string;
    value: string;
    type: string;
    contact: {
      id: string;
      firstName?: string;
      lastName?: string;
      screenName?: string;
    };
  };
}

interface Prism {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  splits: Split[];
}

export default function PrismPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prism, setPrism] = useState<Prism | null>(null);

  useEffect(() => {
    fetchPrism();
  }, [id]);

  const fetchPrism = async () => {
    try {
      const response = await fetch(`/api/prisms/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prism');
      }
      const data = await response.json();
      setPrism(data);
    } catch (err) {
      console.error('Error fetching prism:', err);
      setError('Failed to load prism');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: PrismFormData) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/prisms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update prism');
      }

      router.push('/prisms');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-800 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!prism) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-500">Prism Not Found</h1>
            <p className="text-gray-400 mt-2">
              The prism you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button
              onClick={() => router.push('/prisms')}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Back to Prisms
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formData: PrismFormData = {
    name: prism.name,
    slug: prism.slug,
    description: prism.description,
    active: prism.active,
    splits: prism.splits.map((split) => ({
      destinationId: split.destinationId,
      percentage: split.percentage,
      description: split.description,
    })),
  };

  return (
    <PrismForm
      initialData={formData}
      onSubmit={handleSubmit}
      isLoading={saving}
      error={error}
      title="Edit Prism"
    />
  );
} 