import { useState, useEffect } from "react";

const LoginBackground = () => {
  const [circles, setCircles] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const generateCircles = () => {
      const newCircles = [];
      for (let i = 0; i < 5; i++) {
        newCircles.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 200 + 100,
          delay: Math.random() * 4,
        });
      }
      setCircles(newCircles);
    };

    generateCircles();
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden gradient-bg">
      {circles.map((circle, index) => (
        <div
          key={index}
          className="absolute rounded-full opacity-20 animate-pulse"
          style={{
            left: `${circle.x}%`,
            top: `${circle.y}%`,
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            background: "rgba(255, 255, 255, 0.2)",
            animationDelay: `${circle.delay}s`,
            animationDuration: "4s",
          }}
        />
      ))}
    </div>
  );
};

export default LoginBackground;
