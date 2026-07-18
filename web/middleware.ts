import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/server";

const neonAuthMiddleware = auth.middleware({
  loginUrl: "/signin",
});

export default async function middleware(req: NextRequest) {
  // Server Actions (e.g. client components calling a "use server" function
  // directly) POST to the current page URL. @neondatabase/auth's middleware
  // re-checks the session by forwarding the *original* request method to the
  // upstream get-session endpoint instead of forcing GET, so it 400s/fails
  // for POSTs and incorrectly redirects even with a valid session cookie —
  // breaking the action's response. Server Actions are already gated by
  // `withAuth()` at the function level, so it's safe to skip this
  // page-redirect middleware for them.
  if (req.headers.has("next-action")) {
    return NextResponse.next();
  }

  return neonAuthMiddleware(req);
}

export const config = {
  matcher: ["/app"],
};
