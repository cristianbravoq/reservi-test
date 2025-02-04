import { IUser } from "../types/user";

const saveUsers = (users: IUser[]) => {
  localStorage.setItem("users", JSON.stringify(users));
};

const getUsers = () => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

const addUser = (user: IUser) => {
  const users = getUsers();
  if (users.some((u) => u.phoneNumber === user.phoneNumber)) {
    alert("Phone number already exists");
    return;
  }
  const newUsers = [...users, user];
  saveUsers(newUsers);
};

const editUser = (updatedUser: IUser) => {
  const users = getUsers();
  const newUsers = users.map((user: IUser) =>
    user.id === updatedUser.id ? updatedUser : user
  );
  saveUsers(newUsers);
};

const deleteUser = (userId: string) => {
  const users = getUsers();
  const newUsers = users.filter((user: IUser) => user.id !== userId);
  saveUsers(newUsers);
};

export { addUser, editUser, deleteUser };
