import useBookingsFilterStore from "@/store/filters-store";
import { FilterKeysType } from "./types";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

export const TagsFilters: React.FC = () => {
  const { tags, removeTag } = useBookingsFilterStore();

  const handleRemoveTag = (filterKey: FilterKeysType, filterValue: string) => {
    removeTag(filterKey, filterValue);
  };

  return (
    <div className="flex flex-wrap space-x-2">
      <AnimatePresence>
        {Object.entries(tags).map(([key, values]) =>
          values.length > 0 ? (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-1 mt-2"
            >
              {values.map((value, index) => (
                <Badge
                  key={index}
                  variant="accent"
                  className="flex flex-wrap md:text-nowrap items-center space-x-1"
                >
                  <span className="text-nowrap">
                    {key}: {value}
                  </span>
                  <X
                    className="cursor-pointer hover:text-destructive"
                    onClick={() => handleRemoveTag(key as FilterKeysType, value)}
                  />
                </Badge>
              ))}
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
};
