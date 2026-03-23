import React from 'react';
import NavBar from '../Components/NavBar/NavBar';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer/Footer';
import Container from '../Container/Container';

const HomeLayout = () => {
  return (
    <div className="">
      <NavBar></NavBar>
      <div className="h-full min-h-screen">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default HomeLayout;
