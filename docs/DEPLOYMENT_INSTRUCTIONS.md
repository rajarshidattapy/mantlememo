# 🚀 Production Deployment Instructions

## Current Status
- ✅ Backend deployed at: `https://mantlememo.onrender.com`
- ⏳ Frontend needs CORS configuration update

## Critical: Update Backend CORS Settings

Your backend is deployed but needs to allow requests from your frontend domain.

### Step 1: Update CORS in Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your `mantlememo-backend` service
3. Go to **Environment** tab
4. Find the `CORS_ORIGINS` variable
5. Update its value to include your Vercel frontend URL:

```
https://mantlememo-nu.vercel.app,https://mantlememo.vercel.app,http://localhost:8080,http://localhost:5173
```

**Important**: Replace `mantlememo-nu.vercel.app` with your actual Vercel deployment URL if different.

6. Click **Save Changes**
7. Render will automatically redeploy with the new CORS settings

### Step 2: Deploy Frontend to Vercel

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://mantlememo.onrender.com
   VITE_MANTLE_RPC_URL=https://rpc.sepolia.mantle.xyz
   VITE_MANTLE_CHAIN_ID=5003
   VITE_MANTLE_EXPLORER=https://explorer.sepolia.mantle.xyz
   VITE_MANTLE_NETWORK=mantle-sepolia-testnet
   VITE_MANTLEMEMO_CONTRACT_ADDRESS=0x4287F8a28AC24FF1b0723D26747CBE7F39C9C167
   ```

6. Click **"Deploy"**

### Step 3: Update CORS with Your Actual Vercel URL

After Vercel deployment completes:

1. Copy your Vercel deployment URL (e.g., `https://mantlememo-abc123.vercel.app`)
2. Go back to Render Dashboard
3. Update `CORS_ORIGINS` to include your actual URL:
   ```
   https://your-actual-vercel-url.vercel.app,http://localhost:8080,http://localhost:5173
   ```
4. Save and wait for Render to redeploy

## Testing the Integration

### 1. Test Backend Health

```bash
curl https://mantlememo.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "database": "available",
    "cache": "available",
    "memory": "available"
  }
}
```

### 2. Test CORS

Open your browser console on your Vercel deployment and run:

```javascript
fetch('https://mantlememo.onrender.com/api/v1/agents/')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

If CORS is configured correctly, you should see the agents list (or an empty array).

### 3. Test Full Flow

1. Open your Vercel deployment
2. Connect MetaMask wallet
3. Try creating an agent
4. Check browser console for any errors

## Common Issues & Solutions

### Issue: CORS Error

**Error**: `Access to fetch at 'https://mantlememo.onrender.com/api/v1/agents/' from origin 'https://your-app.vercel.app' has been blocked by CORS policy`

**Solution**: 
- Verify CORS_ORIGINS in Render includes your exact Vercel URL
- Make sure there are no typos
- Wait for Render to finish redeploying after changes

### Issue: 503 Service Unavailable

**Error**: Backend returns 503 or times out

**Solution**:
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Refresh the page and try again
- Consider upgrading to paid plan for always-on service

### Issue: Environment Variables Not Working

**Error**: `VITE_API_BASE_URL is undefined`

**Solution**:
- Verify environment variables are set in Vercel dashboard
- Redeploy the frontend after adding variables
- Check that variable names start with `VITE_`

### Issue: Wallet Connection Fails

**Error**: MetaMask doesn't connect or shows wrong network

**Solution**:
- Add Mantle Sepolia Testnet to MetaMask manually:
  - Network Name: Mantle Sepolia Testnet
  - RPC URL: https://rpc.sepolia.mantle.xyz
  - Chain ID: 5003
  - Currency Symbol: MNT
  - Block Explorer: https://explorer.sepolia.mantle.xyz

## Monitoring

### Backend Logs (Render)
1. Go to Render Dashboard
2. Select your service
3. Click **"Logs"** tab
4. Monitor for errors

### Frontend Logs (Vercel)
1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View **"Functions"** logs

### Browser Console
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

## Performance Tips

### Backend (Render Free Tier)
- Service sleeps after 15 min inactivity
- First request takes ~30 seconds to wake up
- Consider upgrading to Starter plan ($7/mo) for always-on

### Frontend (Vercel)
- Automatic CDN distribution
- Edge caching enabled
- Fast global delivery

## Security Checklist

- [ ] CORS only allows your frontend domain
- [ ] Environment variables set in platform dashboards (not in code)
- [ ] `.env` files in `.gitignore`
- [ ] API keys rotated if exposed
- [ ] HTTPS enforced on both frontend and backend
- [ ] Wallet authentication working

## Next Steps

1. **Custom Domain** (Optional):
   - Add custom domain in Vercel
   - Update CORS_ORIGINS in Render
   - Configure DNS records

2. **Monitoring**:
   - Set up Sentry for error tracking
   - Configure uptime monitoring
   - Set up alerts

3. **Mainnet Migration**:
   - Deploy smart contract to Mantle Mainnet
   - Update environment variables
   - Test thoroughly before going live

## Support

- **Backend Issues**: Check Render logs
- **Frontend Issues**: Check Vercel logs and browser console
- **Smart Contract Issues**: Check Mantle Explorer
- **CORS Issues**: Verify CORS_ORIGINS matches your frontend URL exactly

---

**Quick Reference**:
- Backend: https://mantlememo.onrender.com
- Frontend: [Your Vercel URL]
- Contract: 0x4287F8a28AC24FF1b0723D26747CBE7F39C9C167
- Network: Mantle Sepolia Testnet (Chain ID: 5003)
