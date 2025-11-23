import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCallback } from 'react';

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_f1aab815e12c3f455ff817ed0a25363497e89363';
const PREMIUM_AMOUNT = 500000; // ₦5,000 in kobo (5000 * 100)

// Declare PaystackPop type for TypeScript
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        metadata?: any;
        callback?: (response: any) => void;
        onClose?: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

export const usePaystack = () => {
  const { user, profile, refreshProfile } = useAuth();

  const handlePayment = useCallback(() => {
    console.log('Payment button clicked');
    
    if (!user || !profile) {
      toast.error('Please sign in to upgrade to premium');
      return;
    }

    if (profile.role === 'premium' || profile.role === 'admin') {
      toast.info('You already have a premium subscription');
      return;
    }

    // Validate Paystack key
    if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.includes('your_public_key')) {
      toast.error('Payment gateway not configured. Please contact support.');
      console.error('Paystack public key not set');
      return;
    }

    // Create a new reference for this payment attempt
    const paymentReference = `SWATCHGEN-${user.id}-${Date.now()}`;
    console.log('Payment reference:', paymentReference);

    // Check if Paystack script is already loaded
    if (window.PaystackPop) {
      // Script already loaded, proceed with payment
      console.log('Paystack already loaded');
      openPaystackModal(paymentReference);
    } else {
      // Load Paystack script first
      console.log('Loading Paystack script...');
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => {
        console.log('Paystack script loaded');
        openPaystackModal(paymentReference);
      };
      script.onerror = () => {
        console.error('Failed to load Paystack script');
        toast.error('Failed to load payment gateway. Please check your internet connection and try again.');
      };
      document.body.appendChild(script);
    }

    function openPaystackModal(ref: string) {
      if (!window.PaystackPop) {
        console.error('PaystackPop not available');
        toast.error('Payment gateway not loaded. Please refresh and try again.');
        return;
      }

      console.log('Opening Paystack modal with:', {
        key: PAYSTACK_PUBLIC_KEY.substring(0, 20) + '...',
        email: profile.email,
        amount: PREMIUM_AMOUNT,
        ref: ref,
      });

      try {
        // Define callback function separately - must be a regular function, not async
        const paymentCallback = function(response: any) {
          console.log('Payment callback received:', response);
          toast.success('Payment successful! Verifying...');
          
          // Handle async verification in a separate async function
          handlePaymentVerification(response.reference).catch((error: any) => {
            console.error('Payment verification error:', error);
            toast.error(error.message || 'Failed to verify payment. Please contact support.');
            setTimeout(() => {
              window.location.href = '/payment/failed';
            }, 2000);
          });
        };

        const closeCallback = function() {
          console.log('Payment modal closed');
          toast.info('Payment cancelled');
        };

        // Async function to handle payment verification
        async function handlePaymentVerification(reference: string) {
          try {
            // Verify payment and upgrade user
            console.log('Verifying payment with Supabase function...');
            const { data, error } = await supabase.functions.invoke('verify-payment', {
              body: { 
                reference: reference,
                userId: user.id,
                email: profile.email,
              },
            });

            console.log('Verification response:', { data, error });

            if (error) {
              console.error('Supabase function error:', error);
              throw error;
            }

            if (data?.success) {
              await refreshProfile();
              toast.success('Welcome to Premium! Your account has been upgraded.');
              // Redirect to success page
              setTimeout(() => {
                window.location.href = '/payment/success';
              }, 1000);
            } else {
              console.error('Verification failed:', data);
              toast.error(data?.error || 'Payment verification failed. Please contact support.');
              setTimeout(() => {
                window.location.href = '/payment/failed';
              }, 2000);
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            throw error;
          }
        }

        const handler = window.PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: profile.email,
          amount: PREMIUM_AMOUNT,
          ref: ref,
          metadata: {
            userId: user.id,
            plan: 'premium',
            custom_fields: [
              {
                display_name: 'Plan',
                variable_name: 'plan',
                value: 'premium',
              },
            ],
          },
          callback: paymentCallback,
          onClose: closeCallback,
        });
        
        console.log('Opening Paystack iframe...');
        handler.openIframe();
      } catch (error: any) {
        console.error('Error setting up Paystack:', error);
        toast.error('Failed to initialize payment. Please try again.');
      }
    }
  }, [user, profile, refreshProfile]);

  return {
    initializePayment: handlePayment,
  };
};

