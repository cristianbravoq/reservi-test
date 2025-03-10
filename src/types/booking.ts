export interface IBooking {
  id: string;
  userId: string;
  date: string;
  timeSlot: ITimeSlot;
}

export interface ITimeSlot {
  startMinutes: number;
  endMinutes: number;
}
