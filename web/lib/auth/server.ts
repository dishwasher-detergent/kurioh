import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL as string,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET as string,
  },
});
