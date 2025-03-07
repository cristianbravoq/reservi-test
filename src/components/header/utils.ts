import { toast } from "@/hooks/use-toast";
import { updateBookingsWhenEditUserService } from "@/services/booking.service";
import { addUserService, editUserService } from "@/services/user.service";
import { IUser } from "@/types/user";

const handleCreateUser = (values: IUser) => {
  try {
    const createIdUser = {
      ...values,
      id: crypto.randomUUID(),
    };
    const confirmSaveData = addUserService(createIdUser);
    if (confirmSaveData) {
      toast({
        title: "Success",
        description: "Usuario creado con éxito",
      });
    }
    return confirmSaveData;
  } catch {
    toast({
      title: "Error",
      description: "Error creating user",
    });
    return false;
  }
};

const handleEditUser = (values: IUser, users: IUser[]) => {
  const oldUser = users.find((user) => user.phone === values.phone);
  try {
    // Si oldUser es undefined se debe crear un nuevo usuario
    if (!oldUser) {
      handleCreateUser(values);
      console.log("usuario nuevo", values.phone, oldUser!.phone);
      // Asignar al nuevo usuario, las reservas asignadas al oldUser
      updateBookingsWhenEditUserService(values.phone, oldUser!.phone);

      return;
    }
    // Si cambio el numero de telefono de un usuario, se debe cambiar en todas las reservas asociadas a ese usuario
    console.log("values", values);

    const confirmSaveData = editUserService(values);
    if (confirmSaveData) {
      toast({
        title: "Success",
        description: "Usuario editado con éxito",
      });
    }
  } catch {
    updateBookingsWhenEditUserService(values.phone, oldUser!.phone);
    toast({
      title: "Error",
      description: "Error editando el usuario",
    });
  }
};

export { handleCreateUser, handleEditUser };
