# Vercel Production Deployment - Final Steps

Your code changes have been pushed to GitHub. Now we need to set environment variables on Vercel to make the frontend and backend communicate properly.

## Current Status
- ✅ Frontend code pushed to GitHub (`enat-injera-eqq6` on Vercel)
- ✅ Backend code pushed to GitHub (`enat-injera` on Vercel)
- ⏳ **NEXT: Set environment variables on both projects**
- ⏳ **THEN: Redeploy both projects**

---

## Step 1: Set Frontend Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click on the **enat-injera-eqg** project (Frontend)
3. Click on **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. Under "Environment Variables", click the **Add** button
6. Fill in the form:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://enat-injera.vercel.app/api`
   - **Select environments:** Check ✓ **Production**
   - (Optionally also check Preview for testing)
7. Click **Save**

### Screenshot Example:
```
[Settings] → [Environment Variables] → [Add]
┌─────────────────────────────┐
│ Name: VITE_API_URL          │
│ Value: https://enat-in...   │
│ ☑ Production                │
│ ☐ Preview                   │
│ ☐ Development               │
│          [Save]             │
└─────────────────────────────┘
```

---

## Step 2: Redeploy Frontend Project

1. In the **enat-injera-eqg** project dashboard
2. Click **Deployments** tab
3. Find the **latest deployment** at the top of the list
4. Click the **three dots (⋮)** button on the right
5. Select **Redeploy**
6. Click **Redeploy** in the confirmation dialog
7. Wait for deployment to complete (green checkmark = success)

---

## Step 3: Verify Backend Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click on the **enat-injera** project (Backend)
3. Click on **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. You should see these environment variables already set:
   - `MONGODB_URI` ✓
   - `JWT_SECRET` ✓
   - `JWT_EXPIRY` ✓
   - `PORT` ✓
   - `NODE_ENV` - **Should be `production`** ✅
   - `CLIENT_URL` - **Should be `https://enat-injera-eqq6.vercel.app`** ✅

**If they're missing or wrong, add/update them:**
- Click **Add** for each missing variable
- Name: `NODE_ENV`, Value: `production`, Environment: **Production**
- Name: `CLIENT_URL`, Value: `https://enat-injera-eqg.vercel.app`, Environment: **Production**

---

## Step 4: Redeploy Backend Project

1. In the **enat-injera** project dashboard
2. Click **Deployments** tab
3. Find the **latest deployment** at the top of the list
4. Click the **three dots (⋮)** button on the right
5. Select **Redeploy**
6. Click **Redeploy** in the confirmation dialog
7. Wait for deployment to complete (green checkmark = success)

---

## Step 5: Test the Application

Once both projects have redeployed (green checkmarks on latest deployments):

1. Open: https://enat-injera-eqg.vercel.app
2. You should see the **Login page**
3. Enter credentials:
   - **Username:** `andarg`
   - **Password:** `kira@123`
4. Click **Login**
5. If successful, you should see the **Home page** dashboard ✅

---

## Troubleshooting

### If login shows "Request failed with status code 500":
- **Check:** Frontend environment variable `VITE_API_URL=https://enat-injera.vercel.app/api` ✓
- **Check:** Frontend has been redeployed after setting env var
- **Check:** Backend CORS includes `https://enat-injera-eqg.vercel.app`

### If you see CORS error in browser console:
- Backend CORS may not include frontend URL
- Go to backend project → Redeploy
- Backend code already includes the frontend URL in CORS

### If backend returns 404:
- Backend may not be redeployed
- Go to backend project → Deployments → Redeploy latest

---

## Architecture Summary

```
User Browser (enat-injera-eqq6.vercel.app)
         ↓ HTTPS
    [Frontend - Vite React]
         ↓ API Call to https://enat-injera.vercel.app/api
    [Backend - Express]
         ↓ MongoDB Query
    [MongoDB Atlas Database]
```

**Environment Variables Flow:**
- Frontend reads `VITE_API_URL` at build time → tells React where to call API
- Backend reads `CLIENT_URL` at runtime → tells Express which frontend to allow (CORS)
- Backend reads `MONGODB_URI` at runtime → connects to database

---

## Questions?
- All code changes have been committed and pushed ✅
- You just need to set environment variables on Vercel dashboard (no code changes needed)
- Both projects will auto-redeploy when you trigger redeploy in dashboard
