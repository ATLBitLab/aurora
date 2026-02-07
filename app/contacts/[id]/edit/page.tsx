'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import ContactForm, { ContactFormData } from '@/app/components/ContactForm';

export default function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<ContactFormData | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`/api/contacts/${id}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch contact');
        }
        const contact = await response.json();
        
        setInitialData({
          firstName: contact.firstName || '',
          lastName: contact.lastName || '',
          screenName: contact.screenName || '',
          email: contact.email || '',
          nostrPubkey: contact.nostrPubkey || '',
          metadata: {
            telegram: contact.metadata?.telegram || '',
            twitter: contact.metadata?.twitter || '',
            github: contact.metadata?.github || '',
            bio: contact.metadata?.bio || '',
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  const handleSubmit = async (formData: ContactFormData) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          ...formData,
          metadata: Object.fromEntries(
            Object.entries(formData.metadata).filter((entry) => entry[1] !== '')
          ),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update contact');
      }

      router.push('/contacts');
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

  return initialData ? (
    <ContactForm
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={saving}
      error={error}
      title="Edit Contact"
      contactId={id}
    />
  ) : null;
} 