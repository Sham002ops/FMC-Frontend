import React, { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

interface ProductCardProps {
  images?: string[];
  title?: string;
  price?: number;
  badge?: string;
  isFavorite?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  images = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80",
  ],
  title = 'Dunk High "Green Satin" Sneakers',
  price = 180.0,
  badge = "Best Seller",
  isFavorite = false,
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [favorite, setFavorite] = useState(isFavorite);
  const [isHovered, setIsHovered] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const button = buttonRef.current;
    const priceEl = priceRef.current;

    if (!card || !image || !button || !priceEl) return;

    // Initial entry animation
    const elements = [image, priceEl, button];
    elements.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      setTimeout(() => {
        el.style.transition =
          "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, i * 120);
    });

    // Hover tilt animation
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovered]);

  const handleDotClick = (index: number) => {
    setCurrentImage(index);
    if (imageRef.current) {
      imageRef.current.style.transform = "scale(0.95)";
      setTimeout(() => {
        if (imageRef.current) {
          imageRef.current.style.transform = "scale(1)";
        }
      }, 200);
    }
  };

  const handleFavoriteClick = () => {
    setFavorite(!favorite);
    const heart = document.querySelector(".heart-icon");
    if (heart) {
      heart.classList.add("animate-ping");
      setTimeout(() => heart.classList.remove("animate-ping"), 300);
    }
  };

  const handleBuyNow = () => {
    if (buttonRef.current) {
      buttonRef.current.style.transform = "scale(0.95)";
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.style.transform = "scale(1)";
        }
      }, 150);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Logo */}
        <div className="absolute top-6 left-6 z-10 bg-white rounded-xl p-3 shadow-lg">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="black">
            <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.04-2.477.563-.876 1.326-1.734 2.289-2.572C4.349 7.219 6.02 6.316 8.055 5.501c2.036-.815 4.047-1.223 6.032-1.223 1.456 0 2.588.317 3.396.952.808.635 1.212 1.535 1.212 2.7 0 .719-.205 1.572-.616 2.56-.41.988-.99 1.946-1.74 2.876-.75.93-1.653 1.775-2.71 2.536-1.058.76-2.225 1.344-3.502 1.752l-.168-.056c1.456-.616 2.679-.925 3.668-.925 1.12 0 1.933.392 2.437 1.177.317.504.41 1.143.28 1.918-.13.775-.476 1.6-1.04 2.477-.563.876-1.326 1.734-2.289 2.572-1.963 1.698-3.634 2.601-5.017 2.709v-1.12c.989-.205 2.018-.635 3.088-1.29 1.07-.654 2.073-1.477 3.012-2.468.938-.992 1.653-2.073 2.145-3.245L24 7.8z" />
          </svg>
        </div>

        {/* Image */}
        <div className="relative pt-12 pb-8 px-8">
          <div
            ref={imageRef}
            className="relative w-full h-80 flex items-center justify-center transition-transform duration-300"
          >
            <img
              src={images[currentImage]}
              alt={title}
              className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
            />
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentImage === index
                    ? "bg-emerald-500 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Badge + Favorite */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-emerald-500 font-semibold text-sm tracking-wide">
              {badge}
            </span>
            <button
              onClick={handleFavoriteClick}
              className="heart-icon transition-transform duration-200 hover:scale-110"
            >
              <Heart
                className={`w-6 h-6 ${
                  favorite ? "fill-red-500 text-red-500" : "text-red-500"
                }`}
              />
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {title}
          </h2>

          {/* Price + Button */}
          <div className="flex items-center justify-between gap-4">
            <div ref={priceRef}>
              <p className="text-sm text-gray-500 mb-1">Price</p>
              <p className="text-4xl font-bold text-emerald-500">
                ${price.toFixed(2)}
              </p>
            </div>
            <button
              ref={buttonRef}
              onClick={handleBuyNow}
              className="bg-gray-900 text-white px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-xl active:scale-95"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
