import * as React from "react";

import { hours } from "@/lib/format-hours";

import useTimeBlockStore from "@/store/time-block-store";
import useUserStore from "@/store/user-store";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { toast } from "@/hooks/use-toast";
import { CreateUserForm } from "@/components/user/create-user-form";
import { handleEditUser } from "@/components/header/utils";
import { deleteUserService } from "@/services/user.service";
import { deleteAllTimeBlocksByUserService } from "@/services/time-blocks.service";
import { generateUserColors } from "@/lib/generate-row-colors";
import UserReservation from "../user/user-reservation";
import { IUser } from "@/types/user";
import { ITimeBlock } from "@/types/time-blocks";
import { getUserByPhoneNumber } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const TimeTable: React.FC = () => {
  // dia siguiente al actual
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const [selectedUser, setSelectedUser] = React.useState<string | undefined>();
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<IUser | null>(null);

  const timeBlocks = useTimeBlockStore((state) => state.timeBlocks);
  const users = useUserStore((state) => state.users);

  const userColors = React.useMemo(() => generateUserColors(users), [users]);

  const filteredTimeBlocks = timeBlocks.filter(
    (block) => new Date(block.startTime).toDateString() === date.toDateString()
  );

  const handleEdit = (timeBlock: ITimeBlock) => {
    const user = getUserByPhoneNumber(timeBlock.userId, users);
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
              deleteAllTimeBlocksByUserService(phoneNumerDelete!.phone!);
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

  const filteredBlocksByUser = React.useMemo(() => {
    const blockTimesUsers = selectedUser
      ? filteredTimeBlocks.filter((block) => block.userId === selectedUser)
      : filteredTimeBlocks;

    return blockTimesUsers;
  }, [selectedUser, filteredTimeBlocks]);

  return (
    <div className="space-y-4 w-full">

      <Select onValueChange={(value) => setSelectedUser(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a user" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.phone}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hora
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reserva
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {hours.map((hour) => {
            const timeBlock = filteredBlocksByUser.find(
              (block) =>
                new Date(block.startTime).getHours() ===
                parseInt(hour.split(":")[0])
            );
            const user = timeBlock
              ? getUserByPhoneNumber(timeBlock.userId, users)
              : null;
            return (
              <tr key={hour}>
                <td className="md:px-6 max-md:pl-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-md:text-xs">
                  {hour}
                </td>
                <td className="flex justify-between gap-2 items-center md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <UserReservation
                    user={user}
                    timeBlock={timeBlock}
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
