import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import type { TokenBalance, TokenPurchase } from '../types';

const db = getFirestore();

export async function getUserTokenBalance(userId: string): Promise<number> {
  const docRef = doc(db, 'tokenBalances', userId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    // Initialize with 0 tokens
    await setDoc(docRef, {
      userId,
      balance: 0,
      lastUpdated: Date.now()
    });
    return 0;
  }
  
  return docSnap.data().balance;
}

export async function deductToken(userId: string): Promise<boolean> {
  const docRef = doc(db, 'tokenBalances', userId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists() || docSnap.data().balance < 1) {
    return false;
  }
  
  await updateDoc(docRef, {
    balance: increment(-1),
    lastUpdated: Date.now()
  });
  
  return true;
}

export async function addTokens(userId: string, amount: number): Promise<void> {
  const docRef = doc(db, 'tokenBalances', userId);
  await updateDoc(docRef, {
    balance: increment(amount),
    lastUpdated: Date.now()
  });
}