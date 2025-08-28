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
      className="fixed bottom-4 sm:bottom-8 left-4 right-4 sm:left-0 sm:right-0 flex"
      style={{ 
        zIndex: 9999,
        justifyContent: 'center'
      }}
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: showControl ? 0 : 100,
        opacity: showControl ? 1 : 0
      }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:w-auto max-w-md sm:max-w-none">
        {/* Birthday Input */}
        <div className="flex flex-col">
          <div className="flex bg-white/90 backdrop-blur-sm rounded-xl shadow-lg" style={{ alignItems: 'center' }}>
            <CalendarIcon className="absolute left-3 h-5 w-5 text-mystic-400 z-10" />
            <DatePicker
              selected={birthDate}
              onChange={onBirthDateChange}
              placeholderText="Select your birthday"
              className="pl-10 h-[50px] w-[220px] px-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-mystic-500 text-base bg-transparent text-center"
              maxDate={new Date()}
              showYearDropdown
              dropdownMode="select"
            />
          </div>
          <p className="text-xs text-white/80 mt-2 text-center">We don't store your birthday</p>
        </div>

        {/* Country Select */}
        <div className="flex flex-col items-center">
          <div className="relative w-[220px] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center">
            <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-mystic-400 z-10" />
            <Select
              value={selectedCountry}
              onChange={onCountryChange}
              options={countryOptions}
              menuPlacement='top'
              placeholder="Select country"
              styles={{
                control: (base) => ({
                  ...base,
                  height: '50px',
                  paddingLeft: '2rem',
                  border: 'none',
                  borderRadius: '0.75rem',
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  textAlign: 'center',
                  '&:hover': {
                    border: 'none'
                  }
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: '2px 8px',
                  justifyContent: 'center'
                }),
                singleValue: (base) => ({
                  ...base,
                  textAlign: 'center'
                }),
                placeholder: (base) => ({
                  ...base,
                  textAlign: 'center'
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  paddingRight: '8px'
                })
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSubmit}
            disabled={isLoading}
            className="h-[50px] px-8 bg-gradient-to-r from-mystic-600 to-celestial-600 text-white rounded-xl flex space-x-2 hover:from-mystic-700 hover:to-celestial-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mystic-500 shadow-lg backdrop-blur-sm"
            style={{
              alignItems: 'center'
            }}
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
                <span className="font-medium">Find Lucky Cities</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};