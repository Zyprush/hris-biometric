import React from 'react';
import { IconType } from 'react-icons';

interface CardData {
  title: string;
  icon: IconType;
  value: number;
}

interface CardProps {
  cardData: CardData[];
}

const shades = [
  "#114A55",
  "#135D66",
  "#157179",
  "#17858C",
  "#1A99A0"
];

const hoverColors = [
  "#2196F3",
  "#FFC107",
  "#4CAF50",
  "#F44336",
  "#9C27B0"
];

const CardComponent: React.FC<CardProps> = ({ cardData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
      {cardData.map(({ title, icon: Icon, value }, index) => (
        <div
          key={index}
          className="group relative w-full rounded-lg p-5 transition duration-300 cursor-pointer hover:translate-y-[3px]"
          style={{ backgroundColor: shades[index % shades.length] }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
            style={{ boxShadow: `0 -8px 0px 0px ${hoverColors[index % hoverColors.length]}` }}
          ></div>
          <div className="relative z-10">
            <p className="text-white text-2xl">{value}</p>
            <p className="text-white text-sm">{title}</p>
            <Icon
              className="group-hover:opacity-100 absolute right-[2%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300 ml-5"
              size={36}
              color="#ffffff"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardComponent;
