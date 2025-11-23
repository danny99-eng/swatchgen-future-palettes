# Supabase Configuration Setup

## ⚠️ Error: supabaseUrl is required

This error means your Supabase environment variables are not set. Follow these steps:

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project (project ID: `peepdopooynqejcfoymn`)
3. Go to **Settings** → **API**
4. You'll find:
   - **Project URL**: Something like `https://peepdopooynqejcfoymn.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`

## Step 2: Update .env File

Open the `.env` file in the root directory and add/update these lines:

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_f1aab815e12c3f455ff817ed0a25363497e89363

# Supabase Configuration
VITE_SUPABASE_URL=https://peepdopooynqejcfoymn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

**Replace:**
- `https://peepdopooynqejcfoymn.supabase.co` with your actual Project URL
- `your_anon_key_here` with your actual anon/public key

## Step 3: Restart Dev Server

After updating the `.env` file:

1. **Stop the dev server** (Ctrl+C in terminal)
2. **Restart it:**
   ```bash
   npm run dev
   ```

## Quick Check

Your `.env` file should look like this:

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_f1aab815e12c3f455ff817ed0a25363497e89363
VITE_SUPABASE_URL=https://peepdopooynqejcfoymn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Where to Find Your Keys

### Project URL
- Dashboard → Settings → API → Project URL
- Format: `https://[project-ref].supabase.co`

### Anon/Public Key
- Dashboard → Settings → API → Project API keys
- Use the **anon/public** key (NOT the service_role key)
- It's safe to use in frontend code

## Still Having Issues?

1. **Verify .env file exists** in the root directory (same level as `package.json`)
2. **Check file format** - no spaces around the `=` sign
3. **Restart dev server** after making changes
4. **Clear browser cache** and hard refresh (Ctrl+Shift+R)

## Security Note

- ✅ The **anon/public** key is safe for frontend use
- ⚠️ Never commit your `.env` file to git (already in `.gitignore`)
- ⚠️ Never share your service_role key

