import useUserStore from "@/store/user-store";
import { IUser } from "../types/user";
import { toast } from "@/hooks/use-toast";

const addUserService = (newUser: Omit<IUser, "id">) => {
  const { usersRef, addUser } = useUserStore.getState();

  const noDuplicatePhone: boolean = usersRef.current.some(
    (user) => user.phone === newUser.phone
  );

  if (noDuplicatePhone) {
    toast({
      title: "Error",
      description: "Ya exite este numero de telefono",
    });
    return;
  }

  const userWithId: IUser = {
    ...newUser,
    id: Math.random().toString(36).substr(2, 9),
  };

  const responseService = addUser(userWithId);

  if (!responseService) {
    toast({
      title: "Error",
      description: "Error al agregar el usuario",
    });
  }

  toast({
    title: "Success",
    description: "Usuario agregago con éxito",
  });
};

const getUsersService = (): IUser[] => {
  return useUserStore.getState().users;
};

const editUserService = (updatedUser: IUser) => {
  const { editUser } = useUserStore.getState();
  const responseService = editUser(updatedUser);
  
  if (!responseService) {
    toast({
      title: "Error",
      description: "Error al editar el usuario",
    });
  }

  toast({
    title: "Success",
    description: "Usuario editado con éxito",
  });
};

const deleteUserService = (userId: string) => {
  const { deleteUser } = useUserStore.getState();
  const responseService = deleteUser(userId);

  if(!responseService){
    toast({
      title: "Error",
      description: "Error al eliminar el usuario"
    })
  }

  toast({
    title: "Success",
    description: "Usuario eliminado con exito"
  })
};

const setUsersService = (userS: IUser[]) => {
  const setUsers = useUserStore.getState().setUsers;
  return setUsers(userS);
};

export {
  getUsersService,
  addUserService,
  editUserService,
  deleteUserService,
  setUsersService,
};
