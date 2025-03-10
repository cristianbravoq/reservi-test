import {
  calculateBookingPosition,
  findBookingsForHour,
  findUserForBooking,
  generateColor,
  groupConsecutiveBookings,
  minutesToTime,
} from "@/lib/utils";
import UserReservation from "../user/user-reservation";
import { useState } from "react";
import { TagsFilters } from "../filter/tags-filters";
import { IUser } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { CreateUserForm } from "../user/form/user-form";
import useUserStore from "@/store/user-store";
import useBookingStore from "@/store/booking-store";

export const BookingsList = () => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | undefined>();

  // Suscribirse a los cambios en los stores
  const users = useUserStore((state) => state.users);
  const bookings = useBookingStore((state) => state.bookings);

  // Aplanar el objeto bookings a un array de reservas y agrupar reservas consecutivas
  const allBookings = Object.values(bookings).flat();
  const groupedBookings = groupConsecutiveBookings(allBookings);

  // Generar las horas del día en intervalos de 1 hora
  const timeSlots = Array.from({ length: 24 }, (_, i) => i); // 0, 1, 2, ..., 23

  const handleEdit = (editUserEvent: IUser) => {
    if (editUserEvent.id === undefined) return;
    setEditingUser(editUserEvent);
    setOpenEditDialog(true);
  };

  const handleEditUser = (values: Omit<IUser, "id">) => {
    const editUser = {
      ...values,
      id: editingUser!.id,
    };
    useUserStore.getState().editUser(editUser); // Actualizar el store
    setOpenEditDialog(false);
  };

  const handleDeleteUser = (userId: string) => {
    useUserStore.getState().deleteUser(userId); // Actualizar el store
  };

  const userColors = users.reduce((acc, user) => {
    acc[user.phone] = generateColor(user.id);
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-4 w-full px-2 overflow-auto">
      <div className="hidden max-sm:block">
        <TagsFilters />
      </div>

      <div className="flex flex-wrap justify-between sm:sticky top-0 items-center bg-white rounded-sm p-1 my-1">
        <span className="px-2 text-sm">Buscar por usuario</span>
        <Select onValueChange={(value) => setSelectedUser(value)}>
          <SelectTrigger className="flex-1 text-xs">
            <SelectValue placeholder="Selecciona un usuario" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.phone}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex">
        {/* Columna de horas */}
        <div className="w-24 mr-4 text-right">
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="p-2 border-b border-gray-200 h-16 flex items-center justify-end"
            >
              {minutesToTime(hour * 60)}
            </div>
          ))}
        </div>

        {/* Columna de reservas */}
        <div className="flex-1 overscroll-y-auto">
          {timeSlots.map((hour) => {
            const bookingsForHour = findBookingsForHour(groupedBookings, hour);

            return (
              <div
                key={hour}
                className="p-2 border-b border-gray-200 h-16 relative"
              >
                {bookingsForHour.map((booking) => {
                  const user = findUserForBooking(users, booking);
                  if (!user) return null;

                  const { top, height } = calculateBookingPosition(
                    booking,
                    hour
                  );

                  return (
                    <div
                      key={booking.id}
                      className={`absolute flex left-0 right-0 ${generateColor(
                        booking.userId
                      )} p-2 rounded`}
                      style={{
                        top: `${top}%`,
                        height: `${height}%`,
                      }}
                    >
                      <UserReservation
                        user={user}
                        booking={booking}
                        userColors={userColors}
                        onHandleEdit={handleEdit}
                        onHandleDelete={handleDeleteUser}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dialog para editar usuario */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>
              Complete el formulario para editar el usuario.
            </DialogDescription>
          </DialogHeader>
          <CreateUserForm
            initialValues={editingUser!}
            onSubmit={handleEditUser}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};