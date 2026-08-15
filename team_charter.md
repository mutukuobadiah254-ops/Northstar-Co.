# EcoSync Team Charter

## 1. Team Purpose & Goal
The EcoSync Dev Team is dedicated to building a scalable, secure, and user-friendly smart energy monitoring system. Our goal is to empower users with real-time energy analytics and reduce carbon emissions.

---

## 2. Team Members & Roles

- **Alex Rivera (Frontend Lead)**
  - Responsible for user interface design, dashboard widgets, browser compatibility, and responsive design.
- **Bailey Chen (Backend Lead)**
  - Responsible for data processing pipeline, microservice optimization, core logic, and queue management.
- **Charlie Davis (Database Administrator)**
  - Responsible for PostgreSQL/TimescaleDB schema management, partitioning, and query optimization.
- **Dani Martinez (API Architect)**
  - Responsible for API contracts, auth (JWT), security policies, and service-to-service routing.
- **Evelyn Vance (Project Lead / Technical Writer)**
  - Responsible for requirements definition, release management, documentation, and coordination.

---

## 3. Communication Protocols & SLAs

- **Daily Syncs:** Mon-Fri at 10:00 AM UTC in the Slack Huddle.
- **Sprint Planning:** Alternate Mondays at 9:00 AM UTC.
- **Review Turnaround Time (SLA):** 
  - Pull Requests should be reviewed within 24 hours of submission.
  - Urgent blockers should be highlighted in Slack with `@channel` and resolved within 4 hours.

---

## 4. Git Branching & Merging Policy

- **No Direct Commits to Main:** All code must be pushed to feature branches (`frontend`, `backend`, `database`, `api`, `documentation`).
- **Pull Request Requirements:**
  - Every PR must have at least **one approved peer review** before merge.
  - CI/CD tests must pass successfully.
- **Releasing Code:** Evelyn Vance orchestrates releases according to [`GO-LIVE-NOTE.md`](file:///C:/Users/Obadiah/.gemini/antigravity/scratch/GO-LIVE-NOTE.md).

---

## 5. Definition of Done (DoD)

A task or ticket is considered **Done** only when:
1. **Code Quality:** All code compiles/builds successfully without errors. Linting rules are followed.
2. **Testing:** Unit tests cover at least 85% of new code. Integration tests are successful.
3. **Documentation:** API specs in [`api.md`](file:///C:/Users/Obadiah/.gemini/antigravity/scratch/api.md) and system architecture in [`architecture.md`](file:///C:/Users/Obadiah/.gemini/antigravity/scratch/architecture.md) are updated.
4. **Peer Review:** PR has been reviewed, approved, and merged.
5. **Validation:** Deployment verifies the changes on Staging environment.
