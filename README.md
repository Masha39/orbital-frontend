# Orbital Frontend

A Next.js dashboard application for visualizing credit usage data from Orbital Copilot. The dashboard displays credit consumption across messages and reports with interactive charts, tables, and statistics.

## Features

- **Credit Usage Dashboard**: View total credits used, message counts, and average credits per message
- **Interactive Charts**: Visualize credit consumption over time with customizable time ranges
- **Usage Table**: Detailed breakdown of credit usage by message with sorting capabilities
- **Data**: Fetches data from the backend API with React Query caching

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm/bun)
- Backend API running (see [Backend Setup](#connecting-to-backend))

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## Connecting to Backend

This frontend connects to the [Orbital Backend](https://github.com/Masha39/orbital-backend) FastAPI service.

### Backend Setup

1. Clone and set up the backend repository:
   ```bash
   git clone https://github.com/Masha39/orbital-backend.git
   cd orbital-backend
   pip install -r requirements.txt
   ```

2. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   
   The backend will run on `http://127.0.0.1:8000`

### Frontend Configuration

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

The frontend will automatically fetch usage data from the backend's `/usage` endpoint.

### API Endpoint

The frontend expects the backend to provide a `GET /usage` endpoint that returns:

```json
{
  "usage": [
    {
      "message_id": 1000,
      "timestamp": "2024-04-29T02:08:29.375Z",
      "report_name": "Tenant Obligations Report",
      "credits_used": 79.0
    }
  ]
}
```

- `report_name` is optional and only included if the message has a report
- `credits_used` is always present (minimum 1.0)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
