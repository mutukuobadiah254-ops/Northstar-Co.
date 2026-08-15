# EcoSync Go-Live Release Notes & Deployment Plan

**Target Version:** v1.0.0-RC1  
**Target Environment:** Staging / Production  
**Scheduled Date:** September 1, 2026  
**Primary Release Coordinator:** Evelyn Vance  

---

## 1. Pre-Deployment Checklist

- [ ] All feature branches (`backend`, `frontend`, `database`, `api`, `documentation`) merged into `main`.
- [ ] Database schema migrations tested successfully on sandbox.
- [ ] TLS certificates generated for `api.ecosync.com` and `dashboard.ecosync.com`.
- [ ] Environment variables configured in Production Vault.
- [ ] Performance tests verified (system scales up to 10k/sec telemetry ingestion).

---

## 2. Infrastructure Setup & Environment Variables

Ensure the following configuration variables are populated in the deployment environment:

| Service | Variable Name | Description | Example / Recommendation |
| :--- | :--- | :--- | :--- |
| Database | `DATABASE_URL` | TimescaleDB connection string | `postgresql://user:pwd@db:5432/ecosync` |
| Backend | `MQTT_BROKER_URL` | Address of MQTT telemetry broker | `mqtts://broker.ecosync.com:8883` |
| Auth | `JWT_SECRET` | Secret key for encrypting tokens | (At least 256-bit cryptographically secure string) |
| Frontend | `NEXT_PUBLIC_API_URL` | Base endpoint for public API requests | `https://api.ecosync.com` |

---

## 3. Step-by-Step Deployment Guide

### Step 3.1: Database Migration
Deploy the schema updates using the Liquibase or Knex migration runner:
```bash
npm run db:migrate:production
```

### Step 3.2: Backend Core Services
Rebuild and deploy backend microservices:
```bash
docker-compose -f docker-compose.prod.yml build backend-ingest backend-processor
docker-compose -f docker-compose.prod.yml up -d backend-ingest backend-processor
```

### Step 3.3: Frontend client
Deploy UI static assets to CDN and spin up server-side rendering nodes:
```bash
npm run build && npm run start
```

---

## 4. Post-Deployment Verification & Smoke Tests

1. **Service Health Check:**
   - Curl `/health` endpoints for ingestion, processor, and query services.
2. **Telemetry Submission Test:**
   - Execute the mock smart meter script and confirm TimescaleDB tables receive writes.
3. **Frontend E2E Test:**
   - Log in using a test account, check dashboard graphics load within 1.5 seconds.

---

## 5. Rollback Strategy

If any smoke test fails and cannot be hotfixed within 15 minutes, perform the following recovery steps:
1. **Revert Frontend:** Deploy the previous stable docker tag (`v0.9.8`).
2. **Revert Backend Services:** Bring down current containers and redeploy previous images.
3. **Revert Database Schema:** Run migration rollback:
   ```bash
   npm run db:migrate:rollback
   ```
4. **Log Incident:** File post-mortem report in `meeting.md`.
5. .
