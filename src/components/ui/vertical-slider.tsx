import { minutesToTime } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface VerticalSliderProps {
  options: number[];
  value: number;
  onChange: (value: number) => void;
}

export const VerticalSlider = ({ options, value, onChange }: VerticalSliderProps) => {
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  // Calcular el índice del valor seleccionado
  const selectedIndex = options.indexOf(value);

  // Manejar incremento
  const handleIncrement = () => {
    if (selectedIndex < options.length - 1) {
      setDirection('up');
      onChange(options[selectedIndex + 1]);
    }
  };

  // Manejar decremento
  const handleDecrement = () => {
    if (selectedIndex > 0) {
      setDirection('down');
      onChange(options[selectedIndex - 1]);
    }
  };

  return (
    <div className="relative w-16 h-auto flex flex-col items-center">
      <button type="button" onClick={handleDecrement} className="mb-2">
        <ChevronUp size={16} />
      </button>
      <div className="relative w-full h-8 flex items-center justify-center overflow-hidden">
        <motion.div
          key={value}
          initial={{ y: direction === 'up' ? 20 : -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction === 'up' ? -20 : 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute"
        >
          <div className="text-lg font-bold text-primary">
            {minutesToTime(value)}
          </div>
        </motion.div>
      </div>
      <button type="button" onClick={handleIncrement} className="mt-2">
        <ChevronDown size={16} />
      </button>
    </div>
  );
};