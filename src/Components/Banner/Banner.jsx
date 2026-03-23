import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const Banner = () => {
  return (
    <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false}>
      <div>
        <img
          src="https://i.ibb.co/NgysD7HD/Whats-App-Image-2025-07-14-at-22-03-47-3ef8f810.jpg"
          className="h-[450px] object-cover"
        />
      </div>
      <div>
        <img
          src="https://i.ibb.co/hJsVSCFy/Whats-App-Image-2025-07-14-at-22-03-47-d83eb7ce.jpg"
          className="h-[450px] object-cover"
        />
      </div>
      <div>
        <img
          src="https://i.ibb.co/DHM90R2M/Whats-App-Image-2025-07-14-at-22-03-48-6a60bafb.jpg"
          className="h-[450px] object-cover"
        />
      </div>
    </Carousel>
  );
};

export default Banner;
