// TreeVisual.tsx
export default function TreeVisual() {
  return (
    <div className="w-full flex justify-center bg-gradient-to-b from-white to-blue-100 pt-20 relative">
      <svg
        viewBox="0 0 200 400"
        className="w-[300px] h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Trunk */}
        <path
          d="M100 400 C90 250, 90 200, 100 100 C110 200, 110 250, 100 400"
          fill="#5D3A00"
        />

        {/* Left Branch */}
        <path
          d="M95 200 C60 180, 40 160, 30 140"
          stroke="#5D3A00"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right Branch */}
        <path
          d="M105 200 C140 180, 160 160, 170 140"
          stroke="#5D3A00"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Icons Positioned Over Branch Ends */}
      <div className="absolute top-[20%] left-[10%] text-center">
        <img src="/icons/biotech.svg" alt="Science for Life" className="w-10 h-10 mx-auto" />
        <p className="text-xs text-purple-700">Science for Life</p>
      </div>

      <div className="absolute top-[20%] right-[10%] text-center">
        <img src="/icons/education.svg" alt="Learn. Lead. Transform." className="w-10 h-10 mx-auto" />
        <p className="text-xs text-blue-700">Learn. Lead. Transform.</p>
      </div>

      {/* Add more icons similarly for other branches */}
    </div>
  );
}
