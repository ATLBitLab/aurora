import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";

const prisma = new PrismaClient();

// Get whitelisted emails from environment variable
function getWhitelistedEmails(): string[] {
  const whitelist = process.env.ALLOWED_EMAILS;
  if (!whitelist) return [];
  return whitelist.split(",").map((email) => email.trim().toLowerCase());
}

// Check if email is whitelisted (returns true if no whitelist is configured or if email is in whitelist)
export function isEmailWhitelisted(email: string): boolean {
  const whitelist = getWhitelistedEmails();
  // If no whitelist configured, allow all emails
  if (whitelist.length === 0) return true;
  return whitelist.includes(email.toLowerCase());
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    signUpEmail: {
      enabled: true,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",")
    : ["http://localhost:3000"],
});

export type Session = typeof auth.$Infer.Session;

// Helper to check if request has a valid session
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionToken = request.cookies.get('better-auth.session_token');
  return !!sessionToken?.value;
}

// Helper to validate session from cookies (for server components)
export async function validateSession(cookieValue: string | undefined): Promise<boolean> {
  return !!cookieValue;
}
