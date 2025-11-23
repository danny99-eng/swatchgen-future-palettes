# Paystack Payment Integration Setup

This guide will help you set up Paystack payments for the premium plan.

## Prerequisites

1. A Paystack account (sign up at https://paystack.com)
2. Access to your Supabase project dashboard

## Step 1: Get Your Paystack API Keys

1. Log in to your Paystack dashboard
2. Go to **Settings** > **API Keys & Webhooks**
3. Copy your **Public Key** (starts with `pk_test_` for test mode or `pk_live_` for live mode)
4. Copy your **Secret Key** (starts with `sk_test_` for test mode or `sk_live_` for live mode)

## Step 2: Configure Environment Variables

### Frontend (.env file)

Create a `.env` file in the root of your project (or add to existing one):

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

Replace `pk_test_your_public_key_here` with your actual Paystack public key.

### Supabase Edge Function

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** > **Settings**
3. Add the following environment variable:
   - **Name**: `PAYSTACK_SECRET_KEY`
   - **Value**: Your Paystack secret key (starts with `sk_test_` or `sk_live_`)

## Step 3: Deploy the Edge Function

The edge function `verify-payment` needs to be deployed to Supabase:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy verify-payment
```

Or deploy via the Supabase dashboard:
1. Go to **Edge Functions** in your Supabase dashboard
2. Click **Create a new function**
3. Name it `verify-payment`
4. Copy the code from `supabase/functions/verify-payment/index.ts`
5. Deploy the function

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the pricing page
3. Click "Upgrade to Pro" on the premium plan
4. Use Paystack test cards:
   - **Card Number**: 4084084084084081
   - **CVV**: 408
   - **Expiry**: Any future date
   - **PIN**: 0000 (for bank authorization)

## Step 5: Set Up Webhooks (Optional but Recommended)

For production, set up webhooks to handle payment events:

1. In Paystack dashboard, go to **Settings** > **API Keys & Webhooks**
2. Click **Add Webhook**
3. Enter your webhook URL: `https://your-project-ref.supabase.co/functions/v1/paystack-webhook`
4. Select events to listen for:
   - `charge.success`
   - `charge.failed`

## Important Notes

- **Test Mode**: Use test keys (`pk_test_` and `sk_test_`) during development
- **Live Mode**: Switch to live keys (`pk_live_` and `sk_live_`) for production
- **Amount**: The premium plan is set to ₦5,000 (500,000 kobo). Update `PREMIUM_AMOUNT` in `src/lib/paystack.ts` if needed
- **Security**: Never commit your secret keys to version control. Always use environment variables.

## Troubleshooting

### Payment not initializing
- Check that `VITE_PAYSTACK_PUBLIC_KEY` is set correctly
- Ensure the Paystack script is loading (check browser console)

### Payment verification failing
- Verify that `PAYSTACK_SECRET_KEY` is set in Supabase Edge Functions
- Check Supabase function logs for errors
- Ensure the edge function is deployed correctly

### User not upgraded after payment
- Check Supabase function logs
- Verify the user_roles table has the correct RLS policies
- Check that the function has permission to update user roles

## Support

For Paystack-specific issues, contact Paystack support at support@paystack.com
For integration issues, check the Supabase function logs and browser console.

