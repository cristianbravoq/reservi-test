import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addUserService } from "@/services/user.service";
import { toast } from "@/hooks/use-toast";

// Definir el esquema de validación con zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone Number must be at least 10 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
});

export const CreateUserForm: React.FC = () => {
  // Configurar useForm con el esquema de validación y valores por defecto
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
      email: "",
    },
  });

  // Función para manejar el envío del formulario
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Aquí puedes agregar la lógica para enviar los datos a tu backend
    try {
      // Maneja la logica para id del usuario

      // Agregar el id al objeto de usuario
      const createIdUser = {
        ...values,
        id: crypto.randomUUID(),
      };

      const confirmSaveData = addUserService(createIdUser);
      if (confirmSaveData) {
        form.reset(); // Limpiar el formulario después de enviar

        toast({
          title: "Success",
          description: "Usuario creado con éxito"
        });
      }
    } catch (error: any) {
      throw new Error("Error creating user");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direccion</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numero de telefono</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electronico</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* // Quitar estres visual de los botones, posicionandolo a la izquierda */}
        <Button type="submit">Crear usuario</Button>
      </form>
    </Form>
  );
};
