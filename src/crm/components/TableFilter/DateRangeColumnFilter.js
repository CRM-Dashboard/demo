import { TextField, InputLabel } from "@mui/material";
import { memo } from "react";
// Custom Date Range Filter

const DateRangeColumnFilter = ({ column: { filterValue = [], setFilter } }) => {
    const handleStartDateChange = (event) => {
        const start = event.target.value || undefined;
        setFilter((old = []) => [start, old[1]]);
    };

    const handleEndDateChange = (event) => {
        const end = event.target.value || undefined;
        setFilter((old = []) => [old[0], end]);
    };

    return (
        <div>
            <TextField
                type="date"
                value={filterValue[0] || ""}
                onChange={handleStartDateChange}
                label="Start Date"
                placeholder="Start"
                variant="outlined"
                margin="dense"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}

            // slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
                type="date"
                value={filterValue[1] || ""}
                onChange={handleEndDateChange}
                label="End Date"
                variant="outlined"
                margin="dense"
                size="small"
                fullWidth

                InputLabelProps={{ shrink: true }}
            />
        </div>
    );
};

export default memo(DateRangeColumnFilter);
