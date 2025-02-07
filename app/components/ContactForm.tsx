'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
}: ContactFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ContactFormData>(initialData);

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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 