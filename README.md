# AI-First CRM HCP Module

A production-ready AI-powered Healthcare Professional (HCP) CRM module that enables users to log interactions using both structured forms and AI conversational chat. Built with React, FastAPI, LangGraph, and PostgreSQL.

## 🎯 Features

### Core Features
- **Dual Interaction Logging**: Structured form + AI conversational chat
- **AI Assistant Panel**: Extract entities, generate summaries, detect sentiment, suggest follow-ups
- **LangGraph Workflow**: Multi-tool agent with structured state management
- **Groq API Integration**: Fast AI inference with fallback models
- **Full CRUD Operations**: Create, read, update, delete HCP interactions
- **Search Functionality**: Find HCP records efficiently
- **Follow-up Management**: Schedule and track follow-up actions
- **Sentiment Analysis**: Automatic sentiment detection (Positive, Neutral, Negative)

### UI Pages
- **Dashboard**: Overview of interactions and metrics
- **Log Interaction**: Primary form for recording HCP interactions
- **Interaction History**: Paginated list of all logged interactions
- **Interaction Details**: Detailed view and edit capabilities
- **Settings**: User and system configuration

## 🏗️ Architecture

### Frontend Architecture
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   ├── forms/               # Form components
│   │   ├── pages/               # Page components
│   │   ├── layout/              # Layout components
│   │   └── ai-chat/             # Chat components
│   ├── redux/
│   │   ├── slices/              # Redux state slices
│   │   └── store.ts             # Redux store configuration
│   ├── services/
│   │   └── api.ts               # API client
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   ├── styles/
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # React entry point
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Backend Architecture
```
backend/
├── app/
│   ├── api/
│   │   └── routes/              # API endpoints
│   ├── models/                  # SQLAlchemy ORM models
│   ├── schemas/                 # Pydantic schemas
│   ├── services/                # Business logic
│   └── db/                      # Database configuration
├── langgraph_workflows/
│   ├── tools/                   # LangGraph tools
│   ├── nodes/                   # LangGraph nodes
│   ├── state.py                 # Workflow state
│   └── graph.py                 # Workflow graph
├── main.py                      # FastAPI app
├── config.py                    # Configuration
├── requirements.txt             # Python dependencies
└── .env.example                 # Environment variables template
```

## 🛠️ Tech Stack

### Frontend
- **React** 18.2 - UI library
- **Redux Toolkit** 1.9 - State management
- **React Router** 6.14 - Client-side routing
- **Material UI** 5.14 - Component library
- **Axios** 1.4 - HTTP client
- **TypeScript** 5.0 - Type safety

### Backend
- **FastAPI** 0.104 - Web framework
- **SQLAlchemy** 2.0 - ORM
- **Pydantic** 2.4 - Data validation
- **LangGraph** 0.0.20 - Agent framework
- **Groq API** - LLM inference

### Database
- **PostgreSQL** 14+ - Relational database
- **SQLAlchemy ORM** - Database abstraction

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### HCP Table
```sql
CREATE TABLE hcp (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    organization VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Interactions Table
```sql
CREATE TABLE interactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    hcp_id INTEGER NOT NULL REFERENCES hcp(id),
    interaction_type VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    attendees TEXT,
    topics_discussed TEXT,
    materials_shared TEXT,
    samples_distributed TEXT,
    sentiment VARCHAR(50),
    outcomes TEXT,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### FollowUps Table
```sql
CREATE TABLE follow_ups (
    id SERIAL PRIMARY KEY,
    interaction_id INTEGER NOT NULL REFERENCES interactions(id),
    action_description TEXT NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Groq API Key (get from https://console.groq.com)

### Frontend Setup

```bash
cd frontend
npm install
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_crm_hcp
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL_PRIMARY=gemma2-9b-it
GROQ_MODEL_FALLBACK=llama-3.3-70b-versatile
SECRET_KEY=your_secret_key_change_in_production
ENVIRONMENT=development
DEBUG=true
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - PostgreSQL:**
```bash
# On macOS with Homebrew:
brew services start postgresql

# On Linux:
sudo systemctl start postgresql

# On Windows:
# Start PostgreSQL Service via Services or command line
```

**Terminal 2 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

### Production Build

**Frontend:**
```bash
cd frontend
npm install
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

## 🤖 LangGraph Workflow

The agent implements a 5-tool system:

### Tools
1. **LogInteractionTool** - Save interactions with LLM-powered extraction
2. **EditInteractionTool** - Modify existing interactions
3. **SearchHCPTool** - Search HCP records
4. **GenerateSummaryTool** - Create conversation summaries
5. **ScheduleFollowUpTool** - Recommend follow-up meetings

### Workflow Nodes
- **Input Node**: Process user input
- **Router Node**: Route to appropriate tool
- **Tool Node**: Execute selected tool
- **Output Node**: Return structured result

### Workflow State
```python
class InteractionAgentState(TypedDict):
    messages: List[dict]
    current_step: str
    extracted_data: dict
    user_input: str
    tool_results: dict
    final_output: dict
    sentiment: str
    follow_ups: List[str]
```

## 📝 API Documentation

### Health Check
```bash
GET /health
Response: {"status": "ok", "message": "AI-First CRM HCP Module is running"}
```

### Chat Endpoint
```bash
POST /chat
Content-Type: application/json

{
  "message": "Met with Dr. Smith today and discussed product benefits"
}

Response: {
  "response": "I've extracted the following information...",
  "extracted_data": {
    "hcp_name": "Dr. Smith",
    "interaction_type": "Meeting",
    "date": "2026-07-11",
    "sentiment": "Positive"
  },
  "sentiment": "Positive",
  "follow_ups": ["Send product information", "Schedule follow-up call"],
  "confidence": 0.85
}
```

### Create Interaction
```bash
POST /interaction
Content-Type: application/json

{
  "hcp_name": "Dr. John Smith",
  "interaction_type": "Meeting",
  "date": "2026-07-11",
  "time": "14:30",
  "topics_discussed": "Product benefits and pricing",
  "sentiment": "Positive",
  "outcomes": "Agreed to schedule follow-up meeting"
}

Response: {
  "id": 1,
  "hcp_id": 1,
  "user_id": 1,
  "created_at": "2026-07-11T14:30:00"
}
```

### Get Interactions
```bash
GET /interaction?page=1&limit=20

Response: {
  "items": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "pages": 5
}
```

### Get Interaction Details
```bash
GET /interaction/{id}

Response: {
  "id": 1,
  "hcp_id": 1,
  "interaction_type": "Meeting",
  "sentiment": "Positive",
  "follow_ups": [...]
}
```

### Update Interaction
```bash
PUT /interaction/{id}
Content-Type: application/json

{
  "sentiment": "Neutral",
  "outcomes": "Updated outcomes"
}

Response: {
  "id": 1,
  "updated_at": "2026-07-11T15:00:00"
}
```

### Delete Interaction
```bash
DELETE /interaction/{id}

Response: {"message": "Interaction deleted successfully"}
```

### Search HCP
```bash
GET /hcp/search?query=Smith&limit=10

Response: {
  "results": [
    {
      "id": 1,
      "name": "Dr. John Smith",
      "organization": "Hospital ABC"
    }
  ]
}
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm install
npm run dev
npm run build
```

### Backend Testing
```bash
cd backend
pip install -r requirements.txt
python -m alembic upgrade head  # Run migrations if available
uvicorn main:app --reload
```

### Verification Checklist

- [x] React app loads at http://localhost:5173
- [x] Dashboard displays correctly
- [x] Form validation works
- [x] AI chat responds
- [x] Interactions save to database
- [x] Interactions load from database
- [x] Search works
- [x] Edit functionality works
- [x] Delete functionality works
- [x] Follow-up suggestions appear
- [x] Sentiment detection works
- [x] Summary generation works
- [x] Form auto-fill from AI chat works
- [x] All CRUD operations work
- [x] LangGraph workflow executes
- [x] Groq API integrated

## 📁 Project Structure

```
ai-crm-hcp/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── SuccessMessage.tsx
│   │   │   ├── forms/
│   │   │   │   └── InteractionForm.tsx
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── InteractionDetails.tsx
│   │   │   │   ├── InteractionHistory.tsx
│   │   │   │   ├── LogInteraction.tsx
│   │   │   │   └── Settings.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Layout.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   └── ai-chat/
│   │   │       └── ChatPanel.tsx
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   │   ├── chatSlice.ts
│   │   │   │   ├── hcpSlice.ts
│   │   │   │   ├── interactionSlice.ts
│   │   │   │   └── uiSlice.ts
│   │   │   └── store.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes/
│   │   │       ├── __init__.py
│   │   │       ├── chat.py
│   │   │       ├── health.py
│   │   │       ├── hcp.py
│   │   │       └── interactions.py
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   └── database.py
│   │   ├── models/
│   │   │   └── __init__.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── interaction_service.py
│   │       └── llm_service.py
│   ├── langgraph_workflows/
│   │   ├── __init__.py
│   │   ├── graph.py
│   │   ├── state.py
│   │   ├── nodes/
│   │   │   └── __init__.py
│   │   └── tools/
│   │       ├── __init__.py
│   │       └── all_tools.py
│   ├── main.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── .gitignore
│   └── pyproject.toml
├── README.md
├── .gitignore
└── render.yaml
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Backend Deployment (Render/Railway/Heroku)

1. Push to GitHub
2. Create new web service
3. Set environment variables
4. Deploy

```bash
DATABASE_URL=postgresql://...
GROQ_API_KEY=...
```

## 🔒 Security Notes

- Change `SECRET_KEY` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Set up proper CORS policies
- Use database connection pooling
- Implement authentication/authorization
- Add input validation and sanitization
- Use prepared statements (SQLAlchemy handles this)

## 📖 LangGraph Workflow Details

### Workflow Execution Flow

```
User Input
    ↓
Input Node (process user input)
    ↓
Router Node (determine tool to use)
    ↓
Tool Node (execute appropriate tool)
    ↓
Output Node (format and return result)
    ↓
Structured Data → Frontend
```

### Tool Selection Logic

- **Edit detected** → EditInteractionTool
- **Search detected** → SearchHCPTool
- **Summary detected** → GenerateSummaryTool
- **Follow-up detected** → ScheduleFollowUpTool
- **Default** → LogInteractionTool

## 🐛 Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Connect to PostgreSQL
psql -U user -d ai_crm_hcp -h localhost
```

### Frontend Build Issues

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Backend Dependency Issues

```bash
cd backend
pip cache purge
pip install -r requirements.txt --no-cache-dir
```

### Groq API Issues

- Verify API key is correct
- Check Groq API status at https://status.groq.com
- Verify model names are correct
- Check rate limits

## 📄 License

MIT

---

**Project Status**: Production Ready ✅  
**Last Updated**: 2026-07-11  
**Version**: 1.0.0
