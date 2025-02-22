import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSuperAdmin } from '@/lib/auth';
import Header from '@/app/components/Header';

export default async function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('nostr_auth');
    
    const isAuthorized = await validateSuperAdmin(authCookie?.value);
    
    if (!isAuthorized) {
      console.log('Server-side auth check failed - redirecting to home');
      redirect('/');
    }

    return (
      <>
        <Header />
        {children}
      </>
    );
  } catch (error) {
    console.error('Error in contacts layout:', error);
    redirect('/');
  }
} 