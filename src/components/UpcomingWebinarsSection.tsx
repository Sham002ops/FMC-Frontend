'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const topics = [
  {
    title: "Yoga & Meditation",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop",
    description: "Discover techniques for mindfulness and physical wellness",
    color: "bg-purple-500",
  },
  {
    title: "Biotechnology",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=400&auto=format&fit=crop",
    description: "Learn about the latest advances in biotechnology research",
    color: "bg-blue-500",
  },
  {
    title: "Mental Wellness",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=400&auto=format&fit=crop",
    description: "Explore strategies for better mental health and wellbeing",
    color: "bg-green-500",
  },
  {
    title: "Ayurveda",
    image: "https://rukminim3.flixcart.com/image/850/1000/xif0q/poster/p/i/l/small-poster-doctors-poster-natural-healing-ayurveda-wall-poster-original-imah38gyxxdnuhnk.jpeg?q=90&crop=false",
    description: "Discover ancient healing practices for modern wellness",
    color: "bg-amber-500",
  },
  {
    title: "Artificial Intelligence",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&auto=format&fit=crop",
    description: "Understand AI applications in various industries",
    color: "bg-red-500",
  },
  {
    title: "Sustainable Living",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=400&auto=format&fit=crop",
    description: "Learn practical ways to live more sustainably",
    color: "bg-teal-500",
  },
];

export default function UpcomingWebinars() {
  return (
    <div id='webinars' className="w-full py-16 bg-white text-center">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Upcoming Webinars</h2>
      <p className="text-gray-600 mb-12 text-lg">Explore our upcoming webinars and expand your knowledge across various fields</p>

      <div className="px-4 md:px-16">
        <Swiper
          modules={[EffectCoverflow]}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 2.5,
            slideShadows: false,
          }}
          className="max-w-7xl mx-auto"
        >
          {topics.map((topic, idx) => (
            <SwiperSlide
              key={idx}
              className="w-[300px] sm:w-[350px] lg:w-[400px] group transition-all duration-300"
            >
              <div className="overflow-hidden rounded-2xl shadow-lg relative group-hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img
                    src={topic.image}
                    alt={topic.title}
                    className="w-full h-60 object-cover group-hover:scale-[1.03] transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <span className={`absolute top-4 left-4 px-3 py-1 text-sm text-white rounded-full ${topic.color} shadow backdrop-blur-sm`}>
                    {topic.title}
                  </span>
                </div>

                <div className="bg-white px-5 py-4 text-left">
                  <h3 className="text-lg font-bold text-gray-800">{topic.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{topic.description}</p>
                  <button className="mt-4 border border-violet-500 text-violet-500 px-4 py-2 rounded-lg hover:bg-violet-500 hover:text-white transition duration-200">
                    Register Now
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
