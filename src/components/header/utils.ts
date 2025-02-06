import { toast } from "@/hooks/use-toast";
import { addUserService, editUserService } from "@/services/user.service";
import { IUser } from "@/types";

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

const handleEditUser = (values: IUser) => {
  try {
    const confirmSaveData = editUserService(values);
    if (confirmSaveData) {
      toast({
        title: "Success",
        description: "Usuario editado con éxito",
      });
    }
  } catch {
    toast({
      title: "Error",
      description: "Error editing user",
    });
  }
};

export { handleCreateUser, handleEditUser };
