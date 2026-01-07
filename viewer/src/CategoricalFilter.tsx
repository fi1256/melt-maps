import React, { useState } from "react";
import { Autocomplete, TextField, Chip, Box } from "@mui/material";

export const CategoricalFilter = ({
  options,
  selectedOptions,
  setSelectedOptions,
}: {
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: (selected: string[]) => void;
}) => {
  const handleChange = (event: any, newValue: string[]) => {
    setSelectedOptions(newValue);
  };

  return (
    <div>
      <Autocomplete
        size="small"
        multiple
        id="autocomplete-multiple"
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            placeholder={selectedOptions.length ? "" : "(all)"}
            style={{ maxWidth: 300 }}
            {...params}
          />
        )}
        renderValue={(value: string[]) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {value.map((option: string, index: number) => (
              <Chip key={index} size="small" label={option} />
            ))}
          </Box>
        )}
      />
    </div>
  );
};
