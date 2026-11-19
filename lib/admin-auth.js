import "server-only";

import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { firebaseAdminApp } from "@/lib/firebase-admin";

export const ADMIN_SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-firebite-admin-session"
    : "firebite-admin-session";

export async function getAdminSession() {
  const adminUid = process.env.FIREBASE_ADMIN_UID;

  if (!adminUid) return null;

  const cookieStore = await cookies();
  const sessionCookie =
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie) return null;

  try {
    const decoded = await getAuth(
      firebaseAdminApp
    ).verifySessionCookie(sessionCookie, true);

    if (decoded.uid !== adminUid) return null;

    return decoded;
  } catch {
    return null;
  }
}