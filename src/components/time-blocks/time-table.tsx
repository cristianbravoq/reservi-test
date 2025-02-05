import * as React from "react";
import { MoreVertical } from "lucide-react";

import { Badge, Button, Popover, PopoverContent, PopoverTrigger } from "../ui";

import { ITimeBlock, IUser } from "@/types";
import { hours } from "@/lib/format-hours";

interface TimeTableProps {
  date: Date;
  users: IUser[];
  timeBlocks: ITimeBlock[];
}

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
    <div className="space-y-4 w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hour
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reservation
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
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
              <tr key={hour}>
                <td className="md:px-6 max-md:pl-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {hour}
                </td>
                <td className="flex justify-between gap-2 items-center md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user ? (
                    <div className="flex w-full justify-between gap-1 flex-wrap">
                      <Badge variant="outline">{user.name}</Badge>
                      <Badge variant="outline">{user.address}</Badge>
                      <Badge variant="default">{user.phoneNumber}</Badge>
                      <Badge variant="outline">{user.email}</Badge>
                    </div>
                  ) : (
                    "No Reservation"
                  )}
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTable;
