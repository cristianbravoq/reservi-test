import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IBooking } from "../types/booking";

interface IBookingState {
  bookings: Record<string, IBooking[]>;
  addBooking: (booking: IBooking) => void;
  editBooking: (bookingId: string, updatedBooking: Partial<IBooking>) => void;
  deleteBooking: (bookingId: string) => void;
  getBookingsByDate: (date: string) => IBooking[];
}

const useBookingStore = create<IBookingState>()(
  persist(
    (set, get) => ({
      bookings: {},
      addBooking: (newBooking) => {
        set((state) => ({
          bookings: {
            ...state.bookings,
            [newBooking.date]: [...(state.bookings[newBooking.date] || []), newBooking],
          },
        }));
      },
      editBooking: (bookingId, updatedBooking) => {
        const { bookings } = get();

        const updatedBookings = bookings[updatedBooking.date!].map((booking) =>
          booking.id === bookingId ? { ...booking, ...updatedBooking } : booking
        );

        set((state) => ({
          bookings: {
            ...state.bookings,
            [updatedBooking.date!]: updatedBookings,
          },
        }));
      },
      deleteBooking: (bookingId) => {
        const { bookings } = get();

        const newBookings = Object.fromEntries(
          Object.entries(bookings).map(([date, bookings]) => [
            date,
            bookings.filter((booking) => booking.id !== bookingId),
          ])
        );

        set({ bookings: newBookings });
      },
      getBookingsByDate: (date) => get().bookings[date] || [],
    }),
    {
      name: "bookings-storage", // Nombre de la clave en localStorage
    }
  )
);

export default useBookingStore;
