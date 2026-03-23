import React from 'react';
import { Heart, Users, PawPrint } from 'lucide-react';

const AboutUs = () => {
  return (
    <section className=" py-16  mx-auto rounded-lg shadow-lg">
      <h2 className="text-4xl font-extrabold text-center text-orange-600 mb-10">
        About Us
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Left: Image */}
        <div className="flex-1">
          <img
            src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=600&q=80"
            alt="Happy adopted pets"
            className="rounded-lg shadow-lg h-80 w-full object-cover"
          />
        </div>

        {/* Right: Content */}
        <div className="flex-1 space-y-6">
          <p className=" text-lg leading-relaxed">
            We are passionate about connecting abandoned pets with loving
            families, giving every animal a second chance at a happy life. Our
            platform is built on compassion, transparency, and community
            support.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className=" rounded-xl p-6 shadow-2xl">
              <Heart className="mx-auto mb-3 w-8 h-8 text-red-500" />
              <h3 className="font-semibold text-lg ">Compassion</h3>
              <p className=" text-sm mt-1">
                We care deeply about every pet’s wellbeing.
              </p>
            </div>

            <div className=" rounded-xl p-6 shadow-2xl">
              <Users className="mx-auto mb-3 w-8 h-8 text-blue-500" />
              <h3 className="font-semibold text-lg ">Community</h3>
              <p className=" text-sm mt-1">
                Bringing people and pets together.
              </p>
            </div>

            <div className=" rounded-xl p-6 shadow-2xl">
              <PawPrint className="mx-auto mb-3 w-8 h-8 text-orange-500" />
              <h3 className="font-semibold text-lg ">Rescue</h3>
              <p className="text-sm mt-1">
                Saving pets and finding their forever homes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
