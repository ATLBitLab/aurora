import { cookies } from 'next/headers';

export async function validateSuperAdmin(authCookie?: string | null): Promise<boolean> {
  if (!authCookie) return false;
  
  try {
    const superAdminNpub = process.env.AURORA_SUPER_ADMIN;
    if (!superAdminNpub) {
      console.error('AURORA_SUPER_ADMIN environment variable is not set');
      return false;
    }

    // The auth cookie contains the user's npub
    return authCookie === superAdminNpub;
  } catch (error) {
    console.error('Error validating super admin:', error);
    return false;
  }
}

export async function requireSuperAdmin() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('nostr_auth');
  const isAuthorized = await validateSuperAdmin(authCookie?.value);

  if (!isAuthorized) {
    throw new Error('Unauthorized: Super Admin access required');
  }
} 