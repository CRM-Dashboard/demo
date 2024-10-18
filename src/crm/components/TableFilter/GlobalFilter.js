import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import { memo, useState } from "react";

// Global filter component
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
    const handleClear = () => {
        setGlobalFilter("");
        setValue("")
    };
    const [value, setValue] = useState("")
    const handleOnChange = (e) => {
        const inputValue = e.target.value
        setValue(inputValue)
    }
    const handleSearch = () => {
        setGlobalFilter(value)

    }

    return (
        <TextField
            label="Global Search"
            value={value || ""}
            onChange={handleOnChange}
            sx={{ width: "45vw" }}
            margin="normal"
            variant="outlined"
            InputProps={{
                endAdornment: (
                    <>
                        <InputAdornment position="end">
                            <IconButton onClick={handleSearch}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                        {(
                            <InputAdornment position="end">
                                <IconButton onClick={handleClear}>
                                    <CancelIcon />
                                </IconButton>
                            </InputAdornment>
                        )}
                    </>
                ),
            }}
        />
    );
};

export default memo(GlobalFilter);
