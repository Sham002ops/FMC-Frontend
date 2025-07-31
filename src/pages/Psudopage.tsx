import { useEffect } from "react";
import { motion } from "framer-motion";
import { TreeDeciduous } from "lucide-react";


export default function Psudopage() {
  useEffect(() => {
    // Optional: handle scroll animation logic if using custom JS
  }, []);

  const sections = [
    {
      title: "Yoga",
      caption: "Balance the Inner Self",
      icon: "/icons/meditation.svg",
      color: "text-green-500",
    },
    {
      title: "Education",
      caption: "Learn. Lead. Transform.",
      icon: "/icons/education.svg",
      color: "text-blue-500",
    },
    {
      title: "Biotech",
      caption: "Science for Life",
      icon: "/icons/biotech.svg",
      color: "text-purple-500",
    },
    {
      title: "Power",
      caption: "Empowering Tomorrow",
      icon: "/icons/power.svg",
      color: "text-yellow-500",
    },
    {
      title: "Wealth",
      caption: "Prosperity Through Purpose",
      icon: "/icons/wealth.svg",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-green-100 min-h-screen text-gray-800 font-sans">
      {/* NavBar */}
      <header className="flex justify-between items-center p-4 shadow-md sticky top-0 bg-white z-50">
        <h1 className="text-2xl font-bold text-blue-900">Finite Marshall Club</h1>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-orange-600 transition">Explore Programs</button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20 px-4 bg-[url('/background-light.svg')] bg-cover">
        <h2 className="text-4xl md:text-5xl font-semibold text-blue-900 mb-4">Holistic Progress Through Innovation</h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-xl">Uniting wellness, knowledge, and technology to empower every individual.</p>
        <img src="/tree.svg" alt="Spiritual Tree" className="w-80 mt-10" />
      </section>






      <div>
        <TreeDeciduous />
      </div>



      <div>


        -----------------------------------------------------

        {/* <TreeAnimation2/> */}
        -----------------------------------------------------


















        {/* --------------------------------------------- */}
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-8 mt-20">
        <p className="text-sm">© 2025 Finite Marshall Club. All rights reserved.</p>
      </footer>
    </div>
  );
}
