// import { createBrowserRouter, Route } from 'react-router';
// import HomeLayout from '../HomeLayout/HomeLayout';
// import LogIn from '../Pages/LogIn';
// import Register from '../Pages/Register';
// import Home from '../Pages/Home';
// import PetListing from '../Pages/PetListing/PetListing';
// import DashboardLayout from '../HomeLayout/DashboardLayout';
// import AddPet from '../Pages/AddPet/AddPet';
// import MyPets from '../Pages/MyPets/MyPets';
// import PetDetails from '../Pages/MyPets/PetDetails';
// import AdoptForm from '../Pages/MyPets/AdoptForm';
// import AdoptionTable from '../Pages/MyPets/AdoptionTable';
// import UpdatePet from '../Pages/UpdatePet/UpdatePet';
// import CreateCampaign from '../Pages/CreateCampaign/CreateCampaign';
// import MakeAdmin from '../Pages/MakeAdmin/MakeAdmin';
// import DonationCampaigns from '../Pages/DonationCampaigns/DonationCampaigns';
// import DonationDetails from '../Pages/DonationCampaigns/DonationDetails';

// import Forbidden from '../PrivateRouter/Forbidden/Forbidden';
// import AdminRoute from '../PrivateRouter/Admin/AdminRoute';
// import EditPetForm from '../Pages/PetListing/EditPetForm';
// import EditCampaignForm from '../Pages/DonationCampaigns/EditCampaignForm';
// import MyDonations from '../Pages/DonationCampaigns/MyDonations';
// import PendingPets from '../Pages/MyPets/PendingPets';
// import Payment from '../Pages/Payment/Payment';
// import PrivateRoute from '../PrivateRouter/PrivateRouter';
// import PaymentHistory from '../Pages/Payment/PaymentHistory';
// import TotalDonationsAdmin from '../PrivateRouter/Admin/TotalDonationsAdmin';
// import MyDonationCampaigns from '../Pages/DonationCampaigns/MyDonationCampaigns';
// import DashboardHome from '../Pages/HomeDashboard/HomeDashboard';
// import Blogs from '../Components/Blog/Blogs';
// import BlogDetails from '../Components/Blog/BlogDetails';
// import Events from '../Components/Events/Events';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <HomeLayout></HomeLayout>,
//     children: [
//       {
//         index: true,
//         element: <Home></Home>,
//       },
//       {
//         path: '/petListing',
//         element: <PetListing></PetListing>,
//       },
//       {
//         path: 'donationCampaigns',
//         element: <DonationCampaigns></DonationCampaigns>,
//       },
//       {
//         path: 'blogs',
//         element: (
//           <PrivateRoute>
//             <Blogs></Blogs>
//           </PrivateRoute>
//         ),
//       },
//       {
//         path: 'blog/:id',
//         element: (
//           <PrivateRoute>
//             <BlogDetails></BlogDetails>
//           </PrivateRoute>
//         ),
//       },

//       {
//         path: '/events',
//         element: (
//           <PrivateRoute>
//             <Events></Events>
//           </PrivateRoute>
//         ),
//       },

//       {
//         path: '/donations/:id',
//         element: (
//           <PrivateRoute>
//             {' '}
//             <DonationDetails></DonationDetails>
//           </PrivateRoute>
//         ),
//       },

//       {
//         path: 'donate/:id',
//         element: (
//           <PrivateRoute>
//             <Payment></Payment>
//           </PrivateRoute>
//         ),
//       },
//       {
//         path: '/forbidden',
//         Component: Forbidden,
//       },
//       {
//         path: '/updatePets/:id',
//         element: (
//           <PrivateRoute>
//             <UpdatePet></UpdatePet>
//           </PrivateRoute>
//         ),
//       },
//     ],
//   },
//   {
//     path: '/login',
//     element: <LogIn></LogIn>,
//   },
//   {
//     path: '/register',
//     element: <Register></Register>,
//   },

//   {
//     path: '/dashboard',
//     element: (
//       <PrivateRoute>
//         <DashboardLayout></DashboardLayout>
//       </PrivateRoute>
//     ),
//     children: [
//       {
//         path: '/dashboard',
//         element: (
//           <PrivateRoute>
//             <DashboardHome></DashboardHome>
//           </PrivateRoute>
//         ),
//       },
//       {
//         path: '/dashboard/myPets',
//         element: (
//           <PrivateRoute>
//             <MyPets></MyPets>
//           </PrivateRoute>
//         ),
//       },
//       {
//         path: '/dashboard/pets/:id',
//         element: (
//           <PrivateRoute>
//             <PetDetails></PetDetails>
//           </PrivateRoute>
//         ),
//       },
//       {
//         path: '/dashboard/adopt/:id',
//         element: (
//           <PrivateRoute>
//             <AdoptForm></AdoptForm>
//           </PrivateRoute>
//         ),
//       },

//       {
//         path: '/dashboard/adoptions',
//         element: (
//           <PrivateRoute>
//             <AdoptionTable></AdoptionTable>
//           </PrivateRoute>
//         ),
//       },
//       {
//         path: '/dashboard/makeAdmin',
//         element: (
//           <AdminRoute>
//             <MakeAdmin></MakeAdmin>,
//           </AdminRoute>
//         ),
//       },

//       {
//         path: '/dashboard/addPets',
//         element: (
//           <PrivateRoute>
//             <AddPet></AddPet>
//           </PrivateRoute>
//         ),
//       },
//       {
//         path: '/dashboard/createDonation',
//         element: (
//           <PrivateRoute>
//             <CreateCampaign></CreateCampaign>
//           </PrivateRoute>
//         ),
//       },
//       {
//         path: '/dashboard/edit-pet/:id',
//         element: (
//           <PrivateRoute>
//             <EditPetForm></EditPetForm>
//           </PrivateRoute>
//         ),
//       },
//       {
//         path: '/dashboard/edit-campaign/:id',
//         element: (
//           <PrivateRoute>
//             <EditCampaignForm></EditCampaignForm>
//           </PrivateRoute>
//         ),
//       },

//       {
//         path: '/dashboard/myDonations',
//         element: (
//           <PrivateRoute>
//             <MyDonations></MyDonations>
//           </PrivateRoute>
//         ), // protect with AdminRoute
//       },
//       {
//         path: '/dashboard/pending-pets',
//         element: (
//           <AdminRoute>
//             <PendingPets></PendingPets>
//           </AdminRoute>
//         ), // protect with AdminRoute
//       },
//       {
//         path: '/dashboard/paymentHistory',
//         element: (
//           <AdminRoute>
//             <PaymentHistory></PaymentHistory>
//           </AdminRoute>
//         ),
//       },
//       {
//         path: '/dashboard/totalDonations',
//         element: (
//           <AdminRoute>
//             <TotalDonationsAdmin></TotalDonationsAdmin>
//           </AdminRoute>
//         ),
//       },
//       {
//         path: '/dashboard/my-campaigns',
//         element: (
//           <PrivateRoute>
//             <MyDonationCampaigns></MyDonationCampaigns>
//           </PrivateRoute>
//         ),
//       },
//     ],
//   },
// ]);
// export default router;
import { createBrowserRouter } from 'react-router-dom';
import HomeLayout from '../HomeLayout/HomeLayout';
import LogIn from '../Pages/LogIn';
import Register from '../Pages/Register';
import Home from '../Pages/Home';
import PetListing from '../Pages/PetListing/PetListing';
import DashboardLayout from '../HomeLayout/DashboardLayout';
import AddPet from '../Pages/AddPet/AddPet';
import MyPets from '../Pages/MyPets/MyPets';
import PetDetails from '../Pages/MyPets/PetDetails';
import AdoptForm from '../Pages/MyPets/AdoptForm';
import AdoptionTable from '../Pages/MyPets/AdoptionTable';
import UpdatePet from '../Pages/UpdatePet/UpdatePet';
import CreateCampaign from '../Pages/CreateCampaign/CreateCampaign';
import MakeAdmin from '../Pages/MakeAdmin/MakeAdmin';
import DonationCampaigns from '../Pages/DonationCampaigns/DonationCampaigns';
import DonationDetails from '../Pages/DonationCampaigns/DonationDetails';
import Forbidden from '../PrivateRouter/Forbidden/Forbidden';
import AdminRoute from '../PrivateRouter/Admin/AdminRoute';
import EditPetForm from '../Pages/PetListing/EditPetForm';
import EditCampaignForm from '../Pages/DonationCampaigns/EditCampaignForm';
import MyDonations from '../Pages/DonationCampaigns/MyDonations';
import PendingPets from '../Pages/MyPets/PendingPets';
import Payment from '../Pages/Payment/Payment';
import PrivateRoute from '../PrivateRouter/PrivateRouter';
import PaymentHistory from '../Pages/Payment/PaymentHistory';
import TotalDonationsAdmin from '../PrivateRouter/Admin/TotalDonationsAdmin';
import MyDonationCampaigns from '../Pages/DonationCampaigns/MyDonationCampaigns';
import DashboardHome from '../Pages/HomeDashboard/HomeDashboard';
import Blogs from '../Components/Blog/Blogs';
import BlogDetails from '../Components/Blog/BlogDetails';
import Events from '../Components/Events/Events';
import EventDetails from '../Components/Events/EventDetails';

// রুটগুলোকে ক্যাটাগরি অনুযায়ী সাজানো হয়েছে যাতে বুঝতে সুবিধা হয়
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'petListing', element: <PetListing /> },
      { path: 'donationCampaigns', element: <DonationCampaigns /> },
      {
        path: 'blogs',
        element: (
          <PrivateRoute>
            <Blogs />
          </PrivateRoute>
        ),
      },
      {
        path: 'blogs/:id', // 'blog' এর বদলে 'blogs' লিখুন
        element: (
          <PrivateRoute>
            <BlogDetails />
          </PrivateRoute>
        ),
      },
      {
        path: 'events',
        element: (
          <PrivateRoute>
            <Events />
          </PrivateRoute>
        ),
      },
      {
        path: 'events/:id',
        element: <EventDetails />,
      },
      {
        path: 'donations/:id',
        element: (
          <PrivateRoute>
            <DonationDetails />
          </PrivateRoute>
        ),
      },
      {
        path: 'donate/:id',
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
      {
        path: 'updatePets/:id',
        element: (
          <PrivateRoute>
            <UpdatePet />
          </PrivateRoute>
        ),
      },
      { path: 'forbidden', element: <Forbidden /> },
    ],
  },

  // Auth Routes (লগইন এবং রেজিস্ট্রেশন পেজগুলোকে আলাদা রাখা হয়েছে)
  { path: '/login', element: <LogIn /> },
  { path: '/register', element: <Register /> },

  // Dashboard Routes (সবগুলো Private এবং Admin ক্যাটাগরিতে বিভক্ত)
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },

      // User Dashboard Routes
      { path: 'myPets', element: <MyPets /> },
      { path: 'pets/:id', element: <PetDetails /> },
      { path: 'adopt/:id', element: <AdoptForm /> },
      { path: 'adoptions', element: <AdoptionTable /> },
      { path: 'addPets', element: <AddPet /> },
      { path: 'createDonation', element: <CreateCampaign /> },
      { path: 'myDonations', element: <MyDonations /> },
      { path: 'my-campaigns', element: <MyDonationCampaigns /> },
      { path: 'edit-pet/:id', element: <EditPetForm /> },
      { path: 'edit-campaign/:id', element: <EditCampaignForm /> },

      // Admin Only Routes
      {
        path: 'makeAdmin',
        element: (
          <AdminRoute>
            <MakeAdmin />
          </AdminRoute>
        ),
      },
      {
        path: 'pending-pets',
        element: (
          <AdminRoute>
            <PendingPets />
          </AdminRoute>
        ),
      },
      {
        path: 'paymentHistory',
        element: (
          <AdminRoute>
            <PaymentHistory />
          </AdminRoute>
        ),
      },
      {
        path: 'totalDonations',
        element: (
          <AdminRoute>
            <TotalDonationsAdmin />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
