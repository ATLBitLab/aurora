import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('better-auth.session_token');
    
    if (!sessionToken?.value) {
      console.log('Server-side auth check failed - redirecting to home');
      redirect('/');
    }

    return <>{children}</>;
  } catch (error) {
    console.error('Error in contacts layout:', error);
    redirect('/');
  }
}
