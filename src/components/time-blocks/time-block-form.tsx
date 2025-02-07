"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import { ITimeBlock, IUser } from "@/types";
import { Badge, Input } from "../ui";
import { toast } from "@/hooks/use-toast";
import useUserStore from "@/store/user-store";

// Definir el esquema de validación con zod
const formSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID format." }),
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  userId: z.string().min(1, { message: "User phone is required." }),
  date: z.date(),
});

export const TimeBlockForm: React.FC = () => {
  const [startHour, setStartHour] = useState<string>("00:00");
  const [endHour, setEndHour] = useState<string>("01:00");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const users = useUserStore((state) => state.users);

  const [filteredSuggestions, setFilteredSuggestions] = useState<IUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState("");

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

  // Actualizar los usuarios con el componente de autocompletar cada vez que cambie form.setValue("userId", value)
  const handleSuggestions = (value: string) => {
    setInputValue(value);
    setShowSuggestions(true);

    setFilteredSuggestions(
      users.filter((user: IUser) => user.phoneNumber.includes(value))
    ); // Devolver todas las coincidencias de los usuarios
  };

  const handleShowsSuggestions = (value: string) => {
    form.setValue("userId", value);
    setInputValue(value);
    setShowSuggestions(false);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    return date < today;
  };

  const handleStartTimeChange = (e: string) => {
    setStartHour(e);
    const [hours, minutes] = e.split(":").map(Number);
    const newEndHour = new Date();
    newEndHour.setHours(hours + 1, minutes);
    const formattedEndHour = newEndHour.toTimeString().slice(0, 5);
    setEndHour(formattedEndHour);
    form.setValue("startTime", e);
    form.setValue("endTime", formattedEndHour);
  };

  const handleEndTimeChange = (e: string) => {
    setEndHour(e);
    const [hours, minutes] = e.split(":").map(Number);
    const newStartHour = new Date();
    newStartHour.setHours(hours - 1, minutes);
    const formattedStartHour = newStartHour.toTimeString().slice(0, 5);
    setStartHour(formattedStartHour);
    form.setValue("endTime", e);
    form.setValue("startTime", formattedStartHour);
  };

  // Función para manejar el envío del formulario
  const onSubmit = () => {
    // Validar que exista un usuario real vinculado al número de teléfono
    const user = users.find((user) => user.phoneNumber === inputValue);
    if (!user) {
      toast({
        title: "Error",
        description: "User not found.",
      });
      return;
    }

    const startHourTime = form.getValues("startTime");
    const endHourTime = form.getValues("endTime");
    // Convertir las horas en un string de tipo date date "2025-02-06T03:00:00.000Z"
    const startTime = new Date(
      `${selectedDate!.toISOString().split("T")[0]}T${startHourTime}`
    );
    const endTime = new Date(
      `${selectedDate!.toISOString().split("T")[0]}T${endHourTime}`
    );

    const date = form.getValues("date");
    const userId = inputValue;

    const timeBlock: ITimeBlock = {
      userId,
      startTime,
      endTime,
      date,
      id: crypto.randomUUID(),
    };
    addTimeBlockService(timeBlock);

    // Limpiar el formulario después de enviar
    form.reset();
    // quiero setear los valores a una hora mas de la actual guardada en el state si el valor es 
    console.log("startHour", startHour);
    
    setSelectedDate(undefined);
    setInputValue("");
    setFilteredSuggestions([]);
    setShowSuggestions(false);

    toast({
      title: "Success",
      description: "Time block created successfully.",
    });
  };

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
                        <li className="text-indigo-400 m-1">
                          No suggestions available
                        </li>
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
                    className="text-indigo-400"
                    selected={selectedDate}
                    onSelect={(e) => {
                      setSelectedDate(e);
                      if (e) {
                        form.setValue("date", e);
                      }
                    }}
                    initialFocus
                    disabled={isDateDisabled}
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
              <TimePicker
                className="text-indigo-600"
                onSelect={handleStartTimeChange}
                value={startHour}
              />
            </FormControl>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center !m-0">
            <FormLabel>Hora Final</FormLabel>
            <FormControl>
              <TimePicker
                className="text-indigo-600"
                onSelect={handleEndTimeChange}
                value={endHour}
              />
            </FormControl>
          </div>
        </FormItem>

        <Button onClick={() => onSubmit()}>Assign Time Block</Button>
      </form>
    </Form>
  );
};
