# EcoSync Team Meeting Minutes

This file acts as a continuous journal for our weekly syncs and design reviews.

---

## Kickoff Meeting: Project Setup & Branch Allocation
**Date:** August 15, 2026  
**Time:** 10:00 AM - 11:00 AM UTC  
**Attendees:** Alex Rivera, Bailey Chen, Charlie Davis, Dani Martinez, Evelyn Vance  
**Facilitator:** Evelyn Vance  

### Agenda
1. Project Vision & Architecture Alignment.
2. Branch Assignments and Git strategy definition.
3. Documentation structure and review.
4. Next milestones.

### Discussion Notes
- **Architecture:** We aligned on a time-series backend optimized with TimescaleDB. Charlie confirmed that partitioning tables early is necessary for scaling up to 10k ingestion points per second.
- **Git Branching Strategy:** To keep work clean and reviewable:
  - Each team member is allocated one specific branch corresponding to their system component (`frontend`, `backend`, `database`, `api`, `documentation`).
  - No direct commits to `main` are allowed. Every feature must go through a pull request review.
  - Evelyn will host the `team_charter.md` within the `documentation` branch.
- **API Spec:** Dani presented the endpoints in `api.md`. The team agreed to version it as `v1` and use JWT token verification for all endpoints except ingestion and public login.

### Action Items
- [ ] **Bornface Ndegwa:** Commit the team charter in the `documentation` branch and schedule the next sync.
- [ ] **Ntsako Baloyi:** Stub out the REST interface controllers in the `api` branch based on `api.md`.
- [ ] **Gladys Mutta:** Create TimescaleDB partition scripts on the `database` branch.
- [ ] **Obadiah Mutuku:** Setup the RabbitMQ consumer pipeline on the `backend` branch.
- [ ] **Jude Oduor:** Design mockups for the telemetry graph views on the `frontend` branch.
.
