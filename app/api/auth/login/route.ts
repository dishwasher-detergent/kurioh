import { ENDPOINT, HOSTNAME, PROJECT_ID, SSR_HOSTNAME } from "@/lib/constants";
import { NextResponse } from "next/server";
import * as setCookie from "set-cookie-parser";

export async function PUT(request: Request) {
  const res = await request.json();

  const response = await fetch(`${ENDPOINT}/account/sessions/phone`, {
    method: "PUT",
    headers: {
      "x-appwrite-project": PROJECT_ID,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      userId: res.userId,
      secret: res.secret,
    }),
  });

  const json = await response.json();

  if (json.code >= 400) {
    return NextResponse.json(
      { message: json.message },
      {
        status: 400,
      },
    );
  }

  const ssrHostname =
    SSR_HOSTNAME === "localhost" ? SSR_HOSTNAME : "." + SSR_HOSTNAME;
  const appwriteHostname = HOSTNAME === "localhost" ? HOSTNAME : "." + HOSTNAME;

  const cookiesStr = (response.headers.get("set-cookie") ?? "")
    .split(appwriteHostname)
    .join(ssrHostname);

  const cookiesArray = setCookie.splitCookiesString(cookiesStr);
  const cookiesParsed = cookiesArray.map((cookie: any) =>
    setCookie.parseString(cookie),
  );

  const nextJsResponse = NextResponse.json(json);

  for (const cookie of cookiesParsed) {
    nextJsResponse.cookies.set(cookie.name, cookie.value, {
      domain: cookie.domain,
      secure: cookie.secure,
      sameSite: cookie.sameSite as any,
      path: cookie.path,
      maxAge: cookie.maxAge,
      httpOnly: cookie.httpOnly,
      expires: cookie.expires,
    });
  }

  return nextJsResponse;
}
