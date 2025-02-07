import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser } from "../types/user";
import { toast } from "@/hooks/use-toast";

interface UserState {
  users: IUser[];
  setUsers: (users: IUser[]) => void;
  addUser: (user: IUser) => boolean;
  editUser: (updatedUser: IUser) => boolean;
  deleteUser: (userId: string) => boolean;
  getUsers: () => IUser[];
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      setUsers: (users: IUser[]) => {
        set({ users });
      },
      addUser: (user: IUser) => {
        const users = get().users;
        if (users.some((u) => u.phoneNumber === user.phoneNumber)) {
          toast({
            title: "Error",
            description: "Phone number already exists",
          });
          return false;
        }
        set((state) => ({
          users: [...state.users, user],
        }));
        return true;
      },
      editUser: (updatedUser: IUser) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.phoneNumber === updatedUser.phoneNumber ? updatedUser : user
          ),
        }));
        return true;
      },
      deleteUser: (userId: string) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== userId),
        }));
        return true;
      },
      getUsers: () => get().users,
    }),
    {
      name: "users-storage", // Nombre de la clave en localStorage
    }
  )
);

export default useUserStore;
