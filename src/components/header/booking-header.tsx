import * as React from "react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CreateUserForm } from "../user/form/user-form";
import { BookingForm } from "../bookings/form/booking-form";
import { BookingsFilter } from "../filter/bookings-filter";
import { TagsFilters } from "../filter/tags-filters";
import { addUserService } from "@/services/user.service";
import { IUser } from "@/types/user";

export const BookingHeader: React.FC = () => {
  const [openDialog1, setOpenDialog1] = React.useState(false);
  const [openDialog2, setOpenDialog2] = React.useState(false);
  const [openDialog3, setOpenDialog3] = React.useState(false);

  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const onHandleCreateUser = (values: Omit<IUser, "id">) => {
    addUserService(values);
  };

  return (
    <div className="flex justify-between space-x-4 p-2 m-2">
      <Badge variant="default" className="h-min p-2 text-nowrap">
        {format(date, "PPP")}
      </Badge>

        <div className="hidden sm:block">
          <BookingsFilter />
          <TagsFilters />
        </div>


      <div className="relative inline-block text-left">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {/* // Aquí se agregan los elementos del menú desplegable // */}

            {/* // openDialog1 // */}
            <DropdownMenuItem onSelect={() => setOpenDialog1(true)}>
              Crear usuario
            </DropdownMenuItem>

            {/* // openDialog2 // */}
            <DropdownMenuItem onSelect={() => setOpenDialog2(true)}>
              Asignar reserva
            </DropdownMenuItem>

            {/* // openDialog3 // */}
            <DropdownMenuItem
              onSelect={() => setOpenDialog3(true)}
              className="sm:hidden"
            >
              Filtrar usuarios
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* // Dialogs // */}

        {/* // openDialog1 // */}
        <Dialog open={openDialog1} onOpenChange={setOpenDialog1}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear usuario</DialogTitle>
              <DialogDescription className="text-left">
                Complete el formulario para crear un nuevo usuario.
              </DialogDescription>
            </DialogHeader>
            <CreateUserForm onSubmit={onHandleCreateUser} />
          </DialogContent>
        </Dialog>

        {/* // openDialog2 // */}
        <Dialog open={openDialog2} onOpenChange={setOpenDialog2}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Asignar reserva</DialogTitle>
              <DialogDescription className="text-left">
                Complete el formulario para asignar un bloque de tiempo.
              </DialogDescription>
            </DialogHeader>
            <BookingForm />
          </DialogContent>
        </Dialog>

        {/* // openDialog3 // */}
        <Dialog open={openDialog3} onOpenChange={setOpenDialog3}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filtrar usuarios</DialogTitle>
              <DialogDescription className="text-left">
                Use el formulario a continuación para filtrar usuarios.
              </DialogDescription>
            </DialogHeader>
            <BookingsFilter />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
