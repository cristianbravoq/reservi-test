import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser } from "../types/user";

interface UserState {
  users: IUser[];
  setUsers: (users: IUser[]) => void;
  addUser: (user: IUser) => boolean;
  editUser: (updatedUser: IUser) => boolean;
  deleteUser: (userId: string) => boolean;
  usersRef: { current: IUser[] }; // Simulamos un Ref sin React
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => {
      // Inicializamos usersRef con una referencia a la lista de usuarios
      const usersRef = { current: [] as IUser[] };

      return {
        users: [],
        setUsers: (users: IUser[]) => {
          set({ users });
        },
        addUser: (newUser: IUser) => {
          const { users } = get();
          const newUsers = [...users, newUser];

          set({ users: newUsers, usersRef: {current: newUsers} });

          return true;
        },
        editUser: (updatedUser: IUser) => {
          const { users } = get();
          const newUsers = users.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          );

          set({ users: newUsers, usersRef: {current: newUsers} });

          return true;
        },
        deleteUser: (userId: string) => {
          const { users } = get();
          const newUsers = users.filter((user) => user.id !== userId);

          set({ users: newUsers, usersRef: {current: newUsers} });

          return true;
        },
        usersRef, // Devolvemos usersRef
      };
    },
    {
      name: "users-storage", // Nombre de la clave en localStorage
    }
  )
);

export default useUserStore;