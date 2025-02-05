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
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import { addTimeBlock } from "@/services/time-blocks.service";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Definir el esquema de validación con zod
const formSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID format." }),
  date: z.string().min(1, { message: "Date is required." }),
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  userId: z.string().uuid({ message: "Invalid user ID format." }),
});

export const TimeBlockForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startHour, setStartHour] = useState<string>("00:00");
  const [endHour, setEndHour] = useState<string>("00:00");

  // Configurar useForm con el esquema de validación y valores por defecto
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      date: "",
      startTime: "",
      endTime: "",
      userId: "",
    },
  });

  // Función para manejar el envío del formulario
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    if (startHour >= endHour) {
      alert("End time must be greater than start time.");
      return;
    }

    const startTime = `${
      selectedDate.toISOString().split("T")[0]
    }T${startHour}:00`;
    const endTime = `${selectedDate.toISOString().split("T")[0]}T${endHour}:00`;

    const timeBlock = { ...values, startTime, endTime, date: new Date() };
    addTimeBlock(timeBlock);
    console.log("Time Block Data:", timeBlock);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormControl>
                <Input placeholder="User UUID" {...field} />
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
              <FormLabel>Select Date</FormLabel>
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
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
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
            <FormLabel>Start Hour</FormLabel>
            <FormControl>
              <TimePicker onSelect={setStartHour} />
            </FormControl>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center !m-0">
            <FormLabel>End Hour</FormLabel>
            <FormControl>
              <TimePicker onSelect={setEndHour} />
            </FormControl>
          </div>
        </FormItem>
        <Button type="submit">Assign Time Block</Button>
      </form>
    </Form>
  );
}

export default TimeBlockForm;
