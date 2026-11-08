import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./session";

export async function getSessionName(): Promise<string | null> {
  const cookie = (await cookies()).get(SESSION_COOKIE);
  return cookie ? decodeURIComponent(cookie.value) : null;
}