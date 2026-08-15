# Northstar Retail Co. — Team Charter

## 🧭 Team Mission
To design, build, and deliver a high-quality, stable, and aesthetically premium **Support Deflection MVP** that integrates customer order lookup and product inventory tracking to deflection redundant customer tickets.

---

## 👥 Roles, Responsibilities & Branch Assignments
This project is structured for a 5-person remote engineering sprint. Each team member owns a specific architectural boundary and coordinates changes through their dedicated branch before merging to `develop` and `main`.

| Team Member | Role | Branch Name | Ownership Scope |
| :--- | :--- | :--- | :--- |
| **Developer 1** | Backend Specialist | `backend` | Server setup (`server.js`), CORS configurations, ports, health checks, Express structure, and error middleware. |
| **Developer 2** | Database Architect | `database` | Mongoose models (`Order.js`, `Product.js`), seeder mock data logic (`seeder.js`), and zero-config connection manager (`db.js`). |
| **Developer 3** | Frontend Lead | `frontend` | Main shell coordinate (`App.jsx`), typography & styling system (`index.css`), Hero component tabs, and custom layout frameworks. |
| **Developer 4** | Integrations & API Engineer | `api` | Route endpoints (`orderRoutes.js`, `inventoryRoutes.js`), backend inputs regex validation, and React components data fetchers (`ReturnsRefunds.jsx`, `StockAvailability.jsx`, `OrderStatus.jsx`). |
| **Developer 5** | Technical Writer & QA | `documentation` | Installation guide (`README.md`), project walkthrough validation logs (`walkthrough.md`), verification plans, and team charter configuration. |

---

## 🛠️ Git Branching & Merging Protocol

```
               [ feature branches ]
  backend ────┐
  database ───┼──>  [ develop ]  ──>  [ main ]
  frontend ───┤   (Integration)    (Production)
  api ────────┤
  doc ────────┘
```

1. **Isolation:** Never commit directly to `develop` or `main`. Work must occur in the designated role branch.
2. **Pull Requests (PRs):**
   - Push feature commits to the origin remote branch (e.g. `git push origin backend`).
   - Open a PR targeting the `develop` branch.
   - Every PR requires at least **one peer review approval** and must pass local build checks (`npm run build`) before it can be merged.
3. **Synchronization:** Sync your local branch with `develop` daily to prevent merge conflicts (`git pull origin develop` or rebase).

---

## 🤝 Working Agreements & Values
- **Definition of Done (DoD):** Code is considered "Done" when it builds without errors, contains zero placeholder TODOs, passes regex input validation checks, and has been verified end-to-end.
- **Communication:** Conduct asynchronous updates via daily Slack status notes.
- **Code Quality:** Maintain documentation integrity by preserving all code symbol comments, utilizing clear custom HSL CSS classes instead of ad-hoc styles, and maintaining consistent ES Module syntax.
- **Zero-Config Integrity:** Ensure that the local developer fallback to `mongodb-memory-server` remains intact so any new developer can immediately run the application upon cloning the repo.
