import React from 'react';
import { 
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
  CircleStackIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface ElementIconProps {
  element: string;
  className?: string;
}

export const ElementIcon: React.FC<ElementIconProps> = ({ element, className = "h-5 w-5" }) => {
  switch (element) {
    case 'Wood':
      return <SparklesIcon className={className} />;
    case 'Fire':
      return <FireIcon className={className} />;
    case 'Earth':
      return <GlobeAltIcon className={className} />;
    case 'Metal':
      return <CircleStackIcon className={className} />;
    case 'Water':
      return <BeakerIcon className={className} />;
    default:
      return null;
  }
};
