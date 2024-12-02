"use client";

import { COOKIE_KEY, ENDPOINT, PROJECT_ID } from "@/lib/constants";

import { Account, Client, Databases, Storage, Teams } from "appwrite";

export async function createClient() {
  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

  const req = await fetch("/api/auth/session");

  const { session } = await req.json();

  if (session) {
    client.setSession(session.value);

    const localStorageCookie: any = {};
    localStorageCookie[COOKIE_KEY] = session.value;

    window.localStorage.setItem(
      "cookieFallback",
      JSON.stringify(localStorageCookie),
    );
  }

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get team() {
      return new Teams(client);
    },
    client,
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createClient();
    return await account.get();
  } catch {
    return null;
  }
}
