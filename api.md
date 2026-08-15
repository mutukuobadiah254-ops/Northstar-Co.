# EcoSync API Specification (v1)

This document describes the REST API endpoints and payload structures for EcoSync version 1. All request and response bodies are JSON.

---

## 1. Authentication

### 1.1 Authenticate User
Authenticate a team member or customer to retrieve a JWT access token.

- **URL:** `/api/v1/auth/login`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "user@ecosync.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "d98f73b2-65a8-4e81...",
    "expiresIn": 3600
  }
  ```

---

## 2. Telemetry Ingestion

### 2.1 Ingest Meter Telemetry
Submit consumption records from an authorized smart meter.

- **URL:** `/api/v1/telemetry/submit`
- **Method:** `POST`
- **Headers:** 
  - `Content-Type: application/json`
  - `X-Meter-Token: secret-device-token`
- **Request Body:**
  ```json
  {
    "meterId": "met_87a932d0b5e2",
    "timestamp": "2026-08-15T17:33:00Z",
    "voltage": 230.2,
    "current": 4.35,
    "activePowerKw": 1.001,
    "cumulativeKwh": 14205.82
  }
  ```
- **Response (202 Accepted):**
  ```json
  {
    "status": "accepted",
    "message": "Telemetry point queued for processing."
  }
  ```

---

## 3. Analytics & Queries

### 3.1 Get Live Telemetry
Retrieve the latest telemetry reading for a device (primarily for WebSocket fallback or poll widgets).

- **URL:** `/api/v1/meters/:meterId/live`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response (200 OK):**
  ```json
  {
    "meterId": "met_87a932d0b5e2",
    "lastUpdated": "2026-08-15T17:33:55Z",
    "currentActivePowerKw": 1.005,
    "currentKwh": 14205.83
  }
  ```

### 3.2 Get Historical Aggregates
Retrieve aggregated telemetry for consumption visualizations.

- **URL:** `/api/v1/meters/:meterId/historical`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Query Parameters:**
  - `start`: ISO 8601 timestamp (e.g., `2026-08-15T00:00:00Z`)
  - `end`: ISO 8601 timestamp (e.g., `2026-08-15T23:59:59Z`)
  - `resolution`: Aggregation window (`5m`, `1h`, `1d`)
- **Response (200 OK):**
  ```json
  {
    "meterId": "met_87a932d0b5e2",
    "resolution": "1h",
    "dataPoints": [
      {
        "bucket": "2026-08-15T17:00:00Z",
        "avgActivePowerKw": 0.985,
        "totalEnergyKwh": 0.985
      },
      {
        "bucket": "2026-08-15T18:00:00Z",
        "avgActivePowerKw": 1.020,
        "totalEnergyKwh": 1.020
      }
    ]
  }
  ```
.
