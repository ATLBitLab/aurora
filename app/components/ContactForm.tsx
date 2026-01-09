'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '@/app/components/Button';

export interface PaymentDestination {
  id: string;
  value: string;
  type: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  screenName: string;
  email: string;
  nostrPubkey: string;
  metadata: {
    telegram?: string;
    twitter?: string;
    github?: string;
    bio?: string;
  };
}

interface ContactFormProps {
  initialData?: ContactFormData;
  onSubmit: (data: ContactFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  title: string;
  contactId?: string;
}

export default function ContactForm({
  initialData = {
    firstName: '',
    lastName: '',
    screenName: '',
    email: '',
    nostrPubkey: '',
    metadata: {
      telegram: '',
      twitter: '',
      github: '',
      bio: '',
    },
  },
  onSubmit,
  isLoading = false,
  error = null,
  title,
  contactId,
}: ContactFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ContactFormData>(initialData);
  const [paymentDestinations, setPaymentDestinations] = useState<PaymentDestination[]>([]);
  const [newDestination, setNewDestination] = useState({ value: '', type: 'offer' });
  const [destinationError, setDestinationError] = useState<string | null>(null);

  useEffect(() => {
    if (contactId) {
      fetchPaymentDestinations();
    }
  }, [contactId]);

  const fetchPaymentDestinations = async () => {
    try {
      const response = await fetch(`/api/contacts/${contactId}/payment-destinations`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment destinations');
      }
      const data = await response.json();
      setPaymentDestinations(data);
    } catch (err) {
      console.error('Error fetching payment destinations:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('metadata.')) {
      const metadataField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddDestination = async () => {
    if (!newDestination.value.trim()) {
      setDestinationError('Value is required');
      return;
    }

    try {
      const response = await fetch(`/api/contacts/${contactId}/payment-destinations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDestination),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add payment destination');
      }

      const destination = await response.json();
      setPaymentDestinations((prev) => [destination, ...prev]);
      setNewDestination({ value: '', type: 'offer' });
      setDestinationError(null);
    } catch (err) {
      setDestinationError(err instanceof Error ? err.message : 'Failed to add payment destination');
    }
  };

  const handleDeleteDestination = async (id: string) => {
    try {
      const response = await fetch(
        `/api/contacts/${contactId}/payment-destinations?destinationId=${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete payment destination');
      }

      setPaymentDestinations((prev) => prev.filter((dest) => dest.id !== id));
    } catch (err) {
      console.error('Error deleting payment destination:', err);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-[1136px] mx-auto">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h1 className="text-3xl font-bold">{title}</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Screen Name
                </label>
                <input
                  type="text"
                  name="screenName"
                  value={formData.screenName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nostr Pubkey
                </label>
                <input
                  type="text"
                  name="nostrPubkey"
                  value={formData.nostrPubkey}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Telegram
                </label>
                <input
                  type="text"
                  name="metadata.telegram"
                  value={formData.metadata.telegram}
                  onChange={handleInputChange}
                  placeholder="@username"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Twitter
                </label>
                <input
                  type="text"
                  name="metadata.twitter"
                  value={formData.metadata.twitter}
                  onChange={handleInputChange}
                  placeholder="@username"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  GitHub
                </label>
                <input
                  type="text"
                  name="metadata.github"
                  value={formData.metadata.github}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              name="metadata.bio"
              value={formData.metadata.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Payment Destinations */}
          {contactId && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Payment Destinations</h2>
              
              {/* Add new destination */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newDestination.value}
                    onChange={(e) => setNewDestination(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Enter payment destination value"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="w-32">
                  <select
                    value={newDestination.type}
                    onChange={(e) => setNewDestination(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="offer">Offer</option>
                    <option value="lnurl">LNURL</option>
                    <option value="lightning-address">Lightning Address</option>
                  </select>
                </div>
                <Button
                  type="button"
                  onClick={handleAddDestination}
                  text="Add"
                  style="Primary"
                />
              </div>

              {destinationError && (
                <p className="text-red-400 text-sm">{destinationError}</p>
              )}

              {/* List of destinations */}
              <div className="space-y-2">
                {paymentDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2"
                  >
                    <div className="flex-1">
                      <p className="text-white font-mono">{dest.value}</p>
                      <p className="text-gray-400 text-sm">{dest.type}</p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleDeleteDestination(dest.id)}
                      showIcon
                      icon={<XMarkIcon className="h-5 w-5" />}
                      text=""
                      style="Secondary"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              text={isLoading ? 'Saving...' : 'Save Contact'}
              style="Primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
}