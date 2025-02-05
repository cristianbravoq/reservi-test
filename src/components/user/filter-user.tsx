import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

type FilterKeys = 'name' | 'phone' | 'email';

const filterOptions: FilterKeys[] = ['name', 'phone', 'email'];

export const UserFilter: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = React.useState<FilterKeys[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [inputValues, setInputValues] = React.useState<Record<FilterKeys, string>>({
    name: "",
    phone: "",
    email: "",
  });

  const handleToggleChange = (value: FilterKeys) => {
    setSelectedFilters((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((filter) => filter !== value)
        : [...prevSelected, value]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, filter: FilterKeys) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [filter]: e.target.value,
    }));
  };

  const handleAddTag = (filter: FilterKeys) => {
    if (inputValues[filter] && !tags.includes(`${filter}: ${inputValues[filter]}`)) {
      setTags([...tags, `${filter}: ${inputValues[filter]}`]);
      setInputValues((prevValues) => ({
        ...prevValues,
        [filter]: "",
      }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="w-full">
      <div className="flex justify-center space-x-4">
        <ToggleGroup type="multiple" className="space-x-2">
          <span>Filters</span>
          {filterOptions.map((filter) => (
            <ToggleGroupItem
              key={filter}
              value={filter}
              variant={"outline"}
              aria-label={`Toggle ${filter}`}
              onClick={() => handleToggleChange(filter)}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="flex justify-center flex-auto flex-wrap gap-4">
        {selectedFilters.map((filter) => (
          <div key={filter} className="flex w-auto items-center space-x-1 mt-2">
            <Input
              placeholder={`Filter by ${filter}`}
              value={inputValues[filter]}
              onChange={(e) => handleInputChange(e, filter)}
            />
            <Button onClick={() => handleAddTag(filter)}>Add filter</Button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap space-x-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="default" className="flex items-center space-x-1 mt-2">
            <span>{tag}</span>
            <X className="cursor-pointer" onClick={() => handleRemoveTag(tag)} />
          </Badge>
        ))}
      </div>
    </div>
  );
};