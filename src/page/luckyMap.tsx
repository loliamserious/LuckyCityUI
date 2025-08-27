import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  MapIcon, 
  UserCircleIcon, 
  StarIcon, 
  SparklesIcon, 
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { predictionService } from '../service/predictionService';
import WorldMap from '../asset/world.svg';
import type { City } from '../service/predictionService';
import { StaticMarker } from '../components/StaticMarker';
import { SelectionControl } from '../components/SelectionControl';
import { CitiesList } from '../components/CitiesList';

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

  const handleClose = () => {
    // Clear results
    setLuckyCities([]);
    setSelectedCity(null);
    setCurrentCityIndex(0);
    
    // Reset inputs
    setBirthDate(null);
    setSelectedCountry(null);
  };

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
      <SelectionControl
        birthDate={birthDate}
        selectedCountry={selectedCountry}
        isLoading={isLoading}
        showControl={luckyCities.length === 0}
        onBirthDateChange={setBirthDate}
        onCountryChange={setSelectedCountry}
        onSubmit={handleSubmit}
      />

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
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lucky Cities List */}
      {Array.isArray(luckyCities) && luckyCities.length > 0 && (
        <CitiesList
          cities={luckyCities}
          currentCityIndex={currentCityIndex}
          selectedCity={selectedCity}
          onClose={handleClose}
          onCitySelect={setSelectedCity}
          onIndexChange={setCurrentCityIndex}
        />
      )}
    </div>
  );
};

export default LuckyMap;