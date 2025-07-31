// TreeAnimation.tsx
import Lottie from "lottie-react";
import Tree2 from "../assets/tree7.gif"; // ⬅️ correct path if not using 'public'
import Tree3 from "../../assets/Tree No.7.mp4"; // ⬅️ correct path if not using 'public'

export default function TreeAnimation() {
  return (
    <div className="flex  justify-center items-center mt-20 ">




      <div className="relative h-[500px]  w-full bg-gray-50 rounded-full  flex justify-center items-center overflow-hidden">
 <div>
     <video autoPlay  muted playsInline
         className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[900px] rounded-full z-10 pointer-events-none">
    <source src={Tree3} type="video/webm" />
  </video>
 </div>

  
</div>

    </div>
  );
}




















      {/* <div className="w-[900px]">
        <Lottie animationData={animationData} loop={false} />
      </div> */}

      {/* <div className="relative h-[500px] w-full bg-white overflow-hidden">
  <img src={Tree2} alt="Growing Tree Animation" style={{ width: "100%", height: "auto" }} />

  <div className="relative z-20 text-center mt-20">
    <h1 className="text-3xl font-bold">Grow with Nature</h1>
    <p className="text-lg mt-2 text-gray-600">Nurture your roots and reach new heights.</p>
  </div>
</div> */}
