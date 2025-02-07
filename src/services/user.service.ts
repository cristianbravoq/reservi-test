import useUserStore from "@/store/user-store";
import { IUser } from "../types/user";

const getUsersService = () => {
  const getUsers = useUserStore.getState().getUsers;
  return getUsers();
};

const addUserService = (user: IUser) => {
  const addUser = useUserStore.getState().addUser;
  return addUser(user);
};

const editUserService = (updatedUser: IUser) => {
  const editUser = useUserStore.getState().editUser;
  const responseService = editUser(updatedUser);
  return responseService;
};

const deleteUserService = (userId: string) => {
  const deleteUser = useUserStore.getState().deleteUser;
  return deleteUser(userId);
};

const setUsersService = (userS: IUser[]) => {
  const setUsers = useUserStore.getState().setUsers;
  return setUsers(userS);
}

export { getUsersService, addUserService, editUserService, deleteUserService, setUsersService };