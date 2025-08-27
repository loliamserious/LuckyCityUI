import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { City } from '../service/predictionService';

interface CitiesListProps {
  cities: City[];
  currentCityIndex: number;
  selectedCity: City | null;
  onClose: () => void;
  onCitySelect: (city: City | null) => void;
  onIndexChange: (index: number) => void;
}

export const CitiesList: React.FC<CitiesListProps> = ({
  cities,
  currentCityIndex,
  selectedCity,
  onClose,
  onCitySelect,
  onIndexChange,
}) => {
  return (
    <motion.div
      key="cities-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 max-w-lg w-full mx-4"
    >
      <motion.button
        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-mystic-100 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
      >
        <XMarkIcon className="h-6 w-6 text-mystic-600" />
      </motion.button>
      <div className="text-center mb-4">
        <motion.h2 
          className="text-xl font-bold bg-gradient-to-r from-mystic-600 to-celestial-600 bg-clip-text text-transparent"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Your Lucky Cities ✨
        </motion.h2>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            className={`p-2 rounded-full ${currentCityIndex === 0 ? 'text-mystic-300' : 'text-mystic-600 hover:bg-mystic-100'} transition-colors`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onIndexChange(Math.max(0, currentCityIndex - 1))}
            disabled={currentCityIndex === 0}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </motion.button>
          <span className="text-sm text-mystic-500">
            {currentCityIndex + 1} of {cities.length}
          </span>
          <motion.button
            className={`p-2 rounded-full ${currentCityIndex === cities.length - 1 ? 'text-mystic-300' : 'text-mystic-600 hover:bg-mystic-100'} transition-colors`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onIndexChange(Math.min(cities.length - 1, currentCityIndex + 1))}
            disabled={currentCityIndex === cities.length - 1}
          >
            <ChevronRightIcon className="h-6 w-6" />
          </motion.button>
        </div>
        
        <div className="relative overflow-hidden" style={{ height: '200px' }}>
          {cities[currentCityIndex] && (
            <motion.div
              key={currentCityIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`p-4 rounded-xl bg-white/50 hover:bg-mystic-50 transition-all cursor-pointer absolute w-full`}
              onClick={() => onCitySelect(selectedCity?.city === cities[currentCityIndex].city ? null : cities[currentCityIndex])}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-mystic-700">
                  {cities[currentCityIndex].city}
                </span>
                <div className="flex items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-mystic-600 to-celestial-600 bg-clip-text text-transparent">
                    {cities[currentCityIndex].rate}%
                  </span>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm text-mystic-600 leading-relaxed">{cities[currentCityIndex].reason}</p>
              </motion.div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          {cities.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${index === currentCityIndex ? 'bg-mystic-600' : 'bg-mystic-200'}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onIndexChange(index)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
