import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';
import type { City } from '../service/predictionService';

interface GlobeProps {
  isLoading: boolean;
  cities: City[];
  selectedCity: City | null;
  currentCityIndex: number;
  selectedCountry: { value: string; label: string } | null;
  onCitySelect: (city: City) => void;
  resetView?: boolean;
}

// Country coordinates for centering the view
const countryCoordinates: Record<string, { lat: number; lng: number; altitude: number }> = {
  US: { lat: 39.8283, lng: -98.5795, altitude: 1.5 },
  GB: { lat: 54.2361, lng: -2.0, altitude: 1.5 },
  CA: { lat: 56.1304, lng: -106.3468, altitude: 1.3 },
  AU: { lat: -25.2744, lng: 133.7751, altitude: 1.5 },
  JP: { lat: 36.2048, lng: 138.2529, altitude: 1.8 },
  KR: { lat: 35.9078, lng: 127.7669, altitude: 2.0 },
  SG: { lat: 1.3521, lng: 103.8198, altitude: 2.5 },
  CN: { lat: 35.8617, lng: 104.1954, altitude: 1.3 },
};

export const GlobeComponent: React.FC<GlobeProps> = ({
  isLoading,
  cities,
  selectedCity,
  currentCityIndex,
  selectedCountry,
  onCitySelect,
  resetView = false,
}) => {
  const globeRef = useRef<any>();
  const [points, setPoints] = useState<any[]>([]);
  const [arcs, setArcs] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight // Full screen height
  });

  // Initialize globe rotation
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = isLoading ? true : false;
      controls.autoRotateSpeed = 3.0;
      controls.enableZoom = !isLoading;
      controls.enablePan = !isLoading;
      controls.enableRotate = true;
      
      // Set initial camera position for better view
      globeRef.current.pointOfView({
        lat: 20,
        lng: 0,
        altitude: 2.5
      });
    }
  }, [isLoading]);

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight // Full screen height
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Custom point object for the globe
  useEffect(() => {
    if (cities.length > 0) {
      const newPoints = cities.map((city, index) => ({
        lat: city.latitude,
        lng: city.longitude,
        size: index === currentCityIndex ? 0.8 : 0.6,
        color: index === currentCityIndex ? '#FFA500' : '#FFD700',
        city: city,
      }));
      setPoints(newPoints);

      // Create connecting arcs between cities
      const newArcs = [];
      for (let i = 0; i < cities.length - 1; i++) {
        newArcs.push({
          startLat: cities[i].latitude,
          startLng: cities[i].longitude,
          endLat: cities[i + 1].latitude,
          endLng: cities[i + 1].longitude,
          color: '#FFD700',
          stroke: 0.3,
        });
      }
      setArcs(newArcs);

      // Create floating labels for cities positioned to the right of points
      const newLabels = cities.map((city, index) => ({
        lat: city.latitude,
        lng: city.longitude + 2, // Offset labels to the right (east) of the points
        text: city.city,
        color: index === currentCityIndex ? '#FFA500' : '#FFD700',
        size: index === currentCityIndex ? 1.4 : 1.1,
      }));
      setLabels(newLabels);

      // If we have a current city, center the view on it
      if (globeRef.current && !isLoading) {
        const currentCity = cities[currentCityIndex];
        globeRef.current.pointOfView({
          lat: currentCity.latitude,
          lng: currentCity.longitude,
          altitude: 1.2
        }, 1000);
      }
    } else {
      setPoints([]);
      setArcs([]);
      setLabels([]);
    }
  }, [cities, currentCityIndex, isLoading]);

  // Center view on selected country
  useEffect(() => {
    if (selectedCountry && globeRef.current && !isLoading && cities.length === 0) {
      const coords = countryCoordinates[selectedCountry.value];
      if (coords) {
        globeRef.current.pointOfView({
          lat: coords.lat,
          lng: coords.lng,
          altitude: coords.altitude
        }, 1000);
      }
    }
  }, [selectedCountry, isLoading, cities.length]);

  // Reset view when resetView prop changes
  useEffect(() => {
    if (resetView && globeRef.current) {
      globeRef.current.pointOfView({
        lat: 20,
        lng: 0,
        altitude: 2.5
      }, 1500);
    }
  }, [resetView]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0
      }}
    >
      <Globe
        ref={globeRef}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        showGlobe={true}
        pointsData={points}
        pointAltitude={0}
        pointRadius="size"
        pointColor="color"
        onPointClick={(point: any) => onCitySelect(point.city)}
        labelsData={labels}
        labelText="text"
        labelColor="color"
        labelSize="size"
        labelAltitude={0}
        labelDotRadius={0}
        labelDotOrientation="right"
        labelResolution={3}
        labelIncludeDot={true}
        arcsData={arcs}
        arcColor="color"
        arcStroke="stroke"
        arcAltitude={0.05}
        arcDashLength={0}
        arcDashGap={0}
        arcDashAnimateTime={4000}
        arcCircularResolution={64}
        atmosphereColor="#8B5CF6"
        atmosphereAltitude={0.25}
        showAtmosphere={true}
        width={dimensions.width}
        height={dimensions.height}
        enablePointerInteraction={!isLoading}
      />
    </motion.div>
  );
};