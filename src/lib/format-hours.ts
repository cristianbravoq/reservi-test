export const hours = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

// funcion para asignar hora a la reserva
export const formatBookingTime = (e: string) : {initial: string, final: string} => {
  const [hours, minutes] = e.split(":").map(Number);

  const newStartHour = new Date();
  newStartHour.setHours(hours + 1, minutes);
  const newEndHour = new Date();
  newEndHour.setHours(hours + 2, minutes);

  const formatedStartdHour = newStartHour.toTimeString().slice(0, 5);
  const formatedEndHour = newEndHour.toTimeString().slice(0, 5);

  return {initial:  formatedStartdHour, final: formatedEndHour}
};