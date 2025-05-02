import { NextRequest, NextResponse } from "next/server";

import { UserData } from "@/interfaces/user.interface";
import { COOKIE_KEY, DATABASE_ID, USER_COLLECTION_ID } from "@/lib/constants";
import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";
import { Permission, Role } from "node-appwrite";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  if (!userId || !secret) {
    return NextResponse.redirect("/signin");
  }

  const { account, database } = await createAdminClient();
  const session = await account.createSession(userId, secret);
  const { account: clientAccount } = await createSessionClient(session.secret);
  const user = await clientAccount.get();

  try {
    await database.getDocument<UserData>(
      DATABASE_ID,
      USER_COLLECTION_ID,
      user.$id,
    );
  } catch {
    await database.createDocument<UserData>(
      DATABASE_ID,
      USER_COLLECTION_ID,
      userId,
      {
        name: user.name,
      },
      [
        Permission.read(Role.user(user.$id)),
        Permission.write(Role.user(user.$id)),
        Permission.read(Role.users()),
      ],
    );
  }

  // Set the cookie in the response headers
  const response = NextResponse.redirect(`${request.nextUrl.origin}/app`);

  response.cookies.set(COOKIE_KEY, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });

  return response;
}
