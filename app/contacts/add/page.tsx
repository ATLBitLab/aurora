'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ContactForm, { ContactFormData } from '@/app/components/ContactForm';

export default function AddContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: ContactFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
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
        throw new Error(data.error || 'Failed to create contact');
      }

      router.push('/contacts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactForm
      onSubmit={handleSubmit}
      isLoading={loading}
      error={error}
      title="Add Contact"
    />
  );
} 