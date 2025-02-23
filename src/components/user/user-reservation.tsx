import * as React from "react";
import { MoreVertical } from "lucide-react";
import { IUser } from "@/types/user";
import { ITimeBlock } from "@/types/time-blocks";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface UserReservationProps {
  user: IUser | null;
  timeBlock: ITimeBlock | undefined;
  userColors: Record<string, string>;
  handleEdit: (timeBlock: ITimeBlock) => void;
  onHandleDelete: (userId: string) => void;
}

const UserReservation: React.FC<UserReservationProps> = ({
  user,
  timeBlock,
  userColors,
  handleEdit,
  onHandleDelete,
}) => {
  return (
    <>
      {user ? (
        <div className="flex w-full justify-between gap-1 flex-wrap">
          <Badge
            variant="outline"
            style={{
              backgroundColor: userColors[user.phone],
            }}
          >
            {user.name}
          </Badge>
          <Badge
            variant="outline"
            style={{
              backgroundColor: userColors[user.phone],
            }}
          >
            {user.address}
          </Badge>
          <Badge
            variant="outline"
            style={{
              backgroundColor: userColors[user.phone],
            }}
          >
            {user.phone}
          </Badge>
          <Badge
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
      {timeBlock && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-3 w-3 m-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-32 flex flex-col gap-2">
            <Button
              variant="default"
              size="default"
              className="w-full"
              onClick={() => handleEdit(timeBlock)}
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
