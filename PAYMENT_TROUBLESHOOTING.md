# Payment Troubleshooting Guide

## Common Issues and Solutions

### 1. Payment Button Does Nothing

**Check:**
- Open browser console (F12) and look for errors
- Check if you're signed in (payment requires authentication)
- Verify the button is not disabled

**Solution:**
- Make sure you're signed in
- Check browser console for JavaScript errors
- Try refreshing the page

### 2. Payment Modal Doesn't Open

**Possible Causes:**
- Paystack script not loading
- Invalid API key
- Network issues

**Check Browser Console:**
- Look for messages like "Loading Paystack script..." or "Paystack script loaded"
- Check for network errors (Failed to load resource)

**Solution:**
- Check your internet connection
- Verify `VITE_PAYSTACK_PUBLIC_KEY` is set in `.env` file
- Make sure the key starts with `pk_test_` or `pk_live_`
- Restart dev server after updating `.env`

### 3. Payment Successful But Not Upgraded

**Possible Causes:**
- Supabase edge function not deployed
- Edge function not configured with secret key
- Database permission issues

**Check:**
1. **Is the edge function deployed?**
   - Go to Supabase dashboard → Edge Functions
   - Check if `verify-payment` function exists and is deployed

2. **Is the secret key configured?**
   - Go to Supabase dashboard → Edge Functions → Settings
   - Check if `PAYSTACK_SECRET_KEY` environment variable is set
   - Value should be: `sk_test_e8fa112a1355b374325f608b0b33dec3a576a62a`

3. **Check function logs:**
   - Go to Supabase dashboard → Edge Functions → verify-payment → Logs
   - Look for any error messages

**Solution:**
- Deploy the edge function (see SETUP_INSTRUCTIONS.md)
- Add the secret key to Supabase environment variables
- Check function logs for specific errors

### 4. "Payment verification failed" Error

**Possible Causes:**
- Paystack transaction not found
- Invalid reference
- Network timeout

**Check:**
- Browser console for detailed error messages
- Supabase function logs
- Verify the payment actually went through in Paystack dashboard

**Solution:**
- Check Paystack dashboard for the transaction
- Verify the reference matches
- Try the payment again

### 5. Testing Payment Flow

**Step-by-step debugging:**

1. **Open browser console (F12)**
2. **Click "Upgrade to Pro" button**
3. **Check console for:**
   - "Payment button clicked" ✓
   - "Loading Paystack script..." or "Paystack already loaded" ✓
   - "Paystack script loaded" ✓
   - "Opening Paystack modal..." ✓

4. **If modal opens:**
   - Use test card: `4084084084084081`
   - CVV: `408`
   - Expiry: Any future date
   - PIN: `0000`

5. **After payment:**
   - Check console for "Payment callback received"
   - Check console for "Verifying payment with Supabase function..."
   - Check console for "Verification response"

### 6. Quick Fixes

**If nothing works:**

1. **Clear browser cache and hard refresh:**
   - Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Verify .env file:**
   ```env
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_f1aab815e12c3f455ff817ed0a25363497e89363
   VITE_SUPABASE_URL=https://peepdopooynqejcfoymn.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_key_here
   ```

4. **Check Supabase function:**
   - Make sure `verify-payment` function is deployed
   - Make sure `PAYSTACK_SECRET_KEY` is set in Supabase

### 7. Console Error Messages

**"Payment gateway not configured"**
- Check `.env` file has `VITE_PAYSTACK_PUBLIC_KEY`
- Restart dev server

**"Failed to load payment gateway"**
- Check internet connection
- Check if `https://js.paystack.co/v1/inline.js` is accessible
- Try disabling ad blockers

**"Payment verification failed"**
- Check Supabase function is deployed
- Check function logs in Supabase dashboard
- Verify Paystack secret key is set

**"Failed to verify payment"**
- Check browser console for detailed error
- Check Supabase function logs
- Verify the payment reference in Paystack dashboard

## Still Having Issues?

1. **Check browser console** - Look for red error messages
2. **Check Supabase function logs** - Look for errors in the edge function
3. **Verify all environment variables** are set correctly
4. **Test with Paystack test cards** - Make sure you're using the correct test card details

## Test Card Details

- **Card Number**: `4084084084084081`
- **CVV**: `408`
- **Expiry**: Any future date (e.g., `12/25`)
- **PIN**: `0000` (for bank authorization)

