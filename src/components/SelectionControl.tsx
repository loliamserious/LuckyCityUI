import React from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { CalendarIcon, GlobeAltIcon, SparklesIcon } from '@heroicons/react/24/outline';
import 'react-datepicker/dist/react-datepicker.css';

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

interface SelectionControlProps {
  birthDate: Date | null;
  selectedCountry: any;
  isLoading: boolean;
  showControl: boolean;
  onBirthDateChange: (date: Date | null) => void;
  onCountryChange: (option: any) => void;
  onSubmit: () => void;
}

export const SelectionControl: React.FC<SelectionControlProps> = ({
  birthDate,
  selectedCountry,
  isLoading,
  showControl,
  onBirthDateChange,
  onCountryChange,
  onSubmit
}) => {
  return (
    <motion.div 
      className="absolute top-1/2 left-1/2 z-20"
      initial={{ x: '-50%', y: '-50%' }}
      animate={{
        x: '-50%',
        y: '-50%',
        opacity: showControl ? 1 : 0
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
                onChange={onBirthDateChange}
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
              onChange={onCountryChange}
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
            onClick={onSubmit}
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
  );
};
