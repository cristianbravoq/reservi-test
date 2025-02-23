import { IUser } from "@/types/user";

// Generar colores únicos para cada usuario
export const generateUserColors = (users: IUser[]) => {
     const colors = [
       "#DDE3FF", // Indigo Pastel (Ligero y contrastante)
       "#C7D2FE", // Indigo 200 (Suave y claro)
       "#E0E7FF", // Indigo 100 (Muy claro)
       "#F3E8FF", // Lavanda clara
       "#FAE8FF", // Rosa lavanda
       "#DBEAFE", // Azul cielo claro
       "#FCE7F3", // Rosa pastel
       "#FEF9C3", // Amarillo pastel claro
       "#CFFAFE", // Azul turquesa claro
     ];
     const userColors: Record<string, string> = {};
     users.forEach((user) => {
       const randomColor = colors[Math.floor(Math.random() * colors.length)];
       userColors[user.phone] = randomColor;
     });
     return userColors;
   };