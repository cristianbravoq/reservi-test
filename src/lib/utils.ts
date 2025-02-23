import { IUser } from "@/types/user";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUserByPhoneNumber = (phoneNumber: string, users: IUser[]) => {
    const user = users.find((user: IUser) => user.phone === phoneNumber);
    return user || null;
  };