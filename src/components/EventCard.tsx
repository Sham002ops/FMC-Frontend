
import React from 'react';
import { Button } from "@/components/ui/button";

interface EventCardProps {
  title: string;
  price: number | string;
  coinCost?: number;
  date?: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, price, coinCost, date }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        {typeof price === 'number' ? (
          <div className="text-sm text-gray-600">${price}</div>
        ) : (
          <div className="text-sm font-semibold text-event-primary">{price}</div>
        )}
      </div>
      
      {date && (
        <div className="text-sm text-gray-500 mb-2">{date}</div>
      )}

      <div className="flex justify-between items-center mt-4">
        {coinCost && (
          <div className="text-sm font-medium">
            {coinCost} <span className="text-event-primary font-bold">COIN</span>
          </div>
        )}
        <Button 
          className="bg-event-primary hover:bg-event-dark text-white rounded-full px-4 py-1 text-sm h-8"
        >
          {coinCost ? `${coinCost} COIN` : 'Register'}
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
