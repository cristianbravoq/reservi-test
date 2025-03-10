import * as React from "react";
import { useEffect, useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListFilterPlusIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { FilterKeysType } from "./types";

import useBookingsFilterStore from "@/store/filters-store";
import useUserStore from "@/store/user-store";
import { setUsersService } from "@/services/user.service";

const filterOptions: FilterKeysType[] = ["name", "phone", "email"];

export const BookingsFilter: React.FC = () => {
  const { tags, addTag } = useBookingsFilterStore();
  const [inputValues, setInputValues] = React.useState<
    Record<FilterKeysType, string>
  >({
    name: "",
    phone: "",
    email: "",
  });

  const { usersRef } = useUserStore();
  // useRef -> para guardar un valor
  // que queremos que se comparta entre renderizados
  // pero que al cambiar, no vuelva a renderizar el componente

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    filter: FilterKeysType
  ) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [filter]: e.target.value,
    }));
  };

  const filteredUsers = useMemo(() => {
    const availableUsers = usersRef.current;
    const usersFilteredByInputChange = [...availableUsers].filter((user) => {
      return (Object.keys(inputValues) as FilterKeysType[]).every((key) => {
        const value = inputValues[key];
        if (!value) return true;
        return user[key].toLowerCase().includes(value.toLowerCase());
      });
    });
    const usersFiltereByTags = [...usersFilteredByInputChange].filter(
      (user) => {
        return Object.keys(tags).every((key) => {
          const typedKey = key as FilterKeysType;
          const filterValues = tags[typedKey];

          if (!filterValues || filterValues.length === 0) return true;
          return filterValues.some((value) =>
            user[typedKey].toLowerCase().includes(value.toLowerCase())
          );
        });
      }
    );
    return usersFiltereByTags;
  }, [usersRef, inputValues, tags]);

  const handleAddTag = (filterKey: FilterKeysType, filterValue: string) => {
    addTag(filterKey, filterValue);
    // Limpiar input después de agregar el tag
    setInputValues((prevValues) => ({
      ...prevValues,
      [filterKey]: "",
    }));
  };

  useEffect(() => {
    setUsersService(filteredUsers);
  }, [filteredUsers]);

  return (
    <div className="w-full">
      {/* // Aqui se digitan los elementos del filtro de usuario */}
      <div className="flex justify-center flex-auto flex-wrap gap-4">
        <AnimatePresence>
          {filterOptions.map((filter) => (
            <motion.div
              key={filter}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex w-auto items-center mt-2"
            >
              <Input
                className="rounded-r-none"
                placeholder={`Filtrar por ${filter}`}
                value={inputValues[filter]}
                onChange={(e) => handleInputChange(e, filter)}
              />
              <Button
                className="rounded-l-none"
                variant={"secondary"}
                onClick={() => handleAddTag(filter, inputValues[filter])}
              >
                <ListFilterPlusIcon />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
