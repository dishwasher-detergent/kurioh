import { COOKIE_KEY } from "@/lib/constants";

import { cookies } from "next/headers";

export async function GET() {
  (await cookies()).delete(COOKIE_KEY);

  return Response.json({
    status: 201,
  });
}
