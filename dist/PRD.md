# Product Requirement Document: Adopt Pet Platform

## 1. Executive Summary
The Adopt Pet platform is a comprehensive digital solution designed to streamline the pet adoption and donation process. It connects animal shelters/foster families with potential adopters and facilitates crowdfunding for donation campaigns.

## 2. Target Audience
*   **Adopters:** Individuals or families looking to adopt pets.
*   **Shelters/Fosters:** Organizations or individuals listing pets available for adoption.
*   **Donors:** Users interested in contributing financially to pet-related campaigns.
*   **Administrators:** Platform managers overseeing listings, users, and donations.

## 3. Key Features
### 3.1 User Authentication
*   User registration/login via email, GitHub, and potentially other OAuth providers.
*   Secure JWT-based session management.

### 3.2 Pet Management
*   Browse pet listings (with search and filtering).
*   Detailed pet profiles.
*   Adoption application submission.

### 3.3 Donation Campaigns
*   Create, edit, and view donation campaigns.
*   Integrated payment processing for donations.

### 3.4 User Dashboard
*   View adoption status and donation history.
*   Manage user-created campaigns and pet listings.

### 3.5 Admin Dashboard
*   Manage pet listings (add/edit/delete).
*   User role management (promote users to admins).
*   Overview of total donations and platform metrics.

## 4. Technical Constraints
*   **Frontend:** React 19, Vite, Tailwind CSS, DaisyUI.
*   **Backend:** Node.js, Express, Supabase (Database/Auth), Stripe (Payments).
