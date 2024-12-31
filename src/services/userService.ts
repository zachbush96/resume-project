import { getFirestore, doc, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { auth } from '../firebase';
import type { SavedGeneration } from '../types';

const db = getFirestore();

// Function to save the user's default resume
export const saveUserResume = async (resume: string) => {
  if (auth.currentUser) {
    const userDoc = doc(db, 'users', auth.currentUser.uid); // Create a document for the user
    await setDoc(userDoc, { defaultResume: resume }, { merge: true }); // Save or update the default resume
  }
};

// Function to retrieve the user's default resume
export const getUserResume = async () => {
  if (auth.currentUser) {
    const userDoc = doc(db, 'users', auth.currentUser.uid); // Reference the user's document
    const docSnap = await getDoc(userDoc); // Get the document snapshot
    return docSnap.exists() ? docSnap.data().defaultResume : ''; // Return the default resume if it exists
  }
  return ''; // Return an empty string if the user is not authenticated
};

export const saveGeneration = async (generation: SavedGeneration) => {
  if (auth.currentUser) {
    const userDoc = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userDoc, { generations: arrayUnion(generation) }, { merge: true });
  }
};

export const getUserGenerations = async (userId: string) => {
  const userDoc = doc(db, 'users', userId);
  const docSnap = await getDoc(userDoc);
  return docSnap.exists() ? docSnap.data().generations : [];
};