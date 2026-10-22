import "server-only";

import {
  applicationDefault,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error("FIREBASE_PROJECT_ID is missing.");
}

const firebaseAdminApp =
  getApps()[0] ??
  initializeApp({
    credential: applicationDefault(),
    projectId,
  });

export const adminDb = getFirestore(firebaseAdminApp);