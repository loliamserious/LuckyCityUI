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
import type { City, PredictionResponse } from '../service/predictionService';
import { SelectionControl } from '../components/SelectionControl';
import { CitiesList } from '../components/CitiesList';
import { GlobeComponent } from '../components/Globe';

const LuckyMap: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const { user, logout } = useAuth();
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<PredictionResponse | null>(null);
  const [luckyCities, setLuckyCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [resetGlobeView, setResetGlobeView] = useState(false);

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
      const result = await predictionService.getPrediction({
        birthday: birthDate,
        country: selectedCountry.value,
      });

      setResponse(result);
      setLuckyCities(result.predictions);
      setCurrentCityIndex(0); // Reset to first city
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
    
    // Trigger globe view reset
    setResetGlobeView(true);
    // Reset the trigger after a short delay
    setTimeout(() => setResetGlobeView(false), 100);
  };

  const handleCitySelect = (city: City | null) => {
    setSelectedCity(city);
    if (city) {
      // Find and set the current index to match the selected city
      const index = luckyCities.findIndex(c => c.city === city.city);
      if (index !== -1) {
        setCurrentCityIndex(index);
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-mystic-50 to-celestial-50 overflow-hidden">
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
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center"
            >
              <div className="relative flex items-center">
                <MapIcon className="h-6 w-6 sm:h-8 sm:w-8 text-mystic-600" />
                <SparklesIcon className="h-3 w-3 sm:h-4 sm:w-4 text-celestial-400 absolute -top-1 -right-1 animate-twinkle" />
              </div>
              <h1 className="ml-2 text-lg sm:text-xl font-bold bg-gradient-to-r from-mystic-600 to-celestial-600 bg-clip-text text-transparent">
                Lucky City
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-2 sm:space-x-4"
            >
              <div className="hidden sm:flex items-center space-x-2">
                <UserCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-mystic-500" />
                <span className="text-sm sm:text-base text-mystic-700">Welcome, {user?.username} ✨</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm text-white bg-gradient-to-r from-mystic-600 to-celestial-600 hover:from-mystic-700 hover:to-celestial-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mystic-500 transition-all"
                style={{ height: 'fit-content' }}
              >
                <ArrowRightOnRectangleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
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

      {/* Globe Container - Full Screen Background */}
      <GlobeComponent
        isLoading={isLoading}
        cities={luckyCities}
        selectedCity={selectedCity}
        currentCityIndex={currentCityIndex}
        selectedCountry={selectedCountry}
        onCitySelect={handleCitySelect}
        resetView={resetGlobeView}
      />

      {/* Lucky Cities List */}
      {Array.isArray(luckyCities) && luckyCities.length > 0 && (
        <div className="relative z-50">
          <CitiesList
            cities={luckyCities}
            currentCityIndex={currentCityIndex}
            selectedCity={selectedCity}
            fourPillars={response?.four_pillars || ''}
            elementsAnalysis={response?.elements_analysis || {}}
            onClose={handleClose}
            onCitySelect={handleCitySelect}
            onIndexChange={setCurrentCityIndex}
          />
        </div>
      )}
    </div>
  );
};

export default LuckyMap;