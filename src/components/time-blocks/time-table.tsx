import * as React from "react";
import { MoreVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui";
import { format } from "date-fns";

interface ITimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  userId: string;
}

interface IUser {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
}

interface TimeTableProps {
  date: Date;
  users: IUser[];
  timeBlocks: ITimeBlock[];
}

const hours = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

const getUserById = (users: IUser[], userId: string) => {
  return (
    users.find((user) => user.id === userId) || {
      name: "Unknown User",
      address: "",
      phoneNumber: "",
      email: "",
    }
  );
};

const TimeTable: React.FC<TimeTableProps> = ({ date, users, timeBlocks }) => {
  const [selectedUser] = React.useState<string | undefined>();

  const filteredTimeBlocks = timeBlocks.filter(
    (block) => new Date(block.startTime).toDateString() === date.toDateString()
  );

  const handleEdit = (timeBlock: ITimeBlock) => {
    console.log("Edit", timeBlock);
    // Implementar lógica de edición
  };

  const handleDelete = (timeBlock: ITimeBlock) => {
    console.log("Delete", timeBlock);
    // Implementar lógica de eliminación
  };

  const filteredBlocksByUser = selectedUser
    ? filteredTimeBlocks.filter((block) => block.userId === selectedUser)
    : filteredTimeBlocks;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 p-2">
        <Badge variant="default" className="p-2 text-nowrap">
          {format(date, "PPP")}
        </Badge>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Search..." className="w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1">
          {hours.map((hour) => (
            <div key={hour} className="border-b py-2 text-center">
              {hour}
            </div>
          ))}
        </div>
        <div className="col-span-3">
          {hours.map((hour) => {
            const timeBlock = filteredBlocksByUser.find(
              (block) =>
                new Date(block.startTime).getHours() ===
                parseInt(hour.split(":")[0])
            );
            const user = timeBlock
              ? getUserById(users, timeBlock.userId)
              : null;
            return (
              <div
                key={hour}
                className="border-b py-2 flex justify-between items-center"
              >
                <div>
                  {user ? (
                    <div className="flex gap-1">
                      <Badge variant="outline">{user.name}</Badge>
                      <Badge variant="outline">{user.address}</Badge>
                      <Badge variant="default">{user.phoneNumber}</Badge>
                      <Badge variant="outline">{user.email}</Badge>
                    </div>
                  ) : (
                    "No Reservation"
                  )}
                </div>
                {timeBlock && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-2 w-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="w-32 flex flex-col gap-2"
                    >
                      <Button
                        variant="default"
                        size="default"
                        className="w-full"
                        onClick={() => handleEdit(timeBlock)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="default"
                        className="w-full"
                        onClick={() => handleDelete(timeBlock)}
                      >
                        Delete
                      </Button>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeTable;
