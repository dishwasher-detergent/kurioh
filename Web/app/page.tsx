"use client";

import { CreateOrg } from "@/components/create-organization";

export default function Home() {
  return (
    <main className="mx-auto grid h-full min-h-dvh max-w-6xl place-items-center space-y-4 p-4 px-4 md:px-8">
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <h1 className="text-xl font-bold">
          Looks like you don&apos;t have any orgnaizations created yet.
        </h1>
        <p>Lets get started!</p>
        <div>
          <CreateOrg />
        </div>
      </div>
    </main>
  );
}
