import { auth } from "@clerk/nextjs/server";
import { ReactNode } from "react";

export async function SignedIn({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (userId) return <>{children}</>;
  return null;
}

export async function SignedOut({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) return <>{children}</>;
  return null;
}
