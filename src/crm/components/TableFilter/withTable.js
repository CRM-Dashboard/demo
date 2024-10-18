import React, { useState, useCallback, useMemo } from "react";
import {
    useTable,
    usePagination,
    useGlobalFilter,
    useFilters,
    useGroupBy,
    useExpanded,
} from "react-table";
import { TablePagination, Paper, Box } from "@mui/material";
import DefaultColumnFilter from "./DefaultColumnFilter";
import GlobalFilter from "./GlobalFilter";
import FilterPopover from "./FilterPopover";
import debounce from "lodash.debounce";  // You can use lodash for debouncing

// Higher-Order Component
const withTable = (WrappedComponent) => {
    return function EnhancedTable({
        columns,
        data,
        editable = false,
        pageSize = 10,
        select = false,
        pagination = false,
        showFilter = true,
        ...props
    }) {
        // const [editRowIndex, setEditRowIndex] = useState(null);

        const [selectedRows, setSelectedRows] = useState([]);

        // Memoizing the data and column configuration to avoid re-computation
        const memoizedData = useMemo(() => data, [data]);
        const memoizedColumns = useMemo(() => columns, [columns]);

        // React-table hooks
        const tableInstance = useTable(
            {
                columns: memoizedColumns,
                data: memoizedData,
                defaultColumn: { Filter: DefaultColumnFilter },
                initialState: { pageIndex: 0, pageSize: pagination ? pageSize : memoizedData?.length },
            },
            useFilters,
            useGlobalFilter,
            useGroupBy,
            useExpanded,
            usePagination
        );

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            prepareRow,
            page,
            state: { pageIndex, pageSize: currentPageSize, globalFilter },
            setGlobalFilter,
            setPageSize,
            setFilter,
            gotoPage,  // <-- this function updates the current page
            footerGroups,
            setAllFilters,
            rows
        } = tableInstance

        // console.log("****tableInstance***", tableInstance)

        // Handle row selection
        const handleRowSelect = useCallback((row) => {
            setSelectedRows((prev) => {
                if (prev.some((selectedRow) => selectedRow.id === row.id)) {
                    return prev.filter((selectedRow) => selectedRow.id !== row.id);
                }
                return [...prev, row];
            });
        }, []);

        // Select/deselect all rows
        const setAllSelected = useCallback((isSelected) => {
            if (isSelected) {
                setSelectedRows(memoizedData); // Select all rows
            } else {
                setSelectedRows([]); // Deselect all rows
            }
        }, [memoizedData]);

        // Apply multiple column filters
        const setColumnFilters = useCallback((filters) => {
            // console.log("filters****", filters)
            Object.entries(filters).forEach(([columnId, filterValue]) => {
                setFilter(columnId, filterValue);
            });
        }, [setFilter]);

        // Reset filters (memoized)
        const resetFilters = useCallback(() => {
            setGlobalFilter(""); // Reset global filter
            setAllFilters([]);   // Reset all column filters
        }, [setGlobalFilter, setAllFilters]);

        // Debounce the global filter to optimize performance
        const debouncedSetGlobalFilter = useMemo(
            () => debounce((value) => setGlobalFilter(value), 0),
            [setGlobalFilter]
        );

        // Memoize the pagination event handlers
        const handlePageChange = useCallback(
            (event, newPage) => {
                gotoPage(newPage);  // Update the table to the new page
            },
            [gotoPage]
        );

        const handleRowsPerPageChange = useCallback(
            (event) => {
                setPageSize(Number(event.target.value));  // Update the page size
            },
            [setPageSize]
        );

        return (
            <Paper>
                {showFilter && (<Box Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box>
                        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={debouncedSetGlobalFilter} />
                    </Box>

                    {/* Box to handle the positioning of FilterPopover */}
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        {/* Render FilterPopover with reset functionality */}
                        <FilterPopover columns={headerGroups[0].headers} resetFilters={resetFilters} />
                    </Box>
                </Box>)}

                {/* Wrapped table component */}
                <WrappedComponent
                    getTableProps={getTableProps}
                    getTableBodyProps={getTableBodyProps}
                    headerGroups={headerGroups}
                    page={page}
                    prepareRow={prepareRow}
                    footerGroups={footerGroups}
                    editable={editable}
                    select={select}
                    selectedRows={selectedRows}
                    handleRowSelect={handleRowSelect}
                    setAllSelected={setAllSelected}
                    setColumnFilters={setColumnFilters}
                    {...props}
                />

                {
                    pagination && (
                        <TablePagination
                            component="div"
                            count={rows?.length}
                            page={pageIndex}
                            onPageChange={handlePageChange}  // Memoized handler
                            rowsPerPage={currentPageSize}
                            onRowsPerPageChange={handleRowsPerPageChange}  // Memoized handler
                            rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        />
                    )
                }
            </Paper >
        );
    };
};

export default withTable;
