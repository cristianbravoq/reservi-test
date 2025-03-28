import { IBooking } from "@/types/booking";
import { IUser } from "@/types/user";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDateDisabled = (date: Date) => {
  const today = new Date();
  return date < today;
};

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

export const isOverlapping = (
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean => {
  return start1 < end2 && start2 < end1;
};

// Función hash simple para convertir una cadena en un número
const hashStringToNumber = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

// Función para generar un color único basado en el ID del usuario
export const generateColor = (id: string): string => {
  const colors = [
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-pink-200",
    "bg-purple-200",
    "bg-indigo-200",
    "bg-red-200",
    "bg-teal-200",
    "bg-orange-200",
    "bg-cyan-200",
  ];

  const hash = hashStringToNumber(id);
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

// Función para calcular la posición y altura de una reserva dentro de una hora
export const calculateBookingPosition = (booking: IBooking): { top: number; height: number } => {
  const { startMinutes, endMinutes } = booking.timeSlot;
  const totalMinutesInDay = 24 * 60;

  const top = (startMinutes / totalMinutesInDay) * 100; // Posición relativa en %
  const height = ((endMinutes - startMinutes) / totalMinutesInDay) * 100; // Altura relativa en %

  return { top, height };
};

// Función para encontrar el usuario asociado a una reserva
export const findUserForBooking = (
  users: IUser[],
  booking: IBooking
): IUser | undefined => {
  return users.find((user) => user.id === booking.userId);
};

export const groupConsecutiveBookings = (bookings: IBooking[]): IBooking[] => {
  const groupedBookings: IBooking[] = [];
  let currentGroup: IBooking | null = null;

  // Ordenar las reservas por hora de inicio
  const sortedBookings = [...bookings].sort(
    (a, b) => a.timeSlot.startMinutes - b.timeSlot.startMinutes
  );

  sortedBookings.forEach((booking) => {
    if (
      currentGroup &&
      currentGroup.userId === booking.userId &&
      currentGroup.timeSlot.endMinutes >= booking.timeSlot.startMinutes
    ) {
      // Extender el bloque actual si las reservas se superponen o son consecutivas
      currentGroup.timeSlot.endMinutes = Math.max(
        currentGroup.timeSlot.endMinutes,
        booking.timeSlot.endMinutes
      );
    } else {
      // Crear un nuevo bloque
      if (currentGroup) groupedBookings.push(currentGroup);
      currentGroup = { ...booking };
    }
  });

  if (currentGroup) groupedBookings.push(currentGroup);
  return groupedBookings;
};
