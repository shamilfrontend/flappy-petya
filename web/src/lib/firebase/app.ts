import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseConfig, isFirebaseConfigured } from './config';

let app: FirebaseApp | null = null;
let firestore: Firestore | null = null;

export function isFirebaseEnabled(): boolean {
  return isFirebaseConfigured();
}

export function getFirestoreDb(): Firestore | null {
  return firestore;
}

export function initFirebaseApp(): void {
  if (!isFirebaseConfigured() || app) {
    return;
  }

  app = initializeApp(getFirebaseConfig());
  firestore = getFirestore(app);
}
