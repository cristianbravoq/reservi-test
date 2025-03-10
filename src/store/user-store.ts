import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser } from "../types/user";

interface UserState {
  users: IUser[];
  setUsers: (users: IUser[]) => void;
  addUser: (user: IUser) => boolean;
  editUser: (updatedUser: IUser) => boolean;
  deleteUser: (userId: string) => boolean;
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
        addUser: (newUser: IUser) => {
          const { users } = get();

          const newUsers = [...users, newUser];
          usersRef.current = newUsers;

          set({ users: newUsers });

          return true;
        },
        editUser: (updatedUser: IUser) => {
          const { users } = get();

          const newUsers = users.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          );
          usersRef.current = newUsers;

          set({ users: newUsers });

          return true;
        },
        deleteUser: (userId: string) => {
          const { users } = get();
          const newUsers = users.filter((user) => user.id !== userId);
          usersRef.current = newUsers;

          set(() => ({
            users: newUsers,
          }));
          
          return true;
        },
        usersRef,
      };
    },
    {
      name: "users-storage", // Nombre de la clave en localStorage
    }
  )
);

export default useUserStore;
