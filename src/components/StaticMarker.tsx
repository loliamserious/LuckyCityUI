import React from 'react';
import { motion } from 'framer-motion';
import type { City } from '../service/predictionService';

interface StaticMarkerProps {
  city: City;
  index: number;
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
}

export const StaticMarker: React.FC<StaticMarkerProps> = ({ 
  city, 
  index, 
  selectedCity,
  onSelectCity 
}) => {
  const isSelected = selectedCity?.city === city.city;
  const x = ((city.longitude + 180) / 360) * 100;
  const y = ((90 - city.latitude) / 180) * 100;
  
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.2, 1],
        opacity: 1,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        duration: 0.8,
        delay: index * 0.5,
        ease: "easeOut"
      }}
    >
      <motion.div 
        className={`w-8 h-8 ${
          isSelected 
            ? 'bg-gradient-to-r from-mystic-600 to-celestial-600 scale-125' 
            : 'bg-mystic-600'
        } rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg cursor-pointer hover:bg-mystic-700 transition-all duration-300`}
        whileHover={{ scale: 1.2 }}
        animate={{
          scale: isSelected ? 1.2 : 1,
          boxShadow: isSelected 
            ? '0 0 20px rgba(139, 92, 246, 0.5)'
            : '0 0 0px rgba(139, 92, 246, 0)'
        }}
        onClick={() => onSelectCity(city)}
      >
        {index + 1}
      </motion.div>
    </motion.div>
  );
};
