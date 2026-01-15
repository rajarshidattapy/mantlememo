# 🚀 Production Setup Guide

## Current Status

✅ **Backend**: Deployed at `https://mantlememo.onrender.com`  
⏳ **Frontend**: Ready to deploy  
⏳ **CORS**: Needs configuration

## Quick Start (5 Minutes)

### 1. Deploy Frontend to Vercel

**Option A: Using Vercel Dashboard (Easiest)**

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variables (click "Environment Variables"):
   ```
   VITE_API_BASE_URL=https://mantlememo.onrender.com
   VITE_MANTLE_RPC_URL=https://rpc.sepolia.mantle.xyz
   VITE_MANTLE_CHAIN_ID=5003
   VITE_MANTLE_EXPLORER=https://explorer.sepolia.mantle.xyz
   VITE_MANTLE_NETWORK=mantle-sepolia-testnet
   VITE_MANTLEMEMO_CONTRACT_ADDRESS=0x4287F8a28AC24FF1b0723D26747CBE7F39C9C167
   ```
5. Click "Deploy"
6. Wait 2-3 minutes for deployment to complete

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 2. Update Backend CORS

After deployment, you'll get a URL like `https://mantlememo-abc123.vercel.app`

1. Go to https://dashboard.render.com/
2. Click on `mantlememo-backend`
3. Go to "Environment" tab
4. Find `CORS_ORIGINS` variable
5. Update value to:
   ```
   https://your-vercel-url.vercel.app,http://localhost:8080,http://localhost:5173
   ```
   Replace `your-vercel-url` with your actual Vercel URL
6. Click "Save Changes"
7. Wait 2-3 minutes for Render to redeploy

### 3. Test Everything

1. Open your Vercel URL in browser
2. Open browser console (F12)
3. Run this test:
   ```javascript
   fetch('https://mantlememo.onrender.com/health')
     .then(r => r.json())
     .then(data => console.log('✅ Backend connected!', data))
     .catch(err => console.error('❌ Connection failed:', err))
   ```
4. If you see `✅ Backend connected!`, you're good to go!

## Detailed Setup

### Frontend Environment Variables

These must be set in Vercel dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_BASE_URL` | `https://mantlememo.onrender.com` | Backend API URL |
| `VITE_MANTLE_RPC_URL` | `https://rpc.sepolia.mantle.xyz` | Mantle RPC endpoint |
| `VITE_MANTLE_CHAIN_ID` | `5003` | Mantle Sepolia chain ID |
| `VITE_MANTLE_EXPLORER` | `https://explorer.sepolia.mantle.xyz` | Block explorer |
| `VITE_MANTLE_NETWORK` | `mantle-sepolia-testnet` | Network name |
| `VITE_MANTLEMEMO_CONTRACT_ADDRESS` | `0x4287F8a28AC24FF1b0723D26747CBE7F39C9C167` | Smart contract address |

### Backend Environment Variables

These are already set in Render, but verify they're correct:

| Variable | Status | Notes |
|----------|--------|-------|
| `CORS_ORIGINS` | ⚠️ Needs Update | Add your Vercel URL |
| `SUPABASE_URL` | ✅ Set | Database connection |
| `SUPABASE_KEY` | ✅ Set | Database auth |
| `OPENROUTER_API_KEY` | ✅ Set | LLM API |
| `MEM0_API_KEY` | ✅ Set | Memory service |
| `UPSTASH_REDIS_REST_URL` | ✅ Set | Cache service |

## Testing Checklist

### Backend Tests

```bash
# Test health endpoint
curl https://mantlememo.onrender.com/health

# Test API root
curl https://mantlememo.onrender.com/

# Test agents endpoint
curl https://mantlememo.onrender.com/api/v1/agents/
```

### Frontend Tests

1. **Wallet Connection**
   - [ ] MetaMask connects successfully
   - [ ] Correct network (Mantle Sepolia)
   - [ ] Balance displays correctly

2. **Agent Management**
   - [ ] Can create new agent
   - [ ] Agent list loads
   - [ ] Can view agent details

3. **Staking**
   - [ ] Can stake on agent
   - [ ] Transaction confirms in MetaMask
   - [ ] Capsule appears in marketplace

4. **Marketplace**
   - [ ] Capsules load from blockchain
   - [ ] Can filter and search
   - [ ] Can view capsule details

5. **Queries**
   - [ ] Can query a capsule
   - [ ] Payment transaction works
   - [ ] Response received

6. **Earnings**
   - [ ] Earnings display correctly
   - [ ] Can withdraw earnings
   - [ ] Transaction confirms

## Common Issues

### Issue: CORS Error

**Symptom**: 
```
Access to fetch at 'https://mantlememo.onrender.com/api/v1/agents/' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

**Solution**:
1. Go to Render dashboard
2. Update `CORS_ORIGINS` to include your Vercel URL
3. Make sure there are no typos
4. Wait for Render to redeploy (2-3 minutes)
5. Hard refresh your browser (Ctrl+Shift+R)

### Issue: Backend Timeout

**Symptom**: Requests to backend timeout or take 30+ seconds

**Solution**:
- Render free tier sleeps after 15 minutes of inactivity
- First request wakes it up (takes ~30 seconds)
- Subsequent requests are fast
- Consider upgrading to paid plan for always-on service

### Issue: Environment Variables Not Working

**Symptom**: `VITE_API_BASE_URL is undefined`

**Solution**:
1. Verify variables are set in Vercel dashboard
2. Variable names must start with `VITE_`
3. Redeploy after adding variables
4. Check build logs for errors

### Issue: MetaMask Wrong Network

**Symptom**: MetaMask shows wrong network or won't connect

**Solution**:
Add Mantle Sepolia manually to MetaMask:
- Network Name: `Mantle Sepolia Testnet`
- RPC URL: `https://rpc.sepolia.mantle.xyz`
- Chain ID: `5003`
- Currency Symbol: `MNT`
- Block Explorer: `https://explorer.sepolia.mantle.xyz`

### Issue: Smart Contract Calls Fail

**Symptom**: Transactions fail or revert

**Solution**:
1. Verify contract address is correct
2. Check you have testnet MNT for gas
3. Verify you're on Mantle Sepolia network
4. Check contract on explorer: https://explorer.sepolia.mantle.xyz/address/0x4287F8a28AC24FF1b0723D26747CBE7F39C9C167

## Monitoring

### Backend Monitoring (Render)

1. Go to https://dashboard.render.com/
2. Select `mantlememo-backend`
3. View:
   - **Logs**: Real-time application logs
   - **Metrics**: CPU, memory, request count
   - **Events**: Deployment history

### Frontend Monitoring (Vercel)

1. Go to https://vercel.com/dashboard
2. Select your project
3. View:
   - **Deployments**: Deployment history
   - **Analytics**: Page views, performance
   - **Logs**: Function logs

### Browser Monitoring

- Open DevTools (F12)
- **Console**: Check for JavaScript errors
- **Network**: Monitor API requests
- **Application**: Check localStorage, cookies

## Performance

### Backend (Render Free Tier)
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ First request takes ~30 seconds to wake
- ✅ Subsequent requests are fast
- 💡 Upgrade to Starter ($7/mo) for always-on

### Frontend (Vercel)
- ✅ Global CDN distribution
- ✅ Automatic edge caching
- ✅ Fast page loads worldwide
- ✅ Free tier is generous

## Security

### ✅ Already Configured
- HTTPS enforced on both frontend and backend
- Environment variables stored securely
- CORS restricts API access
- Wallet authentication required

### ⚠️ Recommended
- Set up error monitoring (Sentry)
- Enable uptime monitoring
- Configure alerts for downtime
- Regular security audits

## Cost Breakdown

### Current Setup (Free Tier)
- **Render**: Free (with limitations)
- **Vercel**: Free (generous limits)
- **Supabase**: Free tier
- **Upstash Redis**: Free tier
- **Total**: $0/month

### Recommended Production Setup
- **Render Starter**: $7/month (always-on)
- **Vercel Pro**: $20/month (better performance)
- **Supabase Pro**: $25/month (more resources)
- **Upstash**: Pay-as-you-go (~$5/month)
- **Total**: ~$57/month

## Next Steps

### Immediate
1. ✅ Deploy frontend to Vercel
2. ✅ Update CORS in Render
3. ✅ Test full user flow
4. ✅ Monitor for errors

### Short Term (1-2 weeks)
- [ ] Set up custom domain
- [ ] Configure error monitoring
- [ ] Set up uptime monitoring
- [ ] Create user documentation

### Long Term (1-2 months)
- [ ] Migrate to Mantle Mainnet
- [ ] Upgrade to paid plans
- [ ] Implement analytics
- [ ] Launch marketing campaign

## Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Mantle Docs**: https://docs.mantle.xyz
- **This Repo**: Check issues and discussions

## Quick Commands

```bash
# Test backend health
curl https://mantlememo.onrender.com/health

# Deploy to Vercel (CLI)
vercel --prod

# Build locally
npm run build

# Run locally
npm run dev

# Check for errors
npm run build && npm run preview
```

---

**Ready to Deploy?**

1. Deploy frontend to Vercel (5 minutes)
2. Update CORS in Render (2 minutes)
3. Test everything (5 minutes)
4. You're live! 🎉

**Need Help?**

- Check the logs in Render and Vercel dashboards
- Review browser console for errors
- See `DEPLOYMENT_INSTRUCTIONS.md` for detailed steps
- See `scripts/update-cors.md` for CORS help
