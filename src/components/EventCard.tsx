
import React from 'react';
import { Button } from "@/components/ui/button";

interface EventCardProps {
  title: string;
  price: number | string;
  PlayNow?: string;
  date?: string;
  image?: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, price, PlayNow, date, image }) => {
const gold = '#FFD700'; // Gold color for the price
const Elite = "#1242e0"
const Platinum = '#12e083'; // Platinum color for the price
  return (
    <div className="bg-slate-200 rounded-xl shadow-lg p-4 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        {typeof price === 'number' ? (
          <div className="text-sm text-gray-600">${price}</div>
        ) : (
          <div className="text-sm font-semibold bg-white px-1 py-0.5 rounded-sm"  style={{ color: price === 'Gold' ? gold : price === 'Elite' ? Elite : Platinum }}>
            {price}
          </div>
        )}
      </div>
       <div className={`rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white`}>
          <img src={image} alt={title} className="w-full h-48 object-cover" />
        </div>
      
      {date && (
        <div className="text-sm mt-2 text-gray-500 mb-2">{date}</div>
      )}

      <div className="flex justify-between items-center mt-2">
        {/* {PlayNow && (
          <div className="text-sm font-medium">
            {PlayNow} <span className="text-event-primary font-bold"></span>
          </div>
        )} */}
       
        <Button 
          className="bg-event-primary hover:bg-event-dark text-white rounded-full px-4 py-1 text-sm h-8"
        >
          {PlayNow ? `▷ JOIN` : 'Register'}
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
