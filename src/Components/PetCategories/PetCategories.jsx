import React from 'react';
import { PawPrint, Cat, Dog, Fish, Rabbit, Bird } from 'lucide-react';

const categories = [
  { name: 'All', icon: <PawPrint className="w-6 h-6" /> },
  { name: 'Dog', icon: <Dog className="w-6 h-6" /> },
  { name: 'Cat', icon: <Cat className="w-6 h-6" /> },
  { name: 'Rabbit', icon: <Rabbit className="w-6 h-6" /> },
  { name: 'Fish', icon: <Fish className="w-6 h-6" /> },
  { name: 'Bird', icon: <Bird className="w-6 h-6" /> },
];

const PetCategories = ({ category, setCategory }) => {
  return (
    <section className="py-8 px-4 ">
      <h2 className="text-2xl font-bold text-center mb-6">
        Browse by Pet Type
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-5xl mx-auto">
        {categories.map((c, index) => (
          <button
            key={index}
            onClick={() => setCategory(c.name)}
            className={`flex flex-col items-center justify-center border rounded-xl p-4 shadow-sm transition-all duration-200 hover:bg-orange-100 ${
              category === c.name
                ? 'bg-orange-50 border-orange-400 text-orange-500'
                : ''
            }`}
          >
            <div className="text-orange-500">{c.icon}</div>
            <span className="mt-1 text-sm font-semibold">{c.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default PetCategories;
