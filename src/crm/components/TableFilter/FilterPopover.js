import React, { useState, memo } from "react";
import { Popover, IconButton, Box, Typography, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const FilterPopover = ({ columns, resetFilters }) => {

    // console.log("*******columns****", columns)
    const [anchorEl, setAnchorEl] = useState(null);

    const handleRest = () => {
        resetFilters();
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "filter-popover" : undefined;

    return (
        <>
            {/* Filter Icon as Trigger */}
            <IconButton aria-describedby={id} onClick={handleClick}>
                <FilterListIcon />
            </IconButton>

            {/* Popover that contains all filters */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                {/* Filter Content */}
                <Box p={2} minWidth="300px">
                    <Typography variant="h6" gutterBottom>
                        Filters
                    </Typography>

                    {/* Render filters for each column */}
                    {columns.map((column) => (
                        <Box key={column.id} mb={2}>
                            <Typography variant="body1" gutterBottom>
                                {column.render("Header")}
                            </Typography>
                            {column.canFilter ? column.render("Filter") : null}
                        </Box>
                    ))}

                    {/* Reset Filters Button */}
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button variant="contained" color="primary" onClick={handleRest}>
                            Reset Filters
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

export default memo(FilterPopover);
