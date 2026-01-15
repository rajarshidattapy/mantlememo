# Render Deployment Guide for MantleMemo Backend

This guide walks you through deploying the MantleMemo backend to Render.com.

## Prerequisites

- GitHub account with your repository
- Render.com account (free tier available)
- All required API keys ready (see Environment Variables section)

## Quick Start

### 1. Connect Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `mantlememo` repository

### 2. Configure Service

Render will automatically detect the `render.yaml` file in the `backend/` directory.

**Service Configuration:**
- **Name**: `mantlememo-backend`
- **Environment**: `Docker`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your production branch)
- **Root Directory**: `backend`
- **Dockerfile Path**: `./Dockerfile`

### 3. Set Environment Variables

In the Render dashboard, go to **Environment** tab and add these variables:

#### Required Variables

```env
# App Configuration
DEBUG=false
ENVIRONMENT=production
HOST=0.0.0.0

# CORS - Your Frontend URLs (comma-separated)
CORS_ORIGINS=https://your-frontend.vercel.app,https://mantlememo.vercel.app

# Supabase
SUPABASE_URL=https://xeoqraijaukjuhhxzibi.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# LLM API Keys
OPENROUTER_API_KEY=sk-or-v1-your_key
OPENAI_API_KEY=sk-proj-your_key
ANTHROPIC_API_KEY=sk-ant-your_key
MISTRAL_API_KEY=your_key

# Memory & Search
MEM0_API_KEY=m0-your_key
TAVILY_API_KEY=tvly-your_key

# Redis/Upstash
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
KV_REST_API_URL=https://your-redis.upstash.io
KV_REST_API_TOKEN=your_token
REDIS_URL=rediss://default:your_token@your-redis.upstash.io:6379

# Mantle Network (Testnet)
MANTLE_RPC_URL=https://rpc.sepolia.mantle.xyz
MANTLE_CHAIN_ID=5003
MANTLE_NETWORK=mantle-sepolia-testnet
MANTLEMEMO_CONTRACT_ADDRESS=0x4287F8a28AC24FF1b0723D26747CBE7F39C9C167

# JWT (Render auto-generates SECRET_KEY)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### For Production (Mantle Mainnet)

When ready to deploy to mainnet, update these:

```env
MANTLE_RPC_URL=https://rpc.mantle.xyz
MANTLE_CHAIN_ID=5000
MANTLE_NETWORK=mantle-mainnet
MANTLEMEMO_CONTRACT_ADDRESS=your_mainnet_contract_address
```

### 4. Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Build your Docker image
   - Deploy the container
   - Assign a URL (e.g., `https://mantlememo-backend.onrender.com`)
   - Run health checks on `/health` endpoint

### 5. Verify Deployment

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-app.onrender.com/health

# API root
curl https://your-app.onrender.com/

# API docs (if enabled)
curl https://your-app.onrender.com/docs
```

Expected response from `/health`:
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

## Environment Variable Details

### Critical Variables

**CORS_ORIGINS**: Must include your frontend URL(s)
- Development: `http://localhost:8080,http://localhost:5173`
- Production: `https://your-frontend.vercel.app`

**SUPABASE_URL & SUPABASE_KEY**: From your Supabase project settings
- Go to: Project Settings → API
- Use the `anon/public` key for SUPABASE_KEY
- Use the `service_role` key for SUPABASE_SERVICE_KEY

**UPSTASH_REDIS_REST_URL & TOKEN**: From your Upstash Redis dashboard
- Go to: Your Redis Database → REST API
- Copy the URL and token

**MANTLE_RPC_URL**: 
- Testnet: `https://rpc.sepolia.mantle.xyz`
- Mainnet: `https://rpc.mantle.xyz`

**MANTLEMEMO_CONTRACT_ADDRESS**: Your deployed smart contract address

### Optional Variables

**OPENAI_API_KEY**: Only if using OpenAI directly (not through OpenRouter)

**ANTHROPIC_API_KEY**: Only if using Claude directly

**MISTRAL_API_KEY**: Only if using Mistral directly

## Render Configuration Files

### render.yaml

Located at `backend/render.yaml`, this file defines:
- Service type (web)
- Docker configuration
- Health check path
- Environment variables with defaults
- Auto-deploy settings

### Dockerfile

Located at `backend/Dockerfile`, optimized for:
- Python 3.11 slim image
- Minimal dependencies
- Health checks
- Production-ready settings

## Monitoring & Logs

### View Logs

1. Go to your service in Render dashboard
2. Click **"Logs"** tab
3. View real-time logs

### Health Monitoring

Render automatically monitors `/health` endpoint:
- Interval: 30 seconds
- Timeout: 10 seconds
- Start period: 40 seconds
- Retries: 3

If health checks fail, Render will restart the service.

### Metrics

View in Render dashboard:
- CPU usage
- Memory usage
- Request count
- Response times
- Error rates

## Troubleshooting

### Service Won't Start

**Check logs for**:
- Missing environment variables
- Database connection errors
- Redis connection errors
- Port binding issues

**Common fixes**:
```bash
# Ensure PORT is not set (Render sets it automatically)
# Check SUPABASE_URL and SUPABASE_KEY are correct
# Verify UPSTASH_REDIS_REST_URL is accessible
```

### Health Check Failing

**Possible causes**:
- Database not accessible
- Redis not accessible
- Application not binding to correct port

**Debug**:
```bash
# Check health endpoint manually
curl https://your-app.onrender.com/health

# Check environment variables in Render dashboard
# Verify external services (Supabase, Upstash) are running
```

### CORS Errors

**Fix**:
```env
# Ensure CORS_ORIGINS includes your frontend URL
CORS_ORIGINS=https://your-frontend.vercel.app,https://www.your-frontend.vercel.app
```

### Database Connection Issues

**Check**:
- SUPABASE_URL is correct
- SUPABASE_KEY is the anon/public key
- SUPABASE_SERVICE_KEY is the service_role key
- Supabase project is not paused

### Redis Connection Issues

**Check**:
- UPSTASH_REDIS_REST_URL is correct
- UPSTASH_REDIS_REST_TOKEN is valid
- Upstash Redis database is active

## Scaling

### Free Tier Limits
- 750 hours/month
- 512 MB RAM
- Shared CPU
- Sleeps after 15 minutes of inactivity

### Paid Plans
- **Starter ($7/month)**: 
  - Always on
  - 512 MB RAM
  - Shared CPU
  
- **Standard ($25/month)**:
  - 2 GB RAM
  - 1 CPU
  - Auto-scaling

- **Pro ($85/month)**:
  - 4 GB RAM
  - 2 CPU
  - Advanced features

### Auto-Scaling

Enable in Render dashboard:
1. Go to service settings
2. Enable **"Auto-scaling"**
3. Set min/max instances
4. Configure scaling triggers

## CI/CD

### Auto-Deploy

Render automatically deploys when you push to your configured branch:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will:
1. Detect the push
2. Build new Docker image
3. Run tests (if configured)
4. Deploy new version
5. Run health checks
6. Switch traffic to new version

### Manual Deploy

In Render dashboard:
1. Go to your service
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**

### Rollback

If deployment fails:
1. Go to **"Events"** tab
2. Find previous successful deployment
3. Click **"Rollback"**

## Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use Render's secret management
- ✅ Rotate keys regularly
- ✅ Use different keys for dev/prod

### HTTPS
- ✅ Render provides free SSL certificates
- ✅ All traffic is HTTPS by default
- ✅ HTTP automatically redirects to HTTPS

### Database
- ✅ Use Supabase Row Level Security (RLS)
- ✅ Never expose service_role key to frontend
- ✅ Enable database backups

### API Security
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Use strong SECRET_KEY (auto-generated by Render)
- ✅ Keep dependencies updated

## Cost Optimization

### Free Tier Tips
- Service sleeps after 15 min inactivity
- First request after sleep takes ~30 seconds
- Use for development/testing

### Reduce Costs
- Use caching (Redis) to reduce database calls
- Optimize API calls to external services
- Monitor usage in Render dashboard
- Set up alerts for unusual activity

## Support

### Render Support
- Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

### MantleMemo Issues
- GitHub: Your repository issues page
- Check logs in Render dashboard
- Review health check endpoint

## Checklist

Before deploying:
- [ ] All environment variables set in Render
- [ ] CORS_ORIGINS includes frontend URL
- [ ] Database (Supabase) is accessible
- [ ] Redis (Upstash) is accessible
- [ ] Smart contract is deployed
- [ ] Health check endpoint works locally
- [ ] Docker build succeeds locally

After deploying:
- [ ] Health check returns 200 OK
- [ ] API root endpoint accessible
- [ ] Frontend can connect to backend
- [ ] Database queries work
- [ ] Redis caching works
- [ ] Smart contract interactions work
- [ ] Logs show no errors

## Next Steps

1. **Update Frontend**: Set `VITE_API_BASE_URL` to your Render URL
2. **Test Integration**: Run full end-to-end tests
3. **Monitor**: Set up alerts and monitoring
4. **Scale**: Upgrade plan if needed
5. **Optimize**: Review logs and performance metrics

---

**Deployment Time**: ~10-15 minutes
**First Deploy**: May take longer for Docker build
**Subsequent Deploys**: ~5 minutes

🚀 **Ready to deploy!**
