# Production Readiness Guide for MantleMemo

This guide covers everything needed to deploy MantleMemo to production on Mantle Mainnet.

## 🚨 Critical Security Issues to Fix

### 1. Environment Variables Exposed
**Current Issue**: Your `.env` file contains sensitive API keys and is committed to the repository.

**Fix**:
```bash
# Remove .env from git history
git rm --cached .env backend/.env

# Ensure .gitignore includes
echo ".env" >> .gitignore
echo "backend/.env" >> .gitignore
```

**Action Items**:
- [ ] Rotate ALL exposed API keys immediately:
  - OpenAI API key
  - OpenRouter API key
  - Mem0 API key
  - Tavily API key
  - Supabase service key
  - Upstash Redis tokens
- [ ] Never commit `.env` files again
- [ ] Use environment variable management in deployment platforms

### 2. Weak Secret Key
**Current Issue**: `SECRET_KEY=your` in `.env` is insecure.

**Fix**:
```python
# Generate a secure secret key
import secrets
print(secrets.token_urlsafe(32))
```

**Action Items**:
- [ ] Generate a cryptographically secure secret key
- [ ] Store it in your deployment platform's secrets manager
- [ ] Never use default or weak keys in production

---

## 🌐 Network Migration: Testnet → Mainnet

### Smart Contract Deployment

**Current**: Mantle Sepolia Testnet
```
Contract: 0x4287F8a28AC24FF1b0723D26747CBE7F39C9C167
Network: mantle-sepolia-testnet
Chain ID: 5003
```

**Production**: Mantle Mainnet
```
RPC: https://rpc.mantle.xyz
Chain ID: 5000
Explorer: https://explorer.mantle.xyz
```

**Action Items**:
- [ ] Audit smart contract code (`contracts/contract.sol`)
- [ ] Test thoroughly on testnet with real user flows
- [ ] Deploy to Mantle Mainnet
- [ ] Verify contract on Mantle Explorer
- [ ] Update all environment variables with mainnet contract address

**Environment Variable Changes**:
```env
# Frontend (.env)
VITE_MANTLE_RPC_URL=https://rpc.mantle.xyz
VITE_MANTLE_CHAIN_ID=5000
VITE_MANTLE_EXPLORER=https://explorer.mantle.xyz
VITE_MANTLE_NETWORK=mantle-mainnet
VITE_MANTLEMEMO_CONTRACT_ADDRESS=<YOUR_MAINNET_CONTRACT_ADDRESS>

# Backend (backend/.env)
MANTLE_RPC_URL=https://rpc.mantle.xyz
MANTLE_CHAIN_ID=5000
MANTLE_NETWORK=mantle-mainnet
MANTLEMEMO_CONTRACT_ADDRESS=<YOUR_MAINNET_CONTRACT_ADDRESS>
```

---

## 🏗️ Infrastructure Setup

### Backend Deployment Options

#### Option 1: Render.com (Recommended - Already Configured)
Your `backend/render.yaml` is already set up.

**Steps**:
1. Create account on [Render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Point to `backend/render.yaml`
5. Set environment variables in Render dashboard:

```env
# Required Environment Variables
DEBUG=false
ENVIRONMENT=production
HOST=0.0.0.0

# CORS - Your frontend URL
CORS_ORIGINS=https://your-frontend-domain.vercel.app

# Supabase
SUPABASE_URL=https://xeoqraijaukjuhhxzibi.supabase.co
SUPABASE_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_KEY=<your_supabase_service_key>

# API Keys
OPENROUTER_API_KEY=<your_key>
MEM0_API_KEY=<your_key>
TAVILY_API_KEY=<your_key>

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=<your_url>
UPSTASH_REDIS_REST_TOKEN=<your_token>

# Mantle Mainnet
MANTLE_RPC_URL=https://rpc.mantle.xyz
MANTLE_CHAIN_ID=5000
MANTLEMEMO_CONTRACT_ADDRESS=<your_mainnet_contract>

# JWT
SECRET_KEY=<generate_secure_key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Pricing**: Free tier available, scales automatically

#### Option 2: Railway.app
Similar to Render, supports Docker deployments.

#### Option 3: AWS/GCP/Azure
More complex but offers more control. Use the provided `Dockerfile`.

### Frontend Deployment (Vercel - Already Configured)

Your `vercel.json` is already set up.

**Steps**:
1. Connect repository to [Vercel](https://vercel.com)
2. Set environment variables in Vercel dashboard:

```env
# API
VITE_API_BASE_URL=https://your-backend.onrender.com

# Mantle Mainnet
VITE_MANTLE_RPC_URL=https://rpc.mantle.xyz
VITE_MANTLE_CHAIN_ID=5000
VITE_MANTLE_EXPLORER=https://explorer.mantle.xyz
VITE_MANTLE_NETWORK=mantle-mainnet
VITE_MANTLEMEMO_CONTRACT_ADDRESS=<your_mainnet_contract>
```

3. Deploy automatically on push to main branch

---

## 🔒 Security Hardening

### 1. Rate Limiting
**Current**: No rate limiting implemented

**Add to backend**:
```python
# backend/requirements.txt
slowapi==0.1.9

# backend/main.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Apply to endpoints
@app.get("/api/v1/agents")
@limiter.limit("100/minute")
async def get_agents(request: Request):
    ...
```

### 2. Input Validation
**Current**: Basic Pydantic validation

**Enhance**:
- [ ] Add length limits to all string inputs
- [ ] Sanitize user-generated content
- [ ] Validate wallet addresses format
- [ ] Add CAPTCHA for public endpoints

### 3. CORS Configuration
**Current**: Configured in `backend/main.py`

**Production**:
```python
# Only allow your production frontend
CORS_ORIGINS=https://mantlememo.com,https://www.mantlememo.com
```

### 4. HTTPS Only
**Action Items**:
- [ ] Enforce HTTPS on all endpoints
- [ ] Set secure cookie flags
- [ ] Add HSTS headers

```python
# backend/main.py
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["mantlememo.com", "*.mantlememo.com"]
)
```

### 5. Database Security
**Supabase**:
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Use service key only in backend, never expose to frontend
- [ ] Set up database backups
- [ ] Enable audit logging

---

## 📊 Monitoring & Logging

### 1. Application Monitoring

**Recommended Tools**:
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and debugging
- **DataDog**: Full-stack observability

**Setup Sentry**:
```bash
pip install sentry-sdk[fastapi]
```

```python
# backend/main.py
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    environment="production",
    traces_sample_rate=0.1,
)
```

### 2. Logging Strategy

**Current**: Basic Python logging

**Production Enhancement**:
```python
# backend/app/core/logging_config.py
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
        }
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_data)

# Use structured logging for better parsing
```

### 3. Health Checks

**Current**: `/health` endpoint exists ✅

**Enhance**:
- [ ] Add detailed service status
- [ ] Monitor external dependencies (Supabase, Redis, Mem0)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)

---

## 🚀 Performance Optimization

### 1. Database Optimization

**Supabase**:
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_agents_wallet ON agents(wallet_address);
CREATE INDEX idx_capsules_agent ON capsules(agent_id);
CREATE INDEX idx_chats_agent ON chats(agent_id);
CREATE INDEX idx_messages_chat ON messages(chat_id);

-- Add composite indexes for common queries
CREATE INDEX idx_capsules_marketplace ON capsules(is_staked, created_at DESC);
```

### 2. Caching Strategy

**Current**: Redis/Upstash for cache

**Optimize**:
```python
# Cache frequently accessed data
- Agent metadata: 5 minutes
- Marketplace listings: 1 minute
- User preferences: 10 minutes
- Smart contract data: 30 seconds
```

### 3. API Response Optimization

**Add**:
- [ ] Response compression (gzip)
- [ ] Pagination for list endpoints
- [ ] Field selection (GraphQL-style)
- [ ] ETags for caching

```python
# backend/main.py
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)
```

### 4. Frontend Optimization

**Current**: Vite build configured ✅

**Additional**:
- [ ] Enable CDN for static assets
- [ ] Implement code splitting
- [ ] Add service worker for offline support
- [ ] Optimize images (WebP format)
- [ ] Lazy load components

---

## 💰 Cost Optimization

### API Usage Monitoring

**Track costs for**:
- OpenRouter API calls (LLM inference)
- Mem0 API calls (memory storage)
- Tavily API calls (web search)
- Supabase usage (database operations)
- Upstash Redis (cache operations)

**Implement**:
```python
# backend/app/services/cost_tracking.py
class CostTracker:
    async def track_llm_call(self, model: str, tokens: int):
        # Log to database for billing
        pass
    
    async def track_memory_operation(self, operation: str):
        # Track mem0 usage
        pass
```

### Resource Limits

**Set limits**:
```python
# backend/app/core/config.py
MAX_MEMORY_SIZE_PER_CHAT = 1000  # messages
MAX_CHATS_PER_AGENT = 100
MAX_AGENTS_PER_WALLET = 50
MAX_MESSAGE_LENGTH = 10000  # characters
```

---

## 🧪 Testing Before Production

### 1. Load Testing

**Tools**: Locust, k6, Apache JMeter

```python
# locustfile.py
from locust import HttpUser, task, between

class MantlememoUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def get_marketplace(self):
        self.client.get("/api/v1/marketplace")
    
    @task
    def create_agent(self):
        self.client.post("/api/v1/agents", json={
            "name": "test-agent",
            "platform": "openrouter",
            "api_key": "test"
        })
```

**Run**:
```bash
locust -f locustfile.py --host=https://your-backend.onrender.com
```

### 2. Security Testing

**Tools**:
- OWASP ZAP: Automated security scanning
- Burp Suite: Manual penetration testing
- npm audit: Frontend dependency vulnerabilities
- Safety: Python dependency vulnerabilities

```bash
# Check for vulnerabilities
npm audit
pip install safety
safety check -r backend/requirements.txt
```

### 3. Smart Contract Audit

**Before mainnet deployment**:
- [ ] Internal code review
- [ ] Automated testing (Hardhat/Foundry)
- [ ] Professional audit (CertiK, OpenZeppelin, Trail of Bits)
- [ ] Bug bounty program

---

## 📋 Pre-Launch Checklist

### Security
- [ ] All API keys rotated and secured
- [ ] Strong SECRET_KEY generated
- [ ] HTTPS enforced everywhere
- [ ] Rate limiting implemented
- [ ] Input validation comprehensive
- [ ] CORS properly configured
- [ ] Database RLS enabled

### Infrastructure
- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] Custom domain configured
- [ ] SSL certificates active
- [ ] CDN configured
- [ ] Database backups enabled
- [ ] Redis persistence configured

### Smart Contracts
- [ ] Contract audited
- [ ] Deployed to Mantle Mainnet
- [ ] Verified on explorer
- [ ] All environment variables updated
- [ ] Test transactions successful

### Monitoring
- [ ] Error tracking (Sentry) configured
- [ ] Uptime monitoring active
- [ ] Log aggregation set up
- [ ] Alerts configured
- [ ] Analytics tracking added

### Performance
- [ ] Load testing completed
- [ ] Database indexes created
- [ ] Caching strategy implemented
- [ ] API response times < 200ms
- [ ] Frontend bundle size optimized

### Legal & Compliance
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Cookie consent implemented
- [ ] GDPR compliance reviewed
- [ ] User data handling documented

---

## 🔄 Post-Launch Operations

### 1. Monitoring Dashboard

**Track**:
- API response times
- Error rates
- Active users
- Transaction volume
- Gas costs
- API costs (OpenRouter, Mem0, etc.)

### 2. Backup Strategy

**Automated backups**:
- Supabase: Daily automated backups (built-in)
- Redis: Persistence enabled on Upstash
- Smart contract: Events logged and archived

### 3. Incident Response Plan

**Prepare for**:
- API downtime
- Smart contract issues
- Database failures
- Security breaches

**Create runbook** with:
- Emergency contacts
- Rollback procedures
- Communication templates
- Recovery steps

### 4. Continuous Improvement

**Weekly**:
- Review error logs
- Check performance metrics
- Monitor costs
- Update dependencies

**Monthly**:
- Security audit
- Performance optimization
- User feedback review
- Feature planning

---

## 📞 Support & Resources

### Mantle Network
- Docs: https://docs.mantle.xyz
- Discord: https://discord.gg/mantlenetwork
- Support: support@mantle.xyz

### Deployment Platforms
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs

### Monitoring
- Sentry: https://docs.sentry.io
- DataDog: https://docs.datadoghq.com

---

## 🎯 Quick Start Production Deployment

### 1. Prepare Environment (1 hour)
```bash
# Rotate all API keys
# Generate new SECRET_KEY
# Update .gitignore
git rm --cached .env backend/.env
```

### 2. Deploy Smart Contract (2-4 hours)
```bash
# Audit contract
# Deploy to Mantle Mainnet
# Verify on explorer
# Update environment variables
```

### 3. Deploy Backend (30 minutes)
```bash
# Push to GitHub
# Connect to Render
# Set environment variables
# Deploy
```

### 4. Deploy Frontend (15 minutes)
```bash
# Connect to Vercel
# Set environment variables
# Deploy
```

### 5. Test Everything (1 hour)
```bash
# Connect wallet
# Create agent
# Stake capsule
# Query capsule
# Withdraw earnings
```

### 6. Go Live! 🚀

---

## ⚠️ Common Pitfalls to Avoid

1. **Don't skip the smart contract audit** - Bugs in production contracts can't be fixed
2. **Don't use testnet keys in production** - Always rotate everything
3. **Don't ignore error logs** - Set up alerts from day one
4. **Don't forget about gas costs** - Monitor and optimize contract calls
5. **Don't deploy without backups** - Always have a recovery plan
6. **Don't expose service keys** - Use environment variables properly
7. **Don't skip load testing** - Know your limits before users find them

---

## 📈 Success Metrics

Track these KPIs:
- **Uptime**: Target 99.9%
- **API Response Time**: < 200ms p95
- **Error Rate**: < 0.1%
- **User Growth**: Week-over-week
- **Transaction Volume**: Daily active capsules
- **Revenue**: MNT earned by platform

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: Ready for Production Deployment
