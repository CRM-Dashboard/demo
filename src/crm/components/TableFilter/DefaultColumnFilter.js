import { TextField } from "@mui/material";
import { memo } from "react";


const DefaultColumnFilter = ({
    column
}) => {
    const { filterValue, preFilteredRows, setFilter } = column
    console.log("****filterValue*****", column.id)
    return (
        <TextField
            value={filterValue || ""}
            onChange={(e) => setFilter(e.target.value || undefined)}
            placeholder={`Search ${preFilteredRows.length} records...`}
            variant="outlined"
            size="small"
            margin="dense"
        />
    );
};

export default memo(DefaultColumnFilter);
