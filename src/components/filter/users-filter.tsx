import useUserStore from "@/store/user-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState, useEffect, useCallback } from "react";
import { setUsersService } from "@/services/user.service";

export const UserFilter: React.FC = () => {
  const { usersRef } = useUserStore();

  const [selectedUser, setSelectedUser] = useState<string | null>("all");

  const onHandleUserSelected = useCallback(
    (user: string | null) => {
      if (user === "all") {
        setUsersService(usersRef.current);
      } else {
        const usersFiltered = [...usersRef.current].filter((u) => u.id === user);
        setUsersService(usersFiltered);
      }
    },
    [usersRef]
  );

  useEffect(() => {
    onHandleUserSelected(selectedUser);
  }, [onHandleUserSelected, selectedUser]);

  return (
    <Select onValueChange={(value) => setSelectedUser(value)}>
      <SelectTrigger className="flex-1 text-xs">
        <SelectValue placeholder="Selecciona un usuario" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Mostrar todos</SelectItem>
        {usersRef.current.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};