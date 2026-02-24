'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '@/app/components/Button';

interface PaymentDestination {
  id: string;
  value: string;
  type: string;
  contact: {
    id: string;
    firstName?: string;
    lastName?: string;
    screenName?: string;
  };
}

interface Split {
  destinationId: string;
  percentage: number;
  description?: string;
}

interface PrismFormData {
  name: string;
  slug: string;
  description: string;
  splits: Split[];
}

export default function NewPrismPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<PaymentDestination[]>([]);
  const [formData, setFormData] = useState<PrismFormData>({
    name: '',
    slug: '',
    description: '',
    splits: [],
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/payment-destinations');
      if (!response.ok) {
        throw new Error('Failed to fetch payment destinations');
      }
      const data = await response.json();
      setDestinations(data);
    } catch (err) {
      console.error('Error fetching payment destinations:', err);
      setError('Failed to load payment destinations');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSplit = () => {
    setFormData((prev) => ({
      ...prev,
      splits: [
        ...prev.splits,
        {
          destinationId: '',
          percentage: 0,
          description: '',
        },
      ],
    }));
  };

  const handleRemoveSplit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      splits: prev.splits.filter((_, i) => i !== index),
    }));
  };

  const handleSplitChange = (
    index: number,
    field: keyof Split,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      splits: prev.splits.map((split, i) =>
        i === index
          ? {
              ...split,
              [field]:
                field === 'percentage'
                  ? Math.min(Math.max(Number(value) / 100, 0), 1) // Convert percentage to decimal
                  : value,
            }
          : split
      ),
    }));
  };

  const validateForm = (): boolean => {
    // Check if name and slug are provided
    if (!formData.name.trim() || !formData.slug.trim()) {
      setError('Name and slug are required');
      return false;
    }

    // Check if there are any splits
    if (formData.splits.length === 0) {
      setError('At least one split is required');
      return false;
    }

    // Check if all splits have a destination and valid percentage
    const validSplits = formData.splits.every(
      (split) => split.destinationId && split.percentage > 0
    );
    if (!validSplits) {
      setError('All splits must have a destination and percentage greater than 0%');
      return false;
    }

    // Check if total percentage equals 100%
    const totalPercentage = formData.splits.reduce(
      (sum, split) => sum + split.percentage,
      0
    );
    if (Math.abs(totalPercentage - 1) > 0.0001) {
      setError('Total percentage must equal 100%');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/prisms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create prism');
      }

      router.push('/prisms');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getDestinationLabel = (destination: PaymentDestination) => {
    const contact = destination.contact;
    const name =
      contact.screenName ||
      [contact.firstName, contact.lastName].filter(Boolean).join(' ');
    return `${name} - ${destination.type} (${destination.value})`;
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-[1136px] mx-auto">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h1 className="text-[32px] font-medium leading-[18px] text-white">Create New Prism</h1>
          <Button
            onClick={() => router.back()}
            text="Cancel"
            style="Secondary"
          />
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-[#292e2d] border border-[#66706f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/50"
                placeholder="My Payment Split"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full bg-[#292e2d] border border-[#66706f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/50"
                placeholder="my-payment-split"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-[#292e2d] border border-[#66706f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/50"
                placeholder="What is this prism for?"
              />
            </div>
          </div>

          {/* Splits */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Payment Splits</h2>
              <Button
                type="button"
                onClick={handleAddSplit}
                text="Add Split"
                style="Primary"
              />
            </div>

            <div className="space-y-4">
              {formData.splits.map((split, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start bg-[#030404] border border-white/15 rounded-lg p-4"
                >
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Payment Destination
                      </label>
                      <select
                        value={split.destinationId}
                        onChange={(e) =>
                          handleSplitChange(index, 'destinationId', e.target.value)
                        }
                        className="w-full bg-[#292e2d] border border-[#66706f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/50"
                      >
                        <option value="">Select a destination</option>
                        {destinations.map((dest) => (
                          <option key={dest.id} value={dest.id}>
                            {getDestinationLabel(dest)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Percentage
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={Math.round(split.percentage * 100)}
                            onChange={(e) =>
                              handleSplitChange(index, 'percentage', e.target.value)
                            }
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-full bg-[#292e2d] border border-[#66706f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/50 pr-8"
                          />
                          <span className="absolute right-3 top-2 text-gray-400">
                            %
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={split.description || ''}
                          onChange={(e) =>
                            handleSplitChange(index, 'description', e.target.value)
                          }
                          className="w-full bg-[#292e2d] border border-[#66706f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/50"
                          placeholder="What is this split for?"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => handleRemoveSplit(index)}
                    showIcon
                    icon={<XMarkIcon className="h-5 w-5" />}
                    text=""
                    style="Secondary"
                    className="mt-8"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              text={loading ? 'Creating...' : 'Create Prism'}
              style="Primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
}