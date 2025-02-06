// src/components/ui/autocomplete.tsx
import { IUser } from "@/types";
import * as React from "react";
import { Input } from "./input";

interface AutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions: IUser[];
  sendValue: (value: string) => void;
}

export const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  ({ suggestions, sendValue, ...props }, ref) => {
    const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     console.log(e.currentTarget.value, "e.currentTarget.value");
      const userInput = e.currentTarget.value;
      setInputValue('userInput');
      setFilteredSuggestions(
        suggestions
          .map((suggestion) => suggestion.name) // Assuming 'name' is the property you want to filter by
          .filter((name) =>
            name.toLowerCase().includes(userInput.toLowerCase())
          )
      );
      setShowSuggestions(true);
      sendValue(userInput);
    };

    const handleClick = (suggestion: string) => {
      setInputValue(suggestion);
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      sendValue(suggestion);
    };

    return (
      <div className="autocomplete">
          
        <Input
          type="text"
          onChange={handleChange}
          value={inputValue}
          ref={ref}
          {...props}
        />
        {showSuggestions && inputValue && (
          <ul className="suggestions">
            {filteredSuggestions.length ? (
              filteredSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleClick(suggestion)}>
                  {suggestion}
                </li>
              ))
            ) : (
              <li>No suggestions available</li>
            )}
          </ul>
        )}
      </div>
    );
  }
);

Autocomplete.displayName = "Autocomplete";