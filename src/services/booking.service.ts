import { IBooking } from "@/types/booking";
import useBookingStore from "@/store/booking-store";
import { toast } from "@/hooks/use-toast";
import { isOverlapping } from "@/lib/utils";

const addBookingService = (newBooking: IBooking) => {
  const { bookings, addBooking } = useBookingStore.getState();
  const existingBookings = bookings[newBooking.date] || [];

  const hasOverlap = existingBookings.some((existingBooking) => {
    return isOverlapping(
      newBooking.timeSlot.startMinutes,
      newBooking.timeSlot.endMinutes,
      existingBooking.timeSlot.startMinutes,
      existingBooking.timeSlot.endMinutes
    );
  });

  if (hasOverlap) {
    toast({
      title: "Error",
      description: "Este horario ya no está disponible",
    });
    return false;
  }

  addBooking(newBooking);
  toast({
    title: "Éxito",
    description: "Reserva añadida con éxito.",
  });
  return true;
};

const editBookingService = (bookingId: string, updatedBooking: Partial<IBooking>) => {
  const { editBooking } = useBookingStore.getState();

  editBooking(bookingId, updatedBooking);
  toast({
    title: "Éxito",
    description: "Reserva editada con éxito.",
  });
};

const deleteBookingService = (bookingId: string) => {
  const { deleteBooking } = useBookingStore.getState();
  
  deleteBooking(bookingId);
  toast({
    title: "Éxito",
    description: "Reserva eliminada con éxito.",
  });
};

const getBookingsByDateService = (date: string): IBooking[] => {
  const { getBookingsByDate } = useBookingStore.getState();
  return getBookingsByDate(date);
};

export { addBookingService, editBookingService, deleteBookingService, getBookingsByDateService };