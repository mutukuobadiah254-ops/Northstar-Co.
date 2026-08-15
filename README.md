# EcoSync: Smart Energy Monitoring Platform

Welcome to the **EcoSync** repository. EcoSync is a next-generation SaaS platform designed for smart energy monitoring, allowing residential and commercial users to track utility consumption, optimize usage, and reduce carbon footprints in real-time.

## Project Structure & Git Workflow

To facilitate parallel development and ensure high code quality, our team uses a branch-per-feature workflow. Each team member is responsible for a specific branch corresponding to their feature area. All changes must be pushed to their respective branches and reviewed via Pull Requests before merging into the `main` branch.

### Core Branches & Assignees

| Branch | Primary Owner | Role | Focus Area |
| :--- | :--- | :--- | :--- |
| `main` | *Shared* | Release Branch | Stable production-ready code. |
| `frontend` | Alex Rivera | Frontend Engineer | React/Next.js dashboard, visualizations, and UI/UX components. |
| `backend` | Bailey Chen | Backend Engineer | Microservices, data processing pipeline, and business logic. |
| `database` | Charlie Davis | Database Engineer | PostgreSQL schema design, optimization, and TimescaleDB integration. |
| `api` | Dani Martinez | API Architect | RESTful & WebSocket API definitions, Gateway routing, and Auth. |
| `documentation` | Evelyn Vance | Product Manager / Technical Writer | Project documentation, user guides, team charter, and specifications. |

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ecosync
   ```

2. **Switch to your assigned branch:**
   ```bash
   git checkout <branch-name>
   ```

3. **Check project requirements and architecture:**
   - Refer to [`requirements.md`](file:///C:/Users/Obadiah/.gemini/antigravity/scratch/requirements.md) for feature specs.
   - Refer to [`architecture.md`](file:///C:/Users/Obadiah/.gemini/antigravity/scratch/architecture.md) for system design.
   - Refer to [`api.md`](file:///C:/Users/Obadiah/.gemini/antigravity/scratch/api.md) for interface contracts.

---

## Git Workflow Guidelines

1. **Pulling Latest Changes:** Always pull the latest `main` branch before starting work:
   ```bash
   git checkout main
   git pull origin main
   git checkout <your-branch>
   git merge main
   ```
2. **Commit Messages:** Follow the conventional commit format:
   - `feat(frontend): add real-time energy charts`
   - `fix(backend): resolve memory leak in telemetry ingestion`
   - `docs(api): update auth endpoint specs`
3. **Pull Requests (PRs):** Target your PR to the `main` branch. A minimum of one peer review is required before merging.
