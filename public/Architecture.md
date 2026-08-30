# System Architecture

## 1. Overview
The Adopt Pet platform follows a decoupled client-server architecture, enabling scalability and independent development.

## 2. Components
### 2.1 Client Application
*   **Framework:** React 19 (Vite)
*   **State Management:** React Context API (Auth), TanStack Query (API data).
*   **Styling:** Tailwind CSS + DaisyUI.
*   **Routing:** React Router.

### 2.2 Server Application
*   **Framework:** Node.js + Express
*   **API Pattern:** REST API.
*   **Authentication:** JWT, Firebase/Supabase Auth.
*   **Database:** Supabase (PostgreSQL).

## 3. Data Flow
1.  **Request:** The Client sends a request to the Express Server (API) or directly to Supabase.
2.  **Auth Check:** Express validates JWT tokens for protected routes.
3.  **Database:** Server interacts with Supabase for CRUD operations.
4.  **Response:** Server returns JSON data to the Client.
5.  **UI Update:** React updates the state (TanStack Query/Context) and re-renders components.

## 4. Third-Party Integrations
*   **Supabase:** Primary Database and Auth provider.
*   **Stripe:** Payment processing for donations.
*   **GitHub:** OAuth authentication.
