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
import { CreateUserForm } from "../user/create-user-form";
import TimeBlockForm from "../time-blocks/time-block-form";
import { UserFilter } from "../user/filter-user";

const BookingHeader: React.FC<{ date: Date }> = ({ date }) => {
  const [openDialog1, setOpenDialog1] = React.useState(false);
  const [openDialog2, setOpenDialog2] = React.useState(false);
  const [openDialog3, setOpenDialog3] = React.useState(false);

  return (
    <div className="flex justify-between space-x-4 p-2">
      <Badge variant="default" className="h-min p-2 text-nowrap">
        {format(date, "PPP")}
      </Badge>

      <div className="hidden sm:block">
        <UserFilter />
      </div>

      <div className="relative inline-block text-left">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem onSelect={() => setOpenDialog1(true)}>
              Crear usuario
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setOpenDialog2(true)}>
              Asignar reserva
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setOpenDialog3(true)} className="sm:hidden">
              Filtrar usuarios
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={openDialog1} onOpenChange={setOpenDialog1}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
              <DialogDescription>
                Fill out the form to create a new user.
              </DialogDescription>
            </DialogHeader>
            <CreateUserForm />
          </DialogContent>
        </Dialog>

        <Dialog open={openDialog2} onOpenChange={setOpenDialog2}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Time Block</DialogTitle>
              <DialogDescription>
                Fill out the form to assign a time block.
              </DialogDescription>
            </DialogHeader>
            <TimeBlockForm />
          </DialogContent>
        </Dialog>

        <Dialog open={openDialog3} onOpenChange={setOpenDialog3}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Users</DialogTitle>
              <DialogDescription>
                Use the form below to filter users.
              </DialogDescription>
            </DialogHeader>
            <UserFilter />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BookingHeader;