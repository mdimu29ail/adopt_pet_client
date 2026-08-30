# Engineering Guidelines

## 1. Coding Standards
*   **Style:** Strict adherence to ESLint and Prettier rules.
*   **Component Structure:** Functional components with React Hooks.
*   **Language:** TypeScript (ensure proper typing throughout the codebase).

## 2. Project Structure
*   **`src/Components/`:** Reusable UI components.
*   **`src/Pages/`:** View-level components mapping to routes.
*   **`src/hooks/`:** Custom hooks for data fetching (`useAxios`, `useAuth`).
*   **`src/Auth/`:** Authentication logic and Context providers.

## 3. State Management
*   Global state (Auth) via React Context.
*   Server state (API data) via TanStack Query.
*   Avoid prop-drilling; use context or state management tools appropriately.

## 4. API Handling
*   Use `axios` for all backend requests.
*   Use `useAxiosSecure` hook for protected requests requiring JWT authentication.

## 5. Deployment
*   Frontend: Vercel/Netlify.
*   Backend: Node.js deployment platform (e.g., Render, Vercel).
