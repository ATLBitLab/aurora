'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

export interface PrismFormData {
  name: string;
  slug: string;
  description: string;
  active?: boolean;
  splits: Split[];
}

interface PrismFormProps {
  initialData?: PrismFormData;
  onSubmit: (data: PrismFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  title: string;
}

export default function PrismForm({
  initialData = {
    name: '',
    slug: '',
    description: '',
    active: true,
    splits: [],
  },
  onSubmit,
  isLoading = false,
  error = null,
  title,
}: PrismFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<PaymentDestination[]>([]);
  const [formData, setFormData] = useState<PrismFormData>(initialData);

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
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const getDestinationLabel = (destination: PaymentDestination) => {
    const contact = destination.contact;
    const name =
      contact.screenName ||
      [contact.firstName, contact.lastName].filter(Boolean).join(' ');
    return `${name} - ${destination.type} (${destination.value})`;
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

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
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
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
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
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
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
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                placeholder="What is this prism for?"
              />
            </div>

            {initialData.active !== undefined && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, active: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-300">
                  Active
                </label>
              </div>
            )}
          </div>

          {/* Splits */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Payment Splits</h2>
              <button
                type="button"
                onClick={handleAddSplit}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Add Split
              </button>
            </div>

            <div className="space-y-4">
              {formData.splits.map((split, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start bg-gray-800/50 rounded-lg p-4"
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
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
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
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 pr-8"
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
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                          placeholder="What is this split for?"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSplit(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors mt-8"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Prism'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 