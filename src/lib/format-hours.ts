import { ITimeSlot } from "@/types/booking";

export const hours = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

export const generateTimeSlots = (interval: number): ITimeSlot[] => {
  const timeSlots: ITimeSlot[] = [];
  for (let i = 0; i < 24 * 60; i += interval) {
    timeSlots.push({ startMinutes: i, endMinutes: i + interval });
  }
  return timeSlots;
};

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};
