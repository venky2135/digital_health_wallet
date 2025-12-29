# Digital Health Wallet

A secure application for storing, managing, and sharing medical reports and tracking vitals.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Authentication**: JWT, Bcrypt

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Backend Setup
1. Navigate to the `digital-health-wallet` directory (or `server` if separated).
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node index.js
   ```
   The server runs on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the `client` directory.
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The app runs on `http://localhost:3000`.

## API Documentation

### Auth
- `POST /api/auth/register`: Register a new user. Body: `{ username, password }`
- `POST /api/auth/login`: Login. Body: `{ username, password }`

### Reports
- `POST /api/reports/upload`: Upload a report. Form-data: `report` (file), `type`, `date`, `vitals` (JSON string). Headers: `Authorization: Bearer <token>`
- `GET /api/reports`: Get all reports. Headers: `Authorization: Bearer <token>`
- `GET /api/reports/:id/download`: Download a report. Headers: `Authorization: Bearer <token>`

### Vitals
- `POST /api/vitals`: Add vital reading. Body: `{ type, value, date }`. Headers: `Authorization: Bearer <token>`
- `GET /api/vitals`: Get vitals history. Query: `type`. Headers: `Authorization: Bearer <token>`

### Shares
- `POST /api/shares/share`: Share a report. Body: `{ reportId, sharedWithEmail, permission }`. Headers: `Authorization: Bearer <token>`

## Features
- User Authentication
- Report Upload (PDF/Images)
- Vitals Tracking & Visualization
- Secure File Storage
- Access Sharing

## 📐 Architecture Diagram

```mermaid
graph TD
    Client[Client (ReactJS)] <-->|REST API (JSON)| Server[Backend Server (Node.js/Express)]
    Server <-->|SQL Queries| DB[(Database (SQLite))]
    Server <-->|File I/O| Storage[File Storage (Local 'uploads/')]
    
    subgraph "Backend System"
        Server
        DB
        Storage
    end
```

**Components:**
- **Client (ReactJS)**: Handles UI, user interactions, and API calls via Axios.
- **Backend Server (Node.js)**: Manages business logic, authentication, and API routing.
- **Database (SQLite)**: Stores user data, report metadata, vitals, and sharing permissions.
- **File Storage**: Local filesystem (`uploads/` folder) is used for simplicity and privacy. In a production cloud environment, this would be replaced by object storage like AWS S3.

## 🔐 Security Considerations

- **User Data Protection**:
    - Passwords are hashed using `bcryptjs` before storage, ensuring they are never stored in plain text.
    - User sessions are stateless and managed via JSON Web Tokens (JWT).
- **Access Control**:
    - **Authentication**: Every API request to protected routes requires a valid JWT in the `Authorization` header.
    - **Authorization**: 
        - Users can only access their own reports and vitals.
        - Shared reports are accessible only if a valid entry exists in the `shares` table linking the report to the requester's email.
- **Secure File Uploads**:
    - Files are stored with a timestamp prefix to prevent filename collisions.
    - Access to the `uploads/` directory is restricted via the backend API; direct file access is not exposed without authentication.

