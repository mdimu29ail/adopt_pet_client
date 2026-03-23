import React from 'react';
import { HeartHandshake } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg mt-10">
      {/* Background Image */}
      <img
        src="https://i.ibb.co/HpFYZJFT/Whats-App-Image-2025-07-14-at-22-03-47-a96fd604.jpg" // You can replace with any inspiring pet image
        alt="Happy Adopted Pet"
        className="absolute inset-0 object-cover w-full h-full"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-4">
        <div className="text-white max-w-2xl space-y-5">
          <HeartHandshake className="mx-auto w-12 h-12 text-orange-400" />
          <h2 className="text-3xl md:text-4xl font-bold">Be Their Hero</h2>
          <p className="text-lg md:text-xl">
            Every pet deserves a loving home. You can make the difference.
          </p>
          <a
            href="/petListing"
            className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Adopt Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
