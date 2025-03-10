import * as React from "react";
import { MoreVertical } from "lucide-react";
import { IUser } from "@/types/user";
import { IBooking } from "@/types/booking";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface UserReservationProps {
  user: IUser | null;
  booking: IBooking | undefined;
  userColors: Record<string, string>;
  onHandleEdit: (user: IUser) => void;
  onHandleDelete: (userId: string) => void;
}

const UserReservation: React.FC<UserReservationProps> = ({
  user,
  userColors,
  onHandleEdit,
  onHandleDelete,
}) => {
  return (
    <>
      {user ? (
        <div className="flex w-full justify-between gap-1 overflow-auto">
          <Badge
            className="text-nowrap"
            variant="outline"
            style={{
              backgroundColor: userColors[user.phone],
            }}
          >
            {user.name}
          </Badge>-
          <Badge
            className="text-nowrap"
            variant="outline"
            style={{
              backgroundColor: userColors[user.phone],
            }}
          >
            {user.address}
          </Badge>-
          <Badge
            className="text-nowrap"
            variant="outline"
            style={{
              backgroundColor: userColors[user.phone],
            }}
          >
            {user.phone}
          </Badge>-
          <Badge
            className="text-nowrap"
            variant="outline"
            style={{
              backgroundColor: userColors[user.phone],
            }}
          >
            {user.email}
          </Badge>
        </div>
      ) : (
        "No Reservation"
      )}
      {user && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-32 flex flex-col gap-2">
            <Button
              variant="default"
              size="default"
              className="w-full"
              onClick={() => onHandleEdit(user)}
            >
              Editar
            </Button>
            <Button
              variant="outline"
              size="default"
              className="w-full"
              onClick={() => onHandleDelete(user!.id!)}
            >
              Eliminar
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default UserReservation;
