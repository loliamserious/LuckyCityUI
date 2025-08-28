import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { City } from '../service/predictionService';
import { ElementIcon } from './ElementIcon';
import { ElementsAnalysis } from './ElementsAnalysis';
import { ShareButtons } from './ShareButtons';

interface CitiesListProps {
  cities: City[];
  currentCityIndex: number;
  selectedCity: City | null;
  fourPillars: string;
  elementsAnalysis: Record<string, number>;
  onClose: () => void;
  onCitySelect: (city: City | null) => void;
  onIndexChange: (index: number) => void;
}

const elementColors: Record<string, { text: string, bg: string, color: string }> = {
  Wood: { text: 'text-white', bg: 'bg-emerald-100', color: '#7FB069' },
  Fire: { text: 'text-white', bg: 'bg-red-100', color: '#E07A7A' },
  Earth: { text: 'text-white', bg: 'bg-amber-100', color: '#B8956B' },
  Metal: { text: 'text-white', bg: 'bg-gray-100', color: '#D4C373' },
  Water: { text: 'text-white', bg: 'bg-blue-100', color: '#7A9CC6' },
  // Lowercase versions to handle both cases
  wood: { text: 'text-white', bg: 'bg-emerald-100', color: '#7FB069' },
  fire: { text: 'text-white', bg: 'bg-red-100', color: '#E07A7A' },
  earth: { text: 'text-white', bg: 'bg-amber-100', color: '#B8956B' },
  metal: { text: 'text-white', bg: 'bg-gray-100', color: '#D4C373' },
  water: { text: 'text-white', bg: 'bg-blue-100', color: '#7A9CC6' },
};

export const CitiesList: React.FC<CitiesListProps> = ({
  cities,
  currentCityIndex,
  selectedCity,
  fourPillars,
  elementsAnalysis,
  onClose,
  onCitySelect,
  onIndexChange,
}) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-32 md:right-32 z-20 flex justify-center" style={{minHeight: 'calc(100vh - 800px)'}}>
      <motion.div
        key="cities-list"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl p-3 md:p-4 w-full max-w-7xl"
      >
        <motion.button
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-mystic-100 transition-colors z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6 text-mystic-600" />
        </motion.button>
        
        <div className="text-center mb-3">
          <motion.h2 
            className="text-lg font-bold bg-gradient-to-r from-mystic-600 to-celestial-600 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Your Lucky Cities ✨
          </motion.h2>
        </div>

        {/* Main Content - 60/40 Split on Desktop, Stacked on Mobile */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 h-full">
          {/* Cities List Section - 60% on desktop */}
          <div className="flex-1" style={{ flexBasis: '60%' }}>
            <div className="flex items-center justify-between mb-2">
              <motion.button
                className={`p-1.5 rounded-full ${currentCityIndex === 0 ? 'text-mystic-300' : 'text-mystic-600 hover:bg-mystic-100'} transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onIndexChange(Math.max(0, currentCityIndex - 1))}
                disabled={currentCityIndex === 0}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </motion.button>
              <span className="text-xs text-mystic-500">
                {currentCityIndex + 1} of {cities.length}
              </span>
              <motion.button
                className={`p-1.5 rounded-full ${currentCityIndex === cities.length - 1 ? 'text-mystic-300' : 'text-mystic-600 hover:bg-mystic-100'} transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onIndexChange(Math.min(cities.length - 1, currentCityIndex + 1))}
                disabled={currentCityIndex === cities.length - 1}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </motion.button>
            </div>
            
            <div className="relative overflow-hidden flex-1">
              {cities[currentCityIndex] && (
                <motion.div
                  key={currentCityIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex gap-4 p-3 rounded-xl bg-white/40 hover:bg-mystic-50/50 transition-all cursor-pointer h-full"
                  onClick={() => onCitySelect(selectedCity?.city === cities[currentCityIndex].city ? null : cities[currentCityIndex])}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold text-mystic-700">
                        {cities[currentCityIndex].city}
                      </span>
                      <span className="text-xl font-bold bg-gradient-to-r from-mystic-600 to-celestial-600 bg-clip-text text-transparent">
                        {cities[currentCityIndex].rate}%
                      </span>
                    </div>
                    <p className="text-xs text-mystic-600 leading-relaxed mb-2 line-clamp-2">
                      {cities[currentCityIndex].reason}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div className="flex flex-wrap gap-1">
                        {cities[currentCityIndex].dominant_elements.map((element, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              elementColors[element]?.text || 'text-white'
                            } flex items-center space-x-1`}
                            style={{
                              backgroundColor: elementColors[element]?.color || '#7FB069'
                            }}
                          >
                            <ElementIcon element={element} className="h-3 w-3" />
                            <span>{element}</span>
                          </span>
                        ))}
                      </div>
                      
                      {/* Share Buttons */}
                      <div className="flex justify-end sm:justify-start">
                        <ShareButtons
                          city={cities[currentCityIndex].city}
                          rate={cities[currentCityIndex].rate}
                          reason={cities[currentCityIndex].reason}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex justify-center mt-2">
              {cities.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full mx-0.5 ${index === currentCityIndex ? 'bg-mystic-600' : 'bg-mystic-200'}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onIndexChange(index)}
                />
              ))}
            </div>
          </div>

          {/* Elements Analysis Section - 40% on desktop */}
          <div className="w-full lg:flex-shrink-0 lg:w-auto" style={{ flexBasis: '40%' }}>
            <ElementsAnalysis 
              elementsAnalysis={elementsAnalysis}
              fourPillars={fourPillars}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};