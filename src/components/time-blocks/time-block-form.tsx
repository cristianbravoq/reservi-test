"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import { addTimeBlockService } from "@/services/time-blocks.service";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getUsersService } from "@/services/user.service";
import { ITimeBlock, IUser } from "@/types";
import { Badge, Input } from "../ui";
import { toast } from "@/hooks/use-toast";

// Definir el esquema de validación con zod
const formSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID format." }),
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  userId: z.string().min(1, { message: "User phone is required." }),
  date: z.date(),
});

export const TimeBlockForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startHour, setStartHour] = useState<string>("00:00");
  const [endHour, setEndHour] = useState<string>("00:00");

  const [filteredSuggestions, setFilteredSuggestions] = useState<IUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [initialUsers, setInitialUsers] = useState<IUser[]>([]);

  // Configurar useForm con el esquema de validación y valores por defecto
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      date: undefined,
      startTime: "",
      endTime: "",
      userId: "",
    },
  });

  // Consulta inicial para obtener los usuarios
  useEffect(() => {
    const loadUsers = () => {
      const users = getUsersService();
      setInitialUsers(users);
    };

    loadUsers();
  }, []);

  // Actualizar los usuarios con el componente de autocompletar cada vez que cambie form.setValue("userId", value)
  const handleSuggestions = (value: string) => {
    setInputValue(value);
    setShowSuggestions(true);

    const users = initialUsers;

    setFilteredSuggestions(
      users.filter((user: IUser) => user.phoneNumber.includes(value))
    ); // Devolver todas las coincidencias de los usuarios
  };

  const handleShowsSuggestions = (value: string) => {
    form.setValue("userId", value);
    setInputValue(value);
    setShowSuggestions(false);
  };

  // Función para manejar el envío del formulario
  const onSubmit = () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    if (startHour >= endHour) {
      // Validar que la hora de inicio sea menor a la hora de fin
    }

    const startTime = form.getValues("startTime");
    const endTime = form.getValues("endTime");

    const userId = inputValue;

    const timeBlock: ITimeBlock = {
      userId,
      startTime,
      endTime,
      date: new Date(),
      id: crypto.randomUUID(),
    };
    console.log(timeBlock);
    addTimeBlockService(timeBlock);

    form.reset(); // Limpiar el formulario después de enviar
    toast({
      title: "Success",
      description: "Time block created successfully.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="userId"
          render={() => (
            <FormItem>
              <FormLabel>Telefono</FormLabel>
              <FormControl>
                <div className="autocomplete">
                  <Input
                    type="tel"
                    onChange={(e) => handleSuggestions(e.target.value)}
                    value={inputValue}
                  />
                  {showSuggestions && inputValue && (
                    <ul className="w-auto">
                      {filteredSuggestions.length ? (
                        filteredSuggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            onClick={() =>
                              handleShowsSuggestions(suggestion.phoneNumber)
                            }
                          >
                            {suggestion.name} - {suggestion.phoneNumber}
                          </Badge>
                        ))
                      ) : (
                        <li>No suggestions available</li>
                      )}
                    </ul>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Seleccionar fecha</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground w-full"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(e) => {
                      setSelectedDate(e);
                      if (e) {
                        form.setValue("date", e);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="grid grid-flow-col">
          <div className="flex flex-col gap-2 items-center justify-center !m-0">
            <FormLabel>Hora inicial</FormLabel>
            <FormControl>
              <TimePicker onSelect={(e) => form.setValue("startTime", e)} />
            </FormControl>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center !m-0">
            <FormLabel>Hora Final</FormLabel>
            <FormControl>
              <TimePicker onSelect={(e) => form.setValue("endTime", e)} />
            </FormControl>
          </div>
        </FormItem>
        <Button onClick={() => onSubmit()}>Assign Time Block</Button>
      </form>
    </Form>
  );
};
