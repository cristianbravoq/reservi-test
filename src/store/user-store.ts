import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser } from "../types/user";

interface UserState {
  users: IUser[];
  setUsers: (users: IUser[]) => void;
  addUser: (user: IUser) => boolean;
  editUser: (updatedUser: IUser) => boolean;
  deleteUser: (userId: string) => boolean;
  getUsers: () => IUser[];
  usersRef: React.MutableRefObject<IUser[]>;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => {
      const usersRef = { current: [] as IUser[] };

      return {
        users: [],
        setUsers: (users: IUser[]) => {
          set({ users });
        },
        addUser: (user: IUser) => {
          const users = get().users;
          if (users.some((u) => u.phone === user.phone)) {
            return false;
          }
          const newUsers = [...users, user];
          usersRef.current = newUsers;
          set({ users: newUsers });
          return true;
        },
        editUser: (updatedUser: IUser) => {
          const newUsers = get().users.map((user) =>
            user.phone === updatedUser.phone ? updatedUser : user
          );
          usersRef.current = newUsers;
          set({ users: newUsers });
          return true;
        },
        deleteUser: (userId: string) => {
          const newUsers = get().users.filter((user) => user.id !== userId);
          usersRef.current = newUsers;
          set({ users: newUsers });
          return true;
        },
        getUsers: () => get().users,
        usersRef,
      };
    },
    {
      name: "users-storage", // Nombre de la clave en localStorage
    }
  )
);

export default useUserStore;