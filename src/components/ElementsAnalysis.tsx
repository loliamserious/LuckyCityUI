import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { ElementIcon } from './ElementIcon';

interface ElementsAnalysisProps {
  elementsAnalysis: Record<string, number>;
  fourPillars: string;
}

const elementColors = {
  Wood: '#7FB069', // muted green (lower saturation)
  Fire: '#E07A7A', // muted red (lower saturation)
  Earth: '#B8956B', // muted brown (lower saturation)
  Metal: '#D4C373', // muted gold (lower saturation)
  Water: '#7A9CC6', // muted blue (lower saturation)
};

// Fallback colors with reduced saturation
const fallbackColors = ['#E07A7A', '#7A9CC6', '#7FB069', '#D4C373', '#B8956B'];

export const ElementsAnalysis: React.FC<ElementsAnalysisProps> = ({
  elementsAnalysis,
  fourPillars
}) => {
  const data = Object.entries(elementsAnalysis).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl h-full flex flex-col"
    >
      <div className="text-center mb-1">
        <h3 className="text-xs sm:text-sm font-semibold text-mystic-700">Your Elements</h3>
      </div>

      <div className="flex-1 flex items-center gap-2 h-full">
        {/* Pie Chart */}
        <div className="flex-1 h-48 lg:h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.map((item) => {
                  const total = Object.values(elementsAnalysis).reduce((a, b) => a + b, 0);
                  const percentage = Math.round((item.value / total) * 100);
                  return {
                    ...item,
                    percentage
                  };
                })}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius="60%"
                paddingAngle={2}
                dataKey="value"
                label={({ percentage }) => `${percentage}%`}
                labelLine={false}
              >
                {data.map((entry, index) => {
                  const color = elementColors[entry.name as keyof typeof elementColors] || fallbackColors[index % fallbackColors.length];
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={color}
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend - always on right side */}
        <div className="flex flex-col justify-center gap-1 flex-shrink-0">
          {data.map((entry, index) => {
            const color = elementColors[entry.name as keyof typeof elementColors] || fallbackColors[index % fallbackColors.length];
            return (
              <div key={entry.name} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-mystic-700 font-medium whitespace-nowrap">
                  {entry.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};