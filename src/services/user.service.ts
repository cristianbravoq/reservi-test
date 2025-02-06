import { IUser } from "../types/user";

const saveUsers = (users: IUser[]) => {
  localStorage.setItem("users", JSON.stringify(users));
};

const getUsersService = () => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

const addUserService = (user: IUser) => {
  const users = getUsersService();
  if (users.some((u: IUser) => u.phoneNumber === user.phoneNumber)) {
    alert("Phone number already exists");
    return;
  }
  const newUsers = [...users, user];
  saveUsers(newUsers);

  return true;
};

const editUserService = (updatedUser: IUser) => {
  const users = getUsersService();
  const newUsers = users.map((user: IUser) =>
    user.id === updatedUser.id ? updatedUser : user
  );
  saveUsers(newUsers);

  return true;
};

const deleteUserService = (userId: string) => {
  const users = getUsersService();
  const newUsers = users.filter((user: IUser) => user.id !== userId);
  saveUsers(newUsers);

  return true;
};

export { getUsersService, addUserService, editUserService, deleteUserService };
