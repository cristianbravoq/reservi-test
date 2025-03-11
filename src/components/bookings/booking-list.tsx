import { useState } from "react";
import { IUser } from "@/types/user";

import {
  calculateBookingPosition,
  findUserForBooking,
  generateColor,
  groupConsecutiveBookings,
  minutesToTime,
} from "@/lib/utils";

import { deleteUserService, editUserService } from "@/services/user.service";

import useUserStore from "@/store/user-store";
import useBookingStore from "@/store/booking-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { CreateUserForm } from "../user/form/user-form";
import UserReservation from "../user/user-reservation";

export const BookingsList = () => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

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
    editUserService(editUser);
    setOpenEditDialog(false);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUserService(userId);
  };

  const userColors = users.reduce((acc, user) => {
    acc[user.phone] = generateColor(user.id);
    return acc;
  }, {} as Record<string, string>);

  return (
    <>
      <div className="flex">
        {/* Columna de horas */}
        <div className="w-min mr-4 text-right">
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
        <div className="relative flex-1 bg-gray-50 border border-gray-200 rounded-md">
          {groupedBookings.map((booking) => {
            const user = findUserForBooking(users, booking);
            if (!user) return null;

            const { top, height } = calculateBookingPosition(booking);

            return (
              <div
                key={booking.id}
                className={`absolute flex items-center left-0 right-0 ${generateColor(
                  booking.userId
                )} p-2 rounded-md shadow-md`}
                style={{ top: `${top}%`, height: `${height}%` }}
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
    </>
  );
};
