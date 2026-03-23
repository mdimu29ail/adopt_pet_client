import React from 'react';
import Container from '../Container/Container';

import Banner from '../Components/Banner/Banner';

import CallToAction from '../Components/CallToAction/CallToAction';

import PetList from '../Components/PetCategories/PetList';
import AboutUs from '../Components/AboutUs/AboutUs';
import PetSittingHero from '../Components/PetSittingHero/PetSittingHero';
import Testimonials from '../Components/Testimonials/Testimonials';
import ContactUs from '../Components/ContactUs/ContactUs';

const Home = () => {
  return (
    <div>
      <Container>
        <Banner></Banner>
        <PetList></PetList>
        <CallToAction></CallToAction>
        <AboutUs></AboutUs>
        <PetSittingHero></PetSittingHero>
        <Testimonials></Testimonials>
        <ContactUs></ContactUs>
      </Container>
    </div>
  );
};

export default Home;
