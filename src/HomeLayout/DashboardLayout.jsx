import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import {
  FaTachometerAlt, // Dashboard / Home
  FaPlus, // Add Pets
  FaDog, // My Pets
  FaBullhorn, // Create Donation Campaign
  FaHandsHelping, // My Donation Campaigns
  FaEnvelopeOpenText, // Adoption Request
  FaDonate, // My Donation
  FaUserShield, // Admin
  FaHistory, // Payment History
  FaClock, // Pending Adoption
  FaChartPie, // Total Donations
} from 'react-icons/fa';
import Logo from '../Components/Logo/Logo';
import useUserRole from '../hooks/useUserRole';
import useAuth from '../hooks/useAuth';

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (!loading && !user) {
    navigate('/login');
    return null;
  }

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-orange-600 font-semibold'
      : 'hover:text-orange-600 transition-colors duration-200';

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar for small screens */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
        </div>

        <Outlet />
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay" />
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <Link to="/">
            <Logo />
          </Link>

          <li>
            <NavLink to="/dashboard" className={navLinkClass}>
              <FaTachometerAlt className="inline-block mr-2" />
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/addPets" className={navLinkClass}>
              <FaPlus className="inline-block mr-2" />
              Add Pets
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/myPets" className={navLinkClass}>
              <FaDog className="inline-block mr-2" />
              My Pets
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/createDonation" className={navLinkClass}>
              <FaBullhorn className="inline-block mr-2" />
              Create Donation Campaign
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/my-campaigns" className={navLinkClass}>
              <FaHandsHelping className="inline-block mr-2" />
              My Donation Campaigns
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/adoptions" className={navLinkClass}>
              <FaEnvelopeOpenText className="inline-block mr-2" />
              Adoption Request
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/myDonations" className={navLinkClass}>
              <FaDonate className="inline-block mr-2" />
              My Donation
            </NavLink>
          </li>

          {!roleLoading && role === 'admin' && (
            <>
              <li>
                <NavLink to="/dashboard/makeAdmin" className={navLinkClass}>
                  <FaUserShield className="inline-block mr-2" />
                  Admin
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/paymentHistory"
                  className={navLinkClass}
                >
                  <FaHistory className="inline-block mr-2" />
                  Payment History
                </NavLink>
              </li>

              <li>
                <NavLink to="/dashboard/pending-pets" className={navLinkClass}>
                  <FaClock className="inline-block mr-2" />
                  Pending Adoption
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/totalDonations"
                  className={navLinkClass}
                >
                  <FaChartPie className="inline-block mr-2" />
                  Total Donations
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
