import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";

import { firebaseAdminApp } from "@/lib/firebase-admin";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const SESSION_DURATION_SECONDS = SESSION_DURATION_MS / 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host");

  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host.split(",")[0].trim();
  } catch {
    return false;
  }
}

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Forbidden." },
      { status: 403 }
    );
  }

  const idToken = request.headers
    .get("authorization")
    ?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!idToken) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const adminUid = process.env.FIREBASE_ADMIN_UID;

  if (!adminUid) {
    return NextResponse.json(
      { error: "Admin configuration is missing." },
      { status: 500 }
    );
  }

  try {
    const adminAuth = getAuth(firebaseAdminApp);

    const decoded = await adminAuth.verifyIdToken(
      idToken,
      true
    );

    const isAuthorizedAdmin =
      decoded.uid === adminUid &&
      decoded.firebase?.sign_in_provider === "password";

    const authTime = decoded.auth_time * 1000;
    const isRecentLogin =
      Number.isFinite(authTime) &&
      Date.now() - authTime <= 5 * 60 * 1000 &&
      authTime <= Date.now() + 60 * 1000;

    if (!isAuthorizedAdmin || !isRecentLogin) {
      return NextResponse.json(
        { error: "Admin authentication failed." },
        { status: 403 }
      );
    }

    const sessionCookie =
      await adminAuth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION_MS,
      });

    const response = NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } }
    );

    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      sessionCookie,
      {
        ...cookieOptions,
        maxAge: SESSION_DURATION_SECONDS,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Admin session creation failed:",
      error?.code || "unknown"
    );

    return NextResponse.json(
      { error: "Unable to create admin session." },
      { status: 401 }
    );
  }
}

export async function DELETE(request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "Forbidden." },
      { status: 403 }
    );
  }

  const cookieStore = await cookies();
  const sessionCookie =
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  try {
    if (sessionCookie) {
      const adminAuth = getAuth(firebaseAdminApp);

      const decoded = await adminAuth.verifySessionCookie(
        sessionCookie
      );

      if (decoded.uid === process.env.FIREBASE_ADMIN_UID) {
        await adminAuth.revokeRefreshTokens(decoded.uid);
      }
    }
  } catch {
    // Even an invalid session must be cleared.
  }

  const response = NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } }
  );

  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });

  return response;
}