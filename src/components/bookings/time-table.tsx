import * as React from "react";

import { hours } from "@/lib/format-hours";

import useBookingStore from "@/store/booking-store";
import useUserStore from "@/store/user-store";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { toast } from "@/hooks/use-toast";
import { CreateUserForm } from "@/components/user/form/user-form";
import { handleEditUser } from "@/components/header/utils";
import { deleteUserService } from "@/services/user.service";
import { deleteAllBookingsByUserService } from "@/services/booking.service";
import { generateUserColors } from "@/lib/generate-row-colors";
import UserReservation from "../user/user-reservation";
import { IUser } from "@/types/user";
import { IBooking } from "@/types/booking";
import { getUserByPhoneNumber } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TagsFilters } from "../filter/tags-filters";

export const TimeTable: React.FC = () => {
  // dia siguiente al actual
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const [selectedUser, setSelectedUser] = React.useState<string | undefined>();
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<IUser | null>(null);

  const bookings = useBookingStore((state) => state.bookings);
  const users = useUserStore((state) => state.users);

  const userColors = React.useMemo(() => generateUserColors(users), [users]);

  const filteredBookings = bookings.filter(
    (booking) => new Date(booking.startTime).toDateString() === date.toDateString()
  );

  const handleEdit = (booking: IBooking) => {
    const user = getUserByPhoneNumber(booking.userId, users);
    if (user) {
      setEditingUser(user);
      setOpenEditDialog(true);
    }
  };

  // Sacar estas funciones aparte, para solo llamar una funcion que maneja los errores y
  // los mensajes de exito
  const onHandleEditUser = (values: any) => {
    try {
      handleEditUser(values, users);
      setOpenEditDialog(false);

      toast({
        title: "Success",
        description: "Usuario editado con éxito",
      });
    } catch {
      toast({
        title: "Error",
        description: "Error al editar un usario",
      });
    }
  };

  const onHandleDelete = (value: string) => {
    toast({
      title: "Eliminar Usuario",
      description: "¿Estás seguro de que deseas eliminar este usuario?",
      action: (
        <button
          onClick={async () => {
            try {
              const confirmSaveData = await deleteUserService(value);

              // Eliminar todos los bloques de tiempo asociado a ese usuario
              const phoneNumerDelete = users.find((user) => user.id === value);
              deleteAllBookingsByUserService(phoneNumerDelete!.phone!);
              if (confirmSaveData) {
                toast({
                  title: "Éxito",
                  description: "Usuario eliminado con éxito",
                });
              }
            } catch {
              toast({
                title: "Error",
                description: "Hubo un problema al eliminar el usuario",
              });
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Confirmar
        </button>
      ),
    });
  };

  const filteredBookingsByUser = React.useMemo(() => {
    const bookingsUsers = selectedUser
      ? filteredBookings.filter((booking) => booking.userId === selectedUser)
      : filteredBookings;

    return bookingsUsers;
  }, [selectedUser, filteredBookings]);

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

      <table className="min-w-full">
        <thead className="sticky top-10 max-sm:top-0">
          <tr>
            <th className="px-6 py-3 bg-accent text-left text-xs font-medium uppercase tracking-wider">
              Hora
            </th>
            <th className="px-6 py-3 bg-accent text-left text-xs font-medium uppercase tracking-wider">
              Reserva
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 overflow-auto">
          {hours.map((hour) => {
            const bookingsByUser = filteredBookingsByUser.find(
              (booking) =>
                new Date(booking.startTime).getHours() ===
                parseInt(hour.split(":")[0])
            );
            const user = bookingsByUser
              ? getUserByPhoneNumber(bookingsByUser.userId, users)
              : null;
            return (
              <tr key={hour}>
                <td className="md:px-6 max-md:pl-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-md:text-xs">
                  {hour}
                </td>
                <td className="flex justify-between gap-2 items-center md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <UserReservation
                    user={user}
                    booking={bookingsByUser}
                    userColors={userColors}
                    handleEdit={handleEdit}
                    onHandleDelete={onHandleDelete}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
            onSubmit={onHandleEditUser}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
