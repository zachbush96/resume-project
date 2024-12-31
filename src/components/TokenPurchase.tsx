import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { TokenPackage } from '../types';

const stripePromise = loadStripe('your_publishable_key');

const tokenPackages: TokenPackage[] = [
  {
    id: 'basic',
    tokens: 6,
    price: 200, // in cents
    name: 'Starter Pack',
    description: 'Perfect for trying out the service'
  },
  {
    id: 'popular',
    tokens: 15,
    price: 400, // in cents
    name: 'Popular Pack',
    description: 'Best value for active job seekers'
  },
  {
    id: 'pro',
    tokens: 35,
    price: 800, // in cents
    name: 'Professional Pack',
    description: 'Ideal for extensive job searching'
  }
];

interface Props {
  currentBalance: number;
  onSuccess?: () => void;
}

export function TokenPurchase({ currentBalance, onSuccess }: Props) {
  const handlePurchase = async (packageId: string) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      });
      
      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Error:', error);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-white/90 p-6 rounded-lg shadow-lg border-2 border-amber-900">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-amber-900">Purchase Tokens</h2>
        <p className="text-amber-700">Current Balance: {currentBalance} tokens</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {tokenPackages.map((pkg) => (
          <div key={pkg.id} className="border-2 border-amber-100 rounded-lg p-4 text-center">
            <h3 className="text-xl font-bold text-amber-900">{pkg.name}</h3>
            <p className="text-amber-700 mb-2">{pkg.description}</p>
            <p className="text-2xl font-bold text-amber-900 mb-4">
              {pkg.tokens} Tokens
            </p>
            <p className="text-lg text-amber-700 mb-4">
              ${(pkg.price / 100).toFixed(2)}
            </p>
            <button
              onClick={() => handlePurchase(pkg.id)}
              className="w-full bg-amber-800 text-amber-50 py-2 px-4 rounded-md hover:bg-amber-900 transition-colors"
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}