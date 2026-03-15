import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function CheckoutForm({ onNext, isAgreed, amount }: { onNext: () => void, isAgreed: boolean, amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !isAgreed) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // We don't want to redirect immediately if we want to show our own success screen
        // But Stripe's default for PaymentElement is to redirect.
        // We can use redirect: 'if_required' to avoid redirecting for cards.
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message ?? 'Ha ocurrido un error inesperado.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setIsProcessing(false);
      onNext();
    } else {
      setIsProcessing(false);
      // Handle other statuses if needed
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PaymentElement className="mb-6" />
      {errorMessage && (
        <div className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
          {errorMessage}
        </div>
      )}
      <button
        type="submit"
        disabled={!isAgreed || isProcessing || !stripe}
        className="w-full flex items-center justify-center px-8 py-3 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {isProcessing ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pagar y Confirmar
          </>
        )}
      </button>
    </form>
  );
}

export default function StripePayment({ amount, onNext, isAgreed }: { amount: number, onNext: () => void, isAgreed: boolean }) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error('Failed to get client secret:', data.error);
        }
      })
      .catch((err) => console.error('Error fetching client secret:', err));
  }, [amount]);

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
      <CheckoutForm onNext={onNext} isAgreed={isAgreed} amount={amount} />
    </Elements>
  );
}
