import React from 'react';

const FormInput = ({
  type = 'text',
  name,
  placeholder,
  isTextArea = false,
}) => {
  const inputClasses =
    'w-full border-b-2 border-neutral-400 focus:border-black placeholder-neutral-600 outline-none py-2 duration-300';

  return isTextArea ? (
    <textarea
      name={name}
      placeholder={placeholder}
      rows="4"
      className={inputClasses}
    ></textarea>
  ) : (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={inputClasses}
    />
  );
};

function ContactUs() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row shadow-2xl rounded-xl overflow-hidden">
          {/* Left: Form */}
          <div className="w-full lg:w-2/5 p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8">Book Your Slot</h2>
            <form className="space-y-6">
              <FormInput name="name" placeholder="Name" />
              <FormInput
                type="email"
                name="email"
                placeholder="Email Address"
              />
              <FormInput name="subject" placeholder="Subject" />
              <FormInput name="message" placeholder="Message" isTextArea />
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-3/5 p-8 md:p-12">
            <h2 className="text-4xl md:text-5xl mb-6 font-extrabold leading-tight">
              We Are Always Available For You & Your Pets
            </h2>
            <p className="mb-6">
              Dui Faucitus In Ornare Quam Viverra. Proin Sagittis Nisl Rhoncus
              Mattis Rhoncus Urna.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">Address</h3>
                <p>Khulna, Dhaka, Bangladesh</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Contact</h3>
                <p>+00 123 456 789</p>
                <p>+000 1234 56789</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Email</h3>
                <p className="hover:text-cyan-700 transition-colors">
                  mdimuBahi@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
