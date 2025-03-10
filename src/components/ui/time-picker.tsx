import { useState } from "react";
import { VerticalSlider } from "./vertical-slider";
import { ITimeSlot } from "@/types/booking";

interface TimePickerProps {
  onChange: (timeSlot: { startMinutes: number; endMinutes: number }) => void;
  timeSlot?: ITimeSlot;
}

export const TimePicker = ({ onChange, timeSlot }: TimePickerProps) => {
  const defaultStartTime = 480; // 8:00 AM
  const defaultEndTime = 510; // 8:30 AM

  const [startTime, setStartTime] = useState<number>(timeSlot?.startMinutes ?? defaultStartTime);
  const [endTime, setEndTime] = useState<number>(timeSlot?.endMinutes ?? defaultEndTime);

  // Generar opciones de tiempo en intervalos de 30 minutos
  const generateTimeOptions = () => {
    const options: number[] = [];
    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        options.push(hours * 60 + minutes);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Manejar cambio en la hora inicial
  const handleStartTimeChange = (minutes: number) => {
    setStartTime(minutes);
    if (minutes >= endTime) {
      const newEndTime = minutes + 30; // Asegurar intervalo mínimo de 30 minutos
      setEndTime(newEndTime);
      onChange({ startMinutes: minutes, endMinutes: newEndTime });
    } else {
      onChange({ startMinutes: minutes, endMinutes: endTime });
    }
  };

  // Manejar cambio en la hora final
  const handleEndTimeChange = (minutes: number) => {
    setEndTime(minutes);
    onChange({ startMinutes: startTime, endMinutes: minutes });
  };

  // Filtrar opciones de hora final para que sean superiores a la hora inicial
  const filteredEndTimeOptions = timeOptions.filter(
    (minutes) => minutes > startTime
  );

  return (
    <div className="flex w-full justify-evenly">
      {/* Deslizador para la hora inicial */}
      <div className="flex flex-col items-center">
        <label className="font-light text-sm">Hora Inicial</label>
        <VerticalSlider
          options={timeOptions}
          value={startTime}
          onChange={handleStartTimeChange}
        />
      </div>

      {/* Deslizador para la hora final */}
      <div className="flex flex-col items-center">
        <label className="font-light text-sm">Hora Final</label>
        <VerticalSlider
          options={filteredEndTimeOptions}
          value={endTime}
          onChange={handleEndTimeChange}
        />
      </div>
    </div>
  );
};
