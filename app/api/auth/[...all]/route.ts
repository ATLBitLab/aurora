import { auth, isEmailWhitelisted } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

// Wrap the handler to add email whitelist validation
async function wrappedHandler(request: NextRequest) {
  const url = new URL(request.url);
  
  // Check if this is a sign-up request and validate email whitelist
  if (request.method === "POST" && url.pathname.includes("/sign-up")) {
    try {
      const body = await request.clone().json();
      const email = body.email;
      
      if (email && !isEmailWhitelisted(email)) {
        return NextResponse.json(
          { 
            error: "Access denied",
            message: "This email is not authorized to create an account. Please contact the administrator."
          },
          { status: 403 }
        );
      }
    } catch {
      // If we can't parse the body, let Better Auth handle the error
    }
  }
  
  return handler.POST(request);
}

export async function POST(request: NextRequest) {
  return wrappedHandler(request);
}

export async function GET(request: NextRequest) {
  return handler.GET(request);
}
