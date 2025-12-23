'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/Button';
import ContactCard from '@/app/components/ContactCard';

interface Contact {
  id: string;
  firstName: string | null;
  lastName: string | null;
  screenName: string | null;
  email: string | null;
  nostrPubkey: string | null;
  metadata: Record<string, unknown> | null;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch contacts');
        }
        const data = await response.json();
        setContacts(data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        // Check for specific error types
        if (err instanceof Error) {
          if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            setError('Unable to connect to the server. Please check your connection and try again.');
          } else if (err.message.includes('Unauthorized')) {
            setError('You are not authorized to view contacts. Please log in and try again.');
          } else {
            setError('Sorry, an unexpected error occurred. The database might be unavailable. Please try again later.');
          }
        } else {
          setError('Sorry, an unexpected error occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [router]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-24 pb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-800 p-6 rounded-lg">
                <div className="h-4 bg-gray-700 rounded w-1/4 mb-3"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-24 pb-8">
        <div className="bg-red-900/50 border border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-200 mb-2">Error</h2>
          <p className="text-red-300">{error}</p>
          <Button 
            onClick={() => {
              setError(null);
              setLoading(true);
              router.refresh();
            }}
            text="Try Again"
            style="Secondary"
            className="mt-4"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pt-24 pb-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Button
          onClick={() => router.push('/contacts/add')}
          text="Add Contact"
          style="Primary"
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </div>
  );
} 