# 🚀 DEPLOYMENT GUIDE - AI-First CRM HCP Module

## Deployment Readiness Checklist

### Pre-Deployment
- [x] All code committed to GitHub
- [x] All dependencies defined (package.json, requirements.txt)
- [x] Environment variables documented
- [x] Database schema created
- [x] All endpoints tested
- [x] LangGraph workflow verified
- [x] AI chat functionality tested
- [x] Form auto-fill working
- [x] Error handling implemented
- [x] No hardcoded secrets

---

## Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) - RECOMMENDED

#### Frontend Deployment (Vercel)

**Step 1: Connect Repository**
```bash
# 1. Go to https://vercel.com
# 2. Click "New Project"
# 3. Import "BenatAsban/Ai_assistant" from GitHub
# 4. Select "frontend" as root directory
```

**Step 2: Environment Variables**
```bash
VITE_API_BASE_URL=https://api-backend.render.com
VITE_API_TIMEOUT=30000
```

**Step 3: Build Settings**
```
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

**Step 4: Deploy**
```bash
# Vercel automatically deploys on git push
# Your frontend is live at: https://ai-crm-hcp-frontend.vercel.app
```

#### Backend Deployment (Render)

**Step 1: Create PostgreSQL Database**
```bash
# 1. Go to https://render.com
# 2. Click "New +"
# 3. Select "PostgreSQL"
# 4. Create with:
#    - Database name: ai_crm_hcp
#    - User: postgres
#    - Keep auto-generated password
# 5. Copy database URL
```

**Step 2: Deploy Backend Service**
```bash
# 1. Go to https://render.com
# 2. Click "New +" → "Web Service"
# 3. Connect GitHub repository
# 4. Configure:
#    - Name: ai-crm-hcp-backend
#    - Environment: Python 3.11
#    - Build Command: pip install -r requirements.txt
#    - Start Command: uvicorn main:app --host 0.0.0.0 --port 8000
#    - Root Directory: backend
```

**Step 3: Environment Variables**
```bash
DATABASE_URL=postgresql://user:password@host:5432/ai_crm_hcp
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
GROQ_MODEL_PRIMARY=gemma2-9b-it
GROQ_MODEL_FALLBACK=llama-3.3-70b-versatile
SECRET_KEY=your-secure-random-key-here
ENVIRONMENT=production
DEBUG=false
```

**Step 4: Deploy**
```bash
# Render automatically deploys on git push
# Your backend is live at: https://ai-crm-hcp-backend.render.com
```

**Step 5: Update Frontend**
```bash
# Update Vercel environment variable:
VITE_API_BASE_URL=https://ai-crm-hcp-backend.render.com
```

---

### Option 2: Docker Compose (Local/VPS)

#### Setup

```bash
# Clone repository
git clone https://github.com/BenatAsban/Ai_assistant.git
cd Ai_assistant

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://user:password@postgres:5432/ai_crm_hcp
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL_PRIMARY=gemma2-9b-it
GROQ_MODEL_FALLBACK=llama-3.3-70b-versatile
SECRET_KEY=your_secret_key_here
ENVIRONMENT=production
DEBUG=false
EOF

# Start all services
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### Access
- Frontend: http://localhost:5173 (or your domain)
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

### Option 3: Railway (All-in-one)

#### Deploy

```bash
# 1. Go to https://railway.app
# 2. Click "New Project"
# 3. Select "Deploy from GitHub"
# 4. Connect repository
# 5. Railway auto-detects services from docker-compose.yml
```

#### Environment Variables
```bash
# Same as Render (see above)
```

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Git

### Step-by-Step Setup

#### 1. Clone Repository
```bash
git clone https://github.com/BenatAsban/Ai_assistant.git
cd Ai_assistant
```

#### 2. PostgreSQL Setup

```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### 3. Create Database

```bash
psql -U postgres

CREATE DATABASE ai_crm_hcp;
CREATE USER ai_user WITH PASSWORD 'your_secure_password';
ALTER ROLE ai_user SET client_encoding TO 'utf8';
ALTER ROLE ai_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE ai_user SET default_transaction_deferrable TO on;
ALTER ROLE ai_user SET default_transaction_isolation TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE ai_crm_hcp TO ai_user;
\q
```

#### 4. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your values
echo "GROQ_API_KEY=your_groq_api_key_here" >> .env
echo "DATABASE_URL=postgresql://ai_user:your_secure_password@localhost:5432/ai_crm_hcp" >> .env

# Start backend
uvicorn main:app --reload
# Backend running at: http://localhost:8000
```

#### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

# Start frontend
npm run dev
# Frontend running at: http://localhost:5173
```

#### 6. Access Application

Open browser:
- Frontend: http://localhost:5173
- Backend API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

## Environment Variables

### Backend (.env)

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/ai_crm_hcp

# Groq API Configuration
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
GROQ_MODEL_PRIMARY=gemma2-9b-it
GROQ_MODEL_FALLBACK=llama-3.3-70b-versatile

# Security
SECRET_KEY=your_very_secure_random_key_change_in_production

# Environment
ENVIRONMENT=development  # or production
DEBUG=true              # or false
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

---

## Getting Groq API Key

1. Go to https://console.groq.com
2. Sign up or log in
3. Click "API Keys"
4. Create new API key
5. Copy the key to your .env file

---

## Database Initialization

Database tables are automatically created on backend startup:
- Users
- HCP
- Interactions
- FollowUps

No manual migration needed.

---

## Verification After Deployment

### Health Check
```bash
curl https://your-backend-url/health
# Expected: {"status": "ok", "message": "..."}
```

### Chat Endpoint
```bash
curl -X POST https://your-backend-url/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Met with Dr. Smith today"}'
```

### Create Interaction
```bash
curl -X POST https://your-backend-url/interaction \
  -H "Content-Type: application/json" \
  -d '{
    "hcp_name": "Dr. John Smith",
    "interaction_type": "Meeting",
    "date": "2026-07-11",
    "time": "14:30",
    "sentiment": "Positive"
  }'
```

### Get Interactions
```bash
curl https://your-backend-url/interaction?page=1&limit=20
```

---

## Production Checklist

- [ ] Groq API key obtained and set
- [ ] Database created and configured
- [ ] Environment variables set in deployment platform
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] HTTPS/SSL enabled
- [ ] Custom domain configured
- [ ] Health check passing
- [ ] Chat endpoint responding
- [ ] Database operations working
- [ ] Error logging configured
- [ ] Monitoring enabled
- [ ] Backups configured

---

## Troubleshooting

### Backend Won't Start
```bash
# Check Python version
python --version  # Should be 3.11+

# Check dependencies
pip install -r requirements.txt --upgrade

# Check database connection
pg_isready -h localhost -p 5432

# View logs
uvicorn main:app --reload --log-level debug
```

### Frontend Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript
npm run build

# Check for errors
npm run lint
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql

# Check connection string format
DATABASE_URL=postgresql://user:password@host:5432/database

# Test connection
psql $DATABASE_URL
```

### Groq API Not Working
```bash
# Verify API key
echo $GROQ_API_KEY

# Check API status
# https://status.groq.com

# Verify model names
# https://console.groq.com/keys
```

---

## Support

- GitHub Issues: https://github.com/BenatAsban/Ai_assistant/issues
- Groq API Docs: https://console.groq.com/docs
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs

---

**Last Updated**: 2026-07-11  
**Version**: 1.0.0
