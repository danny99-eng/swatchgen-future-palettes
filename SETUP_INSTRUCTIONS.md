# Paystack Integration Setup - Quick Start

## ✅ What's Been Configured

1. **Frontend Payment Integration** - Ready to use
2. **Supabase Edge Function** - Created at `supabase/functions/verify-payment/index.ts`
3. **Payment Pages** - Success and failure pages created
4. **Pricing Component** - Updated with payment button

## 🔑 API Keys Setup

### Frontend (.env file)
The `.env` file should contain:
```
VITE_PAYSTACK_PUBLIC_KEY=pk_test_f1aab815e12c3f455ff817ed0a25363497e89363
```

**If the .env file doesn't exist, create it manually:**
1. Create a new file named `.env` in the root directory
2. Add the line above
3. Restart your dev server (`npm run dev`)

### Backend (Supabase Edge Function)

**IMPORTANT: Add the secret key to Supabase:**

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Edge Functions** → **Settings**
4. Scroll to **Environment Variables**
5. Click **Add new variable**
6. Add:
   - **Name**: `PAYSTACK_SECRET_KEY`
   - **Value**: `sk_test_e8fa112a1355b374325f608b0b33dec3a576a62a`
7. Click **Save**

## 🚀 Deploy the Edge Function

### Option 1: Using Supabase Dashboard (Easiest)

1. Go to **Edge Functions** in your Supabase dashboard
2. Click **Create a new function**
3. Name it: `verify-payment`
4. Copy the code from `supabase/functions/verify-payment/index.ts`
5. Paste it into the function editor
6. Click **Deploy**

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get project ref from Supabase dashboard URL)
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy verify-payment
```

## 🧪 Testing the Integration

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the pricing page** on your site

3. **Click "Upgrade to Pro"** on the premium plan

4. **Use Paystack test card:**
   - **Card Number**: `4084084084084081`
   - **CVV**: `408`
   - **Expiry**: Any future date (e.g., `12/25`)
   - **PIN**: `0000` (for bank authorization)

5. **Complete the payment** - You should be redirected to the success page and your account should be upgraded to premium.

## ✅ Verification Checklist

- [ ] `.env` file created with public key
- [ ] Dev server restarted after creating `.env`
- [ ] Secret key added to Supabase Edge Functions environment variables
- [ ] `verify-payment` function deployed to Supabase
- [ ] Test payment completed successfully
- [ ] User role upgraded to premium after payment

## 🐛 Troubleshooting

### Payment modal doesn't open
- Check browser console for errors
- Verify `VITE_PAYSTACK_PUBLIC_KEY` is set in `.env`
- Restart dev server after creating/updating `.env`

### Payment verification fails
- Check Supabase Edge Function logs
- Verify `PAYSTACK_SECRET_KEY` is set in Supabase
- Check that the function is deployed correctly

### User not upgraded after payment
- Check Supabase function logs for errors
- Verify RLS policies allow role updates
- Check browser console for error messages

## 📝 Next Steps

1. Test the complete payment flow
2. Monitor Supabase function logs during test payments
3. When ready for production:
   - Get live keys from Paystack
   - Update `.env` with live public key
   - Update Supabase with live secret key
   - Test with real payment (small amount first)

## 🔒 Security Reminders

- ✅ Public key is safe in frontend code
- ⚠️ Secret key should ONLY be in Supabase environment variables
- ⚠️ Never commit `.env` file to git (already in `.gitignore`)
- ⚠️ Never commit secret keys to any repository

---

**Need Help?** Check the `PAYSTACK_SETUP.md` file for detailed documentation.

