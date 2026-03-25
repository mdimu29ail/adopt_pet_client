import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'; // react-router-dom ব্যবহার করুন
import { motion } from 'framer-motion';
import {
  FaTachometerAlt,
  FaPlus,
  FaDog,
  FaBullhorn,
  FaHandsHelping,
  FaEnvelopeOpenText,
  FaDonate,
  FaUserShield,
  FaHistory,
  FaClock,
  FaChartPie,
  FaBars,
  FaHome,
  FaSignOutAlt,
} from 'react-icons/fa';
import Logo from '../Components/Logo/Logo';
import useUserRole from '../hooks/useUserRole';
import useAuth from '../hooks/useAuth';

const DashboardLayout = () => {
  // ✅ বাগ ফিক্স: Object {} এর বদলে Array [] ব্যবহার করা হয়েছে
  const [role, roleLoading] = useUserRole();
  const { user, loading, logOut } = useAuth();
  const navigate = useNavigate();

  if (!loading && !user) {
    navigate('/login');
    return null;
  }

  // ইউজার মেনু লিস্ট
  const userLinks = [
    {
      path: '/dashboard',
      icon: <FaTachometerAlt />,
      label: 'Dashboard Home',
      exact: true,
    },
    { path: '/dashboard/addPets', icon: <FaPlus />, label: 'Add a Pet' },
    { path: '/dashboard/myPets', icon: <FaDog />, label: 'My Pets' },
    {
      path: '/dashboard/createDonation',
      icon: <FaBullhorn />,
      label: 'Create Campaign',
    },
    {
      path: '/dashboard/my-campaigns',
      icon: <FaHandsHelping />,
      label: 'My Campaigns',
    },
    {
      path: '/dashboard/adoptions',
      icon: <FaEnvelopeOpenText />,
      label: 'Adoption Requests',
    },
    {
      path: '/dashboard/myDonations',
      icon: <FaDonate />,
      label: 'My Donations',
    },
  ];

  // অ্যাডমিন মেনু লিস্ট
  const adminLinks = [
    {
      path: '/dashboard/makeAdmin',
      icon: <FaUserShield />,
      label: 'User Management',
    },
    {
      path: '/dashboard/pending-pets',
      icon: <FaClock />,
      label: 'Pending Adoptions',
    },
    {
      path: '/dashboard/paymentHistory',
      icon: <FaHistory />,
      label: 'Payment Logs',
    },
    {
      path: '/dashboard/totalDonations',
      icon: <FaChartPie />,
      label: 'Analytics & Stats',
    },
  ];

  // এক্টিভ এবং ইনএকটিভ লিংক স্টাইল
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
      isActive
        ? 'bg-[#37948b] text-white shadow-lg shadow-[#37948b44] translate-x-2'
        : 'text-gray-500 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-gray-800 hover:text-[#37948b]'
    }`;

  const handleSignOut = () => {
    logOut();
    navigate('/login');
  };

  return (
    <div className="drawer lg:drawer-open bg-[#FFFBF7] dark:bg-gray-950 font-sans">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* --- Main Content Area --- */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Mobile Navbar */}
        <div className="lg:hidden w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-sm">
          <label
            htmlFor="dashboard-drawer"
            className="p-2 text-[#37948b] bg-teal-50 dark:bg-gray-800 rounded-xl cursor-pointer"
          >
            <FaBars size={20} />
          </label>
          <div className="scale-75 origin-right">
            <Logo />
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="flex-1 w-full overflow-x-hidden">
          <Outlet />
        </div>
      </div>

      {/* --- Sidebar Area --- */}
      <div className="drawer-side z-[100]">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <aside className="bg-white dark:bg-gray-900 w-80 min-h-full flex flex-col border-r border-gray-100 dark:border-gray-800 shadow-2xl lg:shadow-none">
          {/* Logo & Close */}
          <div className="p-8 pb-4">
            <Link to="/" className="block w-fit">
              <Logo />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 no-scrollbar">
            <p className="px-6 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Main Menu
            </p>
            {userLinks.map((link, idx) => (
              <NavLink
                end={link.exact}
                key={idx}
                to={link.path}
                className={navLinkClass}
              >
                <span className="text-lg">{link.icon}</span> {link.label}
              </NavLink>
            ))}

            {/* Admin Section (Conditional) */}
            {!roleLoading && role === 'admin' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 space-y-2"
              >
                <p className="px-6 text-[10px] font-black uppercase tracking-widest text-[#37948b] mb-2 flex items-center gap-2">
                  <FaUserShield /> Admin Controls
                </p>
                {adminLinks.map((link, idx) => (
                  <NavLink key={idx} to={link.path} className={navLinkClass}>
                    <span className="text-lg">{link.icon}</span> {link.label}
                  </NavLink>
                ))}
              </motion.div>
            )}
          </div>

          {/* --- Bottom Profile & Actions --- */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-6 px-2">
              <img
                src={
                  user?.user_metadata?.avatar_url ||
                  'https://i.ibb.co/mJR657F/user-placeholder.png'
                }
                alt="Profile"
                className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-black text-gray-800 dark:text-white truncate">
                  {user?.user_metadata?.full_name ||
                    user?.displayName ||
                    'User'}
                </p>
                <p className="text-[10px] font-bold text-[#37948b] uppercase tracking-widest">
                  {role || 'Member'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-800 text-gray-500 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-gray-200 dark:border-gray-700 hover:text-[#37948b] transition-colors"
              >
                <FaHome /> Site
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-red-100 dark:border-red-800/30 hover:bg-red-500 hover:text-white transition-colors"
              >
                <FaSignOutAlt /> Exit
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Hide Scrollbar Style */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
