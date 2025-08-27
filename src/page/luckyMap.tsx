import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  MapIcon, 
  UserCircleIcon, 
  StarIcon, 
  SparklesIcon, 
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  GlobeAltIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import { predictionService } from '../service/predictionService';

import WorldMap from '../asset/world.svg';
import type { City } from '../service/predictionService';

// Function to convert lat/lng to x/y coordinates on the map
const latLngToPixel = (lat: number, lng: number, mapWidth: number, mapHeight: number) => {
  // Convert latitude to y coordinate (Mercator projection)
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
  const y = (mapHeight / 2) - (mapHeight * mercN / (2 * Math.PI));
  
  // Convert longitude to x coordinate (linear)
  const x = (lng + 180) * (mapWidth / 360);
  
  return { x, y };
};

// List of countries
const countryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'SG', label: 'Singapore' },
  { value: 'CN', label: 'China' },
];

const LuckyMap: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const { user, logout } = useAuth();
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [luckyCities, setLuckyCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);


  const handleLogout = () => {
    logout();
    toast.success('See you next time! ✨');
  };

  const handleSubmit = async () => {
    if (!birthDate || !selectedCountry) {
      toast.error('Please select both birthday and country');
      return;
    }

    setIsLoading(true);
    try {
      const response = await predictionService.getPrediction({
        birthday: birthDate,
        country: selectedCountry.value,
      });

      setLuckyCities(response.predictions);
      toast.success('✨ Your lucky cities have been revealed!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get predictions. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
      setLuckyCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Marker component with animations
  // Static map marker component
const StaticMarker: React.FC<{ city: City; index: number; mapWidth: number; mapHeight: number }> = ({ city, index, mapWidth, mapHeight }) => {
  const isSelected = selectedCity?.city === city.city;
  // Convert lat/lng to percentage coordinates
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
        onClick={() => setSelectedCity(city)}
      >
        {index + 1}
      </motion.div>
    </motion.div>
  );
};

  // Cities list component

  const CitiesList = () => (
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
        onClick={() => {
          // Clear results
          setLuckyCities([]);
          setSelectedCity(null);
          setCurrentCityIndex(0);
          
          // Reset inputs
          setBirthDate(null);
          setSelectedCountry(null);
        }}
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
            onClick={() => setCurrentCityIndex(prev => Math.max(0, prev - 1))}
            disabled={currentCityIndex === 0}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </motion.button>
          <span className="text-sm text-mystic-500">
            {currentCityIndex + 1} of {luckyCities.length}
          </span>
          <motion.button
            className={`p-2 rounded-full ${currentCityIndex === luckyCities.length - 1 ? 'text-mystic-300' : 'text-mystic-600 hover:bg-mystic-100'} transition-colors`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentCityIndex(prev => Math.min(luckyCities.length - 1, prev + 1))}
            disabled={currentCityIndex === luckyCities.length - 1}
          >
            <ChevronRightIcon className="h-6 w-6" />
          </motion.button>
        </div>
        
        <div className="relative overflow-hidden" style={{ height: '200px' }}>
          {luckyCities[currentCityIndex] && (
            <motion.div
              key={currentCityIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`p-4 rounded-xl bg-white/50 hover:bg-mystic-50 transition-all cursor-pointer absolute w-full`}
              onClick={() => setSelectedCity(selectedCity?.city === luckyCities[currentCityIndex].city ? null : luckyCities[currentCityIndex])}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-mystic-700">
                  {luckyCities[currentCityIndex].city}
                </span>
                <div className="flex items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-mystic-600 to-celestial-600 bg-clip-text text-transparent">
                    {luckyCities[currentCityIndex].rate}%
                  </span>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm text-mystic-600 leading-relaxed">{luckyCities[currentCityIndex].reason}</p>
              </motion.div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          {luckyCities.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${index === currentCityIndex ? 'bg-mystic-600' : 'bg-mystic-200'}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentCityIndex(index)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-mystic-50 to-celestial-50">
      {/* Floating stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <StarIcon
            key={i}
            className={`absolute h-4 w-4 text-mystic-400 animate-twinkle`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative bg-white/80 backdrop-blur-sm z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center"
            >
              <div className="relative flex items-center">
                <MapIcon className="h-8 w-8 text-mystic-600" />
                <SparklesIcon className="h-4 w-4 text-celestial-400 absolute -top-1 -right-1 animate-twinkle" />
              </div>
              <h1 className="ml-2 text-xl font-bold bg-gradient-to-r from-mystic-600 to-celestial-600 bg-clip-text text-transparent">
                Lucky City
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-6 w-6 text-mystic-500" />
                <span className="text-mystic-700">Welcome, {user?.username} ✨</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-xl text-sm text-white bg-gradient-to-r from-mystic-600 to-celestial-600 hover:from-mystic-700 hover:to-celestial-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mystic-500 transition-all"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Logout
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Selection Controls */}
      <motion.div 
        className="absolute top-1/2 left-1/2 z-20"
        initial={{ x: '-50%', y: '-50%' }}
        animate={{
          x: '-50%',
          y: '-50%',
          opacity: luckyCities.length > 0 ? 0 : 1
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 space-y-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-mystic-700 mb-2">Find Your Lucky Cities ✨</h2>
            <p className="text-sm text-mystic-500">Discover where your stars align</p>
          </div>

          <div className="flex flex-col space-y-6">
            <div className="flex flex-col items-center relative mb-8">
              <div className="flex items-center">
                <CalendarIcon className="absolute left-3 h-5 w-5 text-mystic-400" />
                <DatePicker
                  selected={birthDate}
                  onChange={(date) => setBirthDate(date)}
                  placeholderText="Select your birthday"
                  className="pl-10 h-[42px] w-[240px] px-4 border border-mystic-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mystic-500 focus:border-transparent text-base"
                  maxDate={new Date()}
                  showYearDropdown
                  dropdownMode="select"
                />
              </div>
              <p className="absolute -bottom-6 text-xs text-mystic-400 whitespace-nowrap">We don't store your birthday</p>
            </div>

            <div className="relative h-[42px] mt-4">
              <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-mystic-400 z-10" />
              <Select
                value={selectedCountry}
                onChange={(option) => {
                  setSelectedCountry(option);
                }}
                options={countryOptions}
                className="w-[240px]"
                placeholder="Select country"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: '42px',
                    paddingLeft: '2rem',
                    borderColor: '#ddd6fe',
                    borderRadius: '0.75rem',
                    '&:hover': {
                      borderColor: '#8b5cf6'
                    }
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: '2px 8px'
                  })
                }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-[42px] mt-2 bg-gradient-to-r from-mystic-600 to-celestial-600 text-white rounded-xl flex items-center justify-center space-x-2 hover:from-mystic-700 hover:to-celestial-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mystic-500"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5" />
                  <span>Find Lucky Cities</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Map Container */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div className="relative w-full h-full">
          {/* World map with mystical theme */}
          <div className="w-full h-full relative bg-gradient-to-br from-mystic-900/5 to-celestial-900/5">
              <img 
                src={WorldMap}
                alt="World Map"
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  opacity: 0.9,
                  filter: 'brightness(0.9) contrast(1.1) drop-shadow(0 0 2px rgba(139, 92, 246, 0.3))',
                  transition: 'all 0.5s ease-in-out',
                  paddingTop: '3rem',
                  paddingRight: '6rem'
                }}
              />

          </div>
          
          {/* Markers */}
          <div className="absolute inset-0">
            {Array.isArray(luckyCities) && luckyCities?.map((city, index) => (
              <StaticMarker
                key={city.city}
                city={city}
                index={index}
                mapWidth={1000}  // Fixed width for calculation
                mapHeight={500}  // Fixed height for calculation
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lucky Cities List */}
      {Array.isArray(luckyCities) && luckyCities.length > 0 && <CitiesList />}
    </div>
  );
};

export default LuckyMap;