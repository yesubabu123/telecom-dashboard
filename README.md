# Telecom Pulse Dashboard

A custom MERN-stack telecom operations dashboard built to monitor SIM inventory, provider performance, and network quality metrics.

## What makes this project unique

- React dashboard with live operational metrics and provider filtering
- Express API with MongoDB-backed SIM telemetry and provider summary endpoints
- Custom SIM model fields for provider, region, throughput, and alert level
- Interactive table with phone, provider, region, throughput, latency, signal, and action controls
- Resume-ready project with clear system architecture and measurable performance data

## Features

- SIM inventory API (`GET /api/sim`, `GET /api/sim/:phoneNumber`)
- Telecom health summary endpoint (`GET /api/sim/summary`)
- Search by phone number or owner name with partial matching
- Block SIMs unused for 5+ months using the dashboard action
- Phone availability and block status based on user preferences
- Realistic network speeds, throughput, latency, and signal values
- Bar chart for throughput trends and live health score indicator

## Run locally

1. Backend
   ```bash
   cd backend
   npm install
   node server.js
   ```
2. Seed sample telecom data
   ```bash
   cd backend
   npm run seed
   ```
3. Frontend
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Tech stack

- React
- Express
- MongoDB / Mongoose
- Axios
- Chart.js

## Resume highlight

`Telecom Pulse Dashboard` demonstrates end-to-end MERN development, backend API design, data modeling for telecom SIM assets, and rich dashboard visualization for real-world network operations.
