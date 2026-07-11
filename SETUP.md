# Installation and Setup Instructions

## Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Groq API Key
- Docker (optional, for containerized setup)

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/BenatAsban/Ai_assistant.git
cd Ai_assistant
```

### 2. Setup PostgreSQL

**Option A: Local Installation**

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

**Option B: Docker**

```bash
docker run -d \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ai_crm_hcp \
  -p 5432:5432 \
  postgres:15
```

### 3. Create Database

```bash
psql -U user -h localhost

CREATE DATABASE ai_crm_hcp;
\q
```

### 4. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your Groq API key
GROQ_API_KEY=your_api_key_here

# Start backend
uvicorn main:app --reload
```

### 5. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo 'VITE_API_BASE_URL=http://localhost:8000' > .env

# Start frontend
npm run dev
```

### 6. Access Application

Open browser and navigate to: `http://localhost:5173`

## Docker Setup (Optional)

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Verification

### Check Backend

```bash
curl http://localhost:8000/health
# Expected: {"status": "ok", "message": "AI-First CRM HCP Module is running"}
```

### Check API Docs

Open browser to: `http://localhost:8000/docs`

### Test Chat Endpoint

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Met with Dr. Smith today"}'
```

### Test Create Interaction

```bash
curl -X POST http://localhost:8000/interaction \
  -H "Content-Type: application/json" \
  -d '{
    "hcp_name": "Dr. John Smith",
    "interaction_type": "Meeting",
    "date": "2026-07-11",
    "time": "14:30",
    "sentiment": "Positive"
  }'
```

## Troubleshooting

### PostgreSQL Connection Error

```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# If not running:
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Port Already in Use

```bash
# Frontend (change port)
npm run dev -- --port 5174

# Backend (change port)
uvicorn main:app --port 8001
```

### Module Not Found Errors (Backend)

```bash
cd backend
pip install -r requirements.txt --upgrade
```

### Dependencies Issues (Frontend)

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_crm_hcp

# Groq API
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
GROQ_MODEL_PRIMARY=gemma2-9b-it
GROQ_MODEL_FALLBACK=llama-3.3-70b-versatile

# Security
SECRET_KEY=your_secret_key_change_in_production

# Environment
ENVIRONMENT=development
DEBUG=true
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

## Production Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Render/Railway/Heroku)

1. Push code to GitHub
2. Create new web service
3. Set environment variables
4. Deploy

## Support

For issues, check:
- GitHub Issues
- Backend logs: `uvicorn main:app --reload`
- Frontend console: Press F12 in browser
- Database: `psql -U user -d ai_crm_hcp -h localhost`
