'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import PrismForm, { PrismFormData } from '@/app/components/PrismForm';
import Button from '@/app/components/Button';

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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-[1136px] mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#030404] rounded w-1/4 mb-8 sm:mb-10"></div>
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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-[1136px] mx-auto">
          <div className="text-center">
            <h1 className="text-[32px] font-medium leading-[18px] text-red-500">Prism Not Found</h1>
            <p className="text-gray-400 mt-2">
              The prism you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
            </p>
            <Button
              onClick={() => router.push('/prisms')}
              text="Back to Prisms"
              style="Primary"
              className="mt-4"
            />
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