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
import { IUser } from "@/types/user";

// Definir el esquema de validación con zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  phone: z
    .string()
    .min(10, { message: "Phone Number must be at least 10 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
});

interface CreateUserFormProps {
  initialValues?: Omit<IUser, "id">;
  onSubmit: (values: Omit<IUser, "id">) => void;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  // Configurar useForm con el esquema de validación y valores por defecto
  const form = useForm<Omit<IUser, "id">>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  const handleSubmit = (values: Omit<IUser, "id">) => {
    form.reset();
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
          name="phone"
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

        <Button type="submit">
          {initialValues ? "Editar usuario" : "Crear usuario"}
        </Button>
      </form>
    </Form>
  );
};