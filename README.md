<p align="center"><img src="./kuber.png" alt="Kuber Logo" width="150" /></p>

# Kuber - AI Money Mentor

Kuber is a comprehensive, AI-powered financial advisory platform designed to provide personalized wealth management, mutual fund analysis, tax planning, and future projections. It features specialized intelligent agents to guide users through their financial journey using the power of Llama 3 models via Groq.

## 🌟 Core Features

- **AI Financial Advisor Chat**: Real-time contextual financial planning relying on your financial health profile.
- **Mutual Fund X-Ray (PDF Parser)**: Upload your mutual fund statements or portfolio PDFs. The AI automatically parses, categorizes (Large Cap, Mid Cap, Debt, etc.), and evaluates your holdings.
- **Couples Financial Planner**: Dedicated AI chat for managing combined finances, joint goals, and shared risk assessment.
- **FIRE Planner**: Calculate and project the trajectory required to reach Financial Independence, Retire Early.
- **Tax Wizard**: Interactive tools to map out deductions and compare tax regimes for optimization.
- **Health Score**: A dynamically calculated financial health score (0-100) assessing Emergency Funds, Debt, Insurance, and Retirement readiness.

## 🏗️ Architecture

Kuber is a **full-stack AI-powered financial advisory platform** for Indian retail investors. It combines a **FastAPI (Python)** backend with a **Next.js 16 (React/TypeScript)** frontend, powered by **Groq's Llama 3.3 70B** LLM and persisted via **Supabase (PostgreSQL)**.

### Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript | SPA with App Router |
| **Styling** | Tailwind CSS 4, Shadcn UI, tw-animate-css | Design system & animations |
| **Backend** | FastAPI 0.115, Uvicorn, Python 3.11 | REST API server |
| **Mobile** | Capacitor v7 | Android App bridging |
| **AI/LLM** | Groq SDK → Llama 3.3-70B-Versatile | All AI agent intelligence |
| **PDF Parsing** | pypdf 5.6 | Mutual fund statement extraction |
| **Database** | Supabase (async client) | Health scores & financial profiles |
| **Deployment** | Vercel (frontend) + Heroku (backend) | Production hosting |

### AI Agent Architecture

The backend uses three specialized AI agents, all powered by **Groq (Llama 3.3-70B)**:

1. **Agent Advisor**: Elite financial AI for Indian investors, maintains history, and runs simulated workflows.
2. **Agent Health Analyzer**: Extracts 6-dimension scoring. Defaults to a deterministic `rule-based` fallback scorer if LLM models time out.
3. **Agent PDF Parser**: Converts raw Mutual fund PDF text extracted via `pypdf` into JSON structural components.

### Backend Routing

The backend utilizes Server-Sent Events (SSE) specifically on `/api/v1/couples-chat` to stream responses in real-time, but forces structural `json_object` format blocks for rigid analytical data endpoints like `/api/v1/health-score` and `/api/v1/mf-xray`.

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/AdithyaSM31/Kuber---AI-Money-Mentor.git
cd Kuber---AI-Money-Mentor
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```
Create a `.env` file in the `backend/` directory with the following keys:
```env
GROQ_API_KEY="your_groq_api_key_here"
SUPABASE_URL="your_supabase_url"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_key"
```
Run the local server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Frontend Setup
Open a new terminal and install node modules:
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL="http://localhost:8001"
```
Start the React development server:
```bash
npm run dev
```

## ☁️ Deployment Guides

**Frontend (Vercel)**
Simply connect your GitHub repository to Vercel. Vercel automatically detects Next.js. Just ensure you set `NEXT_PUBLIC_API_URL` to your production Heroku URL in the Vercel Environment Variables.

**Backend (Heroku)**
The backend utilizes a `Procfile` mapping the port specifically for Heroku dynos:
1. Ensure Python version is set to `3.11`.
2. In Heroku **Settings -> Config Vars**, provide `GROQ_API_KEY` and Supabase keys.
3. Deploy from GitHub or via CLI. The app entrypoint maps naturally via `web: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

## 📱 Mobile Compilation (Android APK)

The Next.js frontend has been bridged using **Capacitor** to output a functional Android Application:
1. Ensure the UI is built via `npm run build` inside `frontend/`.
2. Push assets into the native wrapper mapping by running `npx cap sync`.
3. Auto-load the Android build inside Android Studio:
   `npx cap open android`
4. Use **Build -> Generate Signed Bundle / APK...** with the internal `/frontend/android/app/release.keystore` to generate an installable `app-release.apk`.

## 📝 License
Developed with ♥ by Adithya as an AI financial literacy project.

## 📜 Build Process and History

* **2026-03-29** - build: setup capacitor for android and generate app assets
* **2026-03-29** - feat: add kuber logo to navbars
* **2026-03-29** - docs: append build process history from git log
* **2026-03-29** - rebrand: replace ET MoneyMind with Kuber - AI Money Mentor across all pages and backend
* **2026-03-29** - fix: pass real computed tax data to couples planner chat instead of hardcoded zeros
* **2026-03-28** - Add initial README with project overview and setup
* **2026-03-28** - Fix UTF-16 null byte corruption in backend/requirements.txt caused by PowerShell echo
* **2026-03-28** - Fix Heroku ModuleNotFoundError crasher by adding missing dependencies: slowapi, structlog, pypdf, python-multipart
* **2026-03-28** - Fix Procfile for Heroku H10 Crash: Change execution to Gunicorn/Uvicorn binding to 0.0.0.0 explicitely with injected Heroku PORT
* **2026-03-28** - Fix Heroku application crash by removing bash variable interpolation from Procfile and natively binding port inside python
* **2026-03-28** - Fix Heroku dynamic port binding
* **2026-03-28** - Configure exact origins just in case
* **2026-03-28** - Fix CORS configuration by disabling credentials to allow wildcard origins
* **2026-03-28** - Attempt completely permissive CORS
* **2026-03-28** - Add Vercel domain to backend CORS allowed origins
* **2026-03-28** - Add .python-version to resolve PyO3 Rust build issues with Python 3.14 on Heroku
* **2026-03-28** - Update frontend API endpoints to use deployed Heroku backend URL
* **2026-03-28** - Add Heroku config files
* **2026-03-28** - Initialize project: Kuber - AI Money Mentor (Frontend and Backend) without sensitive details
