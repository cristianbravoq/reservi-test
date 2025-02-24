/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListFilterPlusIcon, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/user-store";
import { useEffect, useMemo } from "react";

type FilterKeys = "name" | "phone" | "email";

const filterOptions: FilterKeys[] = ["name", "phone", "email"];

export const UserFilter: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = React.useState<FilterKeys[]>(
    []
  );
  const [tags, setTags] = React.useState<string[]>([]);
  const [inputValues, setInputValues] = React.useState<
    Record<FilterKeys, string>
  >({
    name: "",
    phone: "",
    email: "",
  });

  const { setUsers, usersRef } = useUserStore();
  // useRef -> para guardar un valor
  // que queremos que se comparta entre renderizados
  // pero que al cambiar, no vuelva a renderizar el componente

  const handleToggleChange = (value: FilterKeys) => {
    setSelectedFilters((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((filter) => filter !== value)
        : [...prevSelected, value]
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    filter: FilterKeys
  ) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [filter]: e.target.value,
    }));
  };

  const handleAddTag = (filter: FilterKeys) => {
    if (
      inputValues[filter] &&
      !tags.includes(`${filter}: ${inputValues[filter]}`)
    ) {
      setTags([...tags, `${filter}: ${inputValues[filter]}`]);
      setInputValues((prevValues) => ({
        ...prevValues,
        [filter]: "",
      }));
    }
  };

  const filteredUsers = useMemo(() => {
    const availableUsers = usersRef.current;
    return [...availableUsers].filter((user) => {
      return (Object.keys(inputValues) as FilterKeys[]).every((key) => {
        const value = inputValues[key];
        if (!value) return true;
        return user[key].toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [tags, inputValues]);

  useEffect(() => {
    setUsers(filteredUsers);
  }, [filteredUsers, setUsers]);

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="w-full">
      <hr />
      <div className="flex justify-center space-x-4 mt-2">
        {/* // Aqui se agregan los elementos del filtro de usuario */}
        <ToggleGroup type="multiple" className="space-x-2">
          {filterOptions.map((filter) => (
            <ToggleGroupItem
              key={filter}
              value={filter}
              variant={"outline"}
              aria-label={`Toggle ${filter}`}
              onClick={() => handleToggleChange(filter)}
              className={cn(
                selectedFilters.includes(filter)
                  ? "bg-primary-foreground text-primary-background"
                  : "bg-primary-background"
              )}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Aqui se digita el nombre, telefono y correo electronico del usuario */}

      <div className="flex justify-center">
        <Badge variant="secondary" className="h-min m-2 text-nowrap">
          Activa el filtro dando clic
        </Badge>
      </div>
      <hr className="" />

      {/* // Aqui se digitan los elementos del filtro de usuario */}
      <div className="flex justify-center flex-auto flex-wrap gap-4">
        <AnimatePresence>
          {selectedFilters.map((filter) => (
            <motion.div
              key={filter}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex w-auto items-center mt-2"
            >
              <Input
                className="rounded-r-none"
                placeholder={`Filter by ${filter}`}
                value={inputValues[filter]}
                onChange={(e) => handleInputChange(e, filter)}
              />
              <Button
                className="rounded-l-none"
                variant={"secondary"}
                onClick={() => handleAddTag(filter)}
              >
                <ListFilterPlusIcon />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* // Aqui se muestran los tags */}
      <div className="flex flex-wrap space-x-2">
        <AnimatePresence>
          {tags.map((tag, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-1 mt-2"
            >
              <Badge variant="default" className="flex items-center space-x-1">
                <span>{tag}</span>
                <X
                  className="cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
