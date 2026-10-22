import "server-only";

import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error("FIREBASE_PROJECT_ID is missing.");
}

function getFirebaseCredential() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

  // Local development: use existing ADC credentials.
  if (!serviceAccountJson) {
    return applicationDefault();
  }

  let serviceAccount;

  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT must contain valid JSON."
    );
  }

  const credentialProjectId =
    serviceAccount.project_id ?? serviceAccount.projectId;

  const clientEmail =
    serviceAccount.client_email ?? serviceAccount.clientEmail;

  const privateKey =
    serviceAccount.private_key ?? serviceAccount.privateKey;

  if (!credentialProjectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase service account is missing required fields."
    );
  }

  if (credentialProjectId !== projectId) {
    throw new Error(
      "Firebase service account project ID does not match."
    );
  }

  return cert({
    projectId: credentialProjectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  });
}

const firebaseAdminApp =
  getApps()[0] ??
  initializeApp({
    credential: getFirebaseCredential(),
    projectId,
  });

export const adminDb = getFirestore(firebaseAdminApp);