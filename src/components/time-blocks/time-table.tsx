import * as React from "react";
import { MoreVertical } from "lucide-react";
import { Badge, Button, Popover, PopoverContent, PopoverTrigger } from "../ui";
import { ITimeBlock, IUser } from "@/types";
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
import { CreateUserForm } from "../user/create-user-form";
import { handleEditUser } from "../header/utils";
import { deleteUserService } from "@/services/user.service";
import { deleteAllTimeBlocksByUserService } from "@/services/time-blocks.service";


// Generar colores únicos para cada usuario
const generateUserColors = (users: IUser[]) => {
  const colors = [
    "#DDE3FF", // Indigo Pastel (Ligero y contrastante)
    "#C7D2FE", // Indigo 200 (Suave y claro)
    "#E0E7FF", // Indigo 100 (Muy claro)
    "#F3E8FF", // Lavanda clara
    "#FAE8FF", // Rosa lavanda
    "#DBEAFE", // Azul cielo claro
    "#FCE7F3", // Rosa pastel
    "#FEF9C3", // Amarillo pastel claro
    "#CFFAFE", // Azul turquesa claro
  ];
  const userColors: Record<string, string> = {};
  users.forEach((user) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    userColors[user.phone] = randomColor;
  });
  return userColors;
};

const TimeTable: React.FC = () => {
  // dia siguiente al actual
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const [selectedUser] = React.useState<string | undefined>();
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<IUser | null>(null);

  const timeBlocks = useTimeBlockStore((state) => state.timeBlocks);
  const users = useUserStore((state) => state.users);

  const userColors = React.useMemo(() => generateUserColors(users), [users]);

  const getUserByPhoneNumber = (phoneNumber: string) => {
    const user = users.find((user: IUser) => user.phone === phoneNumber);
    return user || null;
  };

  const filteredTimeBlocks = timeBlocks.filter(
    (block) => new Date(block.startTime).toDateString() === date.toDateString()
  );

  const handleEdit = (timeBlock: ITimeBlock) => {
    const user = getUserByPhoneNumber(timeBlock.userId);
    if (user) {
      setEditingUser(user);
      setOpenEditDialog(true);
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

  const filteredBlocksByUser = selectedUser
    ? filteredTimeBlocks.filter((block) => block.userId === selectedUser)
    : filteredTimeBlocks;

  return (
    <div className="space-y-4 w-full">
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
              ? getUserByPhoneNumber(timeBlock.userId)
              : null;
            return (
              <tr key={hour}>
                <td className="md:px-6 max-md:pl-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-md:text-xs">
                  {hour}
                </td>
                <td className="flex justify-between gap-2 items-center md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user ? (
                    <div className="flex w-full justify-between gap-1 flex-wrap">
                      <Badge
                        variant="outline"
                        style={{
                          backgroundColor: userColors[user.phone],
                        }}
                      >
                        {user.name}
                      </Badge>
                      <Badge
                        variant="outline"
                        style={{
                          backgroundColor: userColors[user.phone],
                        }}
                      >
                        {user.address}
                      </Badge>
                      <Badge
                        variant="outline"
                        style={{
                          backgroundColor: userColors[user.phone],
                        }}
                      >
                        {user.phone}
                      </Badge>
                      <Badge
                        variant="outline"
                        style={{
                          backgroundColor: userColors[user.phone],
                        }}
                      >
                        {user.email}
                      </Badge>
                    </div>
                  ) : (
                    "No Reservation"
                  )}
                  {timeBlock && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="h-3 w-3 m-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="w-32 flex flex-col gap-2"
                      >
                        <Button
                          variant="default"
                          size="default"
                          className="w-full"
                          onClick={() => handleEdit(timeBlock)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="default"
                          className="w-full"
                          onClick={() => onHandleDelete(user!.id!)}
                        >
                          Eliminar
                        </Button>
                      </PopoverContent>
                    </Popover>
                  )}
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

export default TimeTable;
