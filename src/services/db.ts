import { getFirestore } from 'firebase/firestore';
import { app } from '../firebase';

export const db = getFirestore(app);

// Collection references
export const COLLECTIONS = {
  USERS: 'users',
  TOKEN_BALANCES: 'tokenBalances',
  GENERATIONS: 'generations',
  PURCHASES: 'purchases'
} as const;