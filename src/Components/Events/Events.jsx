import React, { useState, useEffect } from 'react';
import { events as eventsData } from './EventsData.js';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setEvents(eventsData);
      setLoading(false);
    }, 1500); // 1.5s delay for demo

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="border rounded-2xl shadow-md p-4 animate-pulse"
            >
              <Skeleton height={192} className="rounded-xl" />
              <Skeleton height={24} width={`60%`} className="mt-3" />
              <Skeleton height={16} width={`80%`} className="mt-1" />
              <Skeleton height={40} className="mt-2" />
            </div>
          ))
        : events.map(event => (
            <div key={event.id} className="border rounded-2xl shadow-md p-4">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-48 object-cover rounded-xl"
              />
              <h2 className="text-xl font-semibold mt-3">{event.title}</h2>
              <p className="text-sm ">
                📅 {event.date} | 📍 {event.location}
              </p>
              <p className="mt-2">{event.description}</p>
            </div>
          ))}
    </div>
  );
};

export default Events;
