import { App, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const app: App = initializeApp();
export const firestore = getFirestore(app);
export const auth = getAuth(app);
