import { auth_service } from "@/lib/appwrite";
import { PROJECT_ID } from "@/lib/constants";
import { cookies } from "next/headers";
import "server-only";

export async function getAccount() {
  const sessionNames = [
    "a_session_" + PROJECT_ID.toLowerCase(),
    "a_session_" + PROJECT_ID.toLowerCase() + "_legacy",
  ];

  const cookieStore = cookies();
  const hash =
    cookieStore.get(sessionNames[0]) ??
    cookieStore.get(sessionNames[1]) ??
    null;
  auth_service.setSession(hash ? hash.value : "");

  let account;
  try {
    account = await auth_service.getAccount();
  } catch (err) {
    account = null;
  }

  return account;
}
