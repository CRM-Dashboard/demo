// MultiSelectFilter.js
import React, { memo } from "react";
import { Checkbox, ListItemText, MenuItem, Select } from "@mui/material";

const MultiSelectFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id },
    label = "Select values",
}) => {
    // Extract unique values for the column
    const options = React.useMemo(() => {
        const uniqueValues = new Set();
        preFilteredRows.forEach((row) => {
            uniqueValues.add(row.values[id]);
        });
        return [...uniqueValues];
    }, [id, preFilteredRows]);

    // Handle changes for multiple selections
    const handleChange = (event) => {
        setFilter(event.target.value || undefined); // Update filter values with selected items
    };

    return (
        <Select
            multiple
            value={filterValue || []}
            onChange={handleChange}
            renderValue={(selected) => selected.join(", ")} // Display selected options
        >
            {options.map((option, index) => (
                <MenuItem key={index} value={option}>
                    <Checkbox
                        checked={filterValue ? filterValue.includes(option) : false}
                    />
                    <ListItemText primary={option} />
                </MenuItem>
            ))}
        </Select>
    );
};

export default memo(MultiSelectFilter);
