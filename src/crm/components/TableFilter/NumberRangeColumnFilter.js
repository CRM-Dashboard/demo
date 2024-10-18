import { TextField, MenuItem, Select } from "@mui/material";
import { useState } from "react";
// Custom Number Filter
const NumberRangeColumnFilter = ({
    column: { filterValue = [], preFilteredRows, setFilter },
}) => {
    const [operator, setOperator] = useState("equals");
    const [value, setValue] = useState("");

    const handleFilter = (event) => {
        setValue(event.target.value);
        setFilter([operator, event.target.value]);
    };

    return (
        <div>
            <Select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                variant="outlined"
                margin="dense"
                style={{ marginBottom: "8px" }}
            >
                <MenuItem value="equals">Equals</MenuItem>
                <MenuItem value="greaterThan">Greater Than</MenuItem>
                <MenuItem value="lessThan">Less Than</MenuItem>
            </Select>
            <TextField
                value={value}
                onChange={handleFilter}
                placeholder="Enter value"
                variant="outlined"
                size="small"
                margin="dense"
                fullWidth
            />
        </div>
    );
};

export default NumberRangeColumnFilter;
