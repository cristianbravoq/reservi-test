import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

import { cn, isDateDisabled } from "@/lib/utils";
import { format } from "date-fns";
import { IUser } from "@/types/user";
import { ITimeSlot } from "@/types/booking";

import useUserStore from "@/store/user-store";
import { addBookingService } from "@/services/booking.service";

// Definir el esquema de validación con zod
const formSchema = z.object({
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  userId: z.string().min(1, { message: "User phone is required." }),
  date: z.string(),
});

export const BookingForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const users = useUserStore((state) => state.users);

  const [filteredSuggestions, setFilteredSuggestions] = useState<IUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [bookingPhone, setBookingPhone] = useState("");

  // Configurar useForm con el esquema de validación y valores por defecto
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      startTime: "",
      endTime: "",
      userId: "",
    },
  });

  // Actualizar los usuarios con el componente de autocompletar cada vez que cambie form.setValue("userId", value)
  const handleUserSuggestions = (value: string) => {
    if (!value) {
      setBookingPhone("");
      form.setValue("userId", "");
      setShowSuggestions(false);
      return;
    }

    setBookingPhone(value);
    setShowSuggestions(true);

    setFilteredSuggestions(
      users.filter((user: IUser) => user.phone.includes(value))
    );

    form.clearErrors();
  };

  const handleShowUserSuggestions = (userId: string, userPhone: string) => {
    form.setValue("userId", userId);
    setBookingPhone(userPhone);
    setShowSuggestions(false);
  };

  const handleTimeSlotChange = (timeSlot: ITimeSlot) => {
    form.setValue("startTime", timeSlot.startMinutes.toString());
    form.setValue("endTime", timeSlot.endMinutes.toString());

    form.clearErrors();
  };

  const handleChangeDate = (e: Date | undefined) => {
    setSelectedDate(e);
    if (e) {
      form.setValue("date", e.toString());
    }

    form.clearErrors();
  };

  // Función para manejar el envío del formulario
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      const bookingData = {
        ...data,
        timeSlot: {
          startMinutes: parseInt(data.startTime),
          endMinutes: parseInt(data.endTime),
        },
      };
      addBookingService(bookingData);

      setBookingPhone("");
      setShowSuggestions(false);
      setSelectedDate(undefined);
      form.reset();
    } catch {
      // Manejar errores
    } 
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
                    onChange={(e) => handleUserSuggestions(e.target.value)}
                    value={bookingPhone}
                  />
                  {showSuggestions && bookingPhone && (
                    <ul className="w-auto">
                      {filteredSuggestions.length ? (
                        filteredSuggestions.map((userSuggestion, index) => (
                          <Badge
                            key={index}
                            onClick={() =>
                              handleShowUserSuggestions(
                                userSuggestion.id,
                                userSuggestion.phone
                              )
                            }
                          >
                            {userSuggestion.name} - {userSuggestion.phone}
                          </Badge>
                        ))
                      ) : (
                        <li className="m-1">No suggestions available</li>
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
                    className=""
                    selected={selectedDate}
                    onSelect={(e) => handleChangeDate(e)}
                    initialFocus
                    disabled={isDateDisabled}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="flex flex-col gap-4">
          <FormLabel>Seleccionar intervalo de tiempo</FormLabel>
          <TimePicker onChange={handleTimeSlotChange} />
        </FormItem>

        <Button type="submit">Assign booking</Button>
      </form>
    </Form>
  );
};
