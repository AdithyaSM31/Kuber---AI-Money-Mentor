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

The app is split into a robust **FastAPI Backend** and a modern **Next.js Frontend**.

### Frontend (Next.js & React)
- **Framework**: Next.js 14 (App Router) with React, built on TypeScript.
- **Styling**: Tailwind CSS & Shadcn UI for beautiful, accessible components.
- **Deployment**: Vercel
- **Structure**:
  - `/src/app`: Page routes (`/advisor`, `/mf-xray`, `/tax-wizard`, `/couples-planner`, etc.)
  - `/src/components`: UI components and chat panels.

### Backend (FastAPI & Python)
- **Framework**: FastAPI with standard Uvicorn ASGI server.
- **AI Engine**: Groq (`llama-3.3-70b-versatile` & `llama-3.1-8b-instant`) for agent intelligence.
- **PDF Processing**: `pypdf` for extracting text from MF statements.
- **Database**: Supabase (PostgreSQL) async client for storing secure Health Scores and Financial Profiles.
- **Protection**: `slowapi` for endpoint rate-limiting and comprehensive `structlog` logging.
- **Deployment**: Heroku (Containerized Python App)

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
NEXT_PUBLIC_API_URL="http://localhost:8001"  # or your Heroku backend URL
```
Start the React development server:
```bash
npm run dev
```
The website is now running at `http://localhost:3000`!

## ☁️ Deployment Guides

**Frontend (Vercel)**
Simply connect your GitHub repository to Vercel. Vercel automatically detects Next.js. Just ensure you set `NEXT_PUBLIC_API_URL` to your production Heroku URL in the Vercel Environment Variables.

**Backend (Heroku)**
The backend utilizes a `Procfile` mapping the port specifically for Heroku dynos:
1. Create a Heroku App.
2. Ensure Python version is set to `3.11` (handled dynamically by `.python-version` in the repo to handle `pydantic-core` pyO3 compilation).
3. In Heroku **Settings -> Config Vars**, provide `GROQ_API_KEY` and Supabase keys.
4. Deploy from GitHub or via CLI. The app entrypoint maps naturally via `web: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

## 📝 License
Developed with ♥ by Adithya as an AI financial literacy project.
