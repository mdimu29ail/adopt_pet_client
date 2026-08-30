# Frontend CRUD Operations (Non-Supabase Explicit)

These files handle CRUD operations by calling the backend API (`adopt_pet_server`), which then performs the direct Supabase database operations.

- **Pet Management:**
  - `src/Pages/PetListing/PetListing.jsx`: Reads (GET), Deletes (DELETE)
  - `src/Pages/MyPets/MyPets.jsx`: Reads (GET)
  - `src/Pages/MyPets/PetDetails.jsx`: Reads (GET)
    `src/Pages/HomeDashboard/HomeDashboard.jsx`
  - `src/Pages/MyPets/AdoptForm.jsx`: Creates (POST)
  - `src/Pages/MyPets/AdoptionTable.jsx`: Reads (GET)

- **Donations & Campaigns:**
  - `src/Pages/DonationCampaigns/MyDonations.jsx`: Reads (GET)
  - `src/Pages/DonationCampaigns/MyDonationCampaigns.jsx`: Reads (GET), Deletes (DELETE)
  - `src/Pages/Payment/Payment.jsx`: Creates (POST)

- **User & Admin Actions:**
  - `src/Pages/MakeAdmin/MakeAdmin.jsx`: Updates (PATCH)
  - `src/PrivateRouter/Admin/TotalDonationsAdmin.jsx`: Reads (GET)

*Note: These files use the `useAxios` or `useAxiosSecure` hooks to communicate with the backend, effectively offloading Supabase interactions to the server layer.*
