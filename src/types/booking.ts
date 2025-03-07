export interface IBooking {
  id: string;
  userId: string;
  date: string;
  timeSlot: ITimeSlot;
}

interface ITimeSlot {
  startMinutes: number;
  endMinutes: number;
}
