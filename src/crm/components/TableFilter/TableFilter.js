import {
  Table as MuiTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableFooter,
  Checkbox,
} from "@mui/material";
import { memo, useCallback, useEffect } from "react";

const TableFilter = ({
  getTableProps,
  getTableBodyProps,
  headerGroups,
  page,
  prepareRow,
  footerGroups,
  select,
  selectedRows,
  handleRowSelect,
  setSelectedRows, // Function to set selected rows in parent component
  setAllSelected,
  setSelectedItems,
}) => {
  // Memoized "Select All" handler
  const handleSelectAll = useCallback(
    (event) => {
      if (event.target.checked) {
        const allRows = page.map((row) => row.original);
        setSelectedRows(allRows);
      } else {
        setSelectedRows([]);
      }
    },
    [page, setSelectedRows]
  );
  useEffect(() => {
    if (setSelectedItems) {
      setSelectedItems(selectedRows);
    }
  }, [selectedRows]);
  //   console.log(setSelectedItems, "setSelectedItems");
  return (
    <TableContainer sx={{ maxHeight: "70vh" }}>
      <MuiTable
        stickyHeader
        {...getTableProps()}
        style={{ tableLayout: "auto", width: "100%" }}
      >
        <TableHead>
          <TableRow>
            {select && (
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selectedRows.length === page.length}
                  color="primary"
                  sx={{
                    color: "#1976d2", // Custom checkbox color
                    padding: 0, // Same as theme override
                  }}
                />
              </TableCell>
            )}
            {headerGroups.map((headerGroup) =>
              headerGroup.headers.map((column) => (
                <TableCell
                  {...column.getHeaderProps()}
                  key={column.id}
                  sx={{
                    backgroundColor: "#62b4ff", // Background color
                    color: "white", // Font color
                    padding: "10px 15px", // Padding as defined in the theme
                  }}
                >
                  {column.render("Header")}
                </TableCell>
              ))
            )}
          </TableRow>
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            const isSelected = selectedRows.some(
              (selectedRow) => selectedRow.id === row.original.id
            );
            return (
              <TableRow {...row.getRowProps()} key={row.id}>
                {select && (
                  <TableCell
                    padding="checkbox"
                    sx={{
                      width: "48px",
                      padding: 0, // No padding
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleRowSelect(row.original)}
                      color="primary"
                      sx={{
                        color: "#1976d2", // Custom checkbox color
                      }}
                    />
                  </TableCell>
                )}
                {row.cells.map((cell) => (
                  <TableCell
                    {...cell.getCellProps()}
                    key={cell.column.id}
                    sx={{
                      // backgroundColor: "#f5f5f5", // Custom background color
                      // color: "#333333",           // Custom text color
                      padding: "10px 15px", // Custom padding for table cells
                    }}
                  >
                    {cell.render("Cell")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          {footerGroups.map((footerGroup) => (
            <TableRow
              {...footerGroup.getFooterGroupProps()}
              key={footerGroup.id}
            >
              {footerGroup.headers.map((column) => (
                <TableCell
                  {...column.getFooterProps()}
                  key={column.id}
                  sx={{
                    paddingTop: 0, // Padding as defined in the theme
                    paddingBottom: 0, // Padding as defined in the theme
                    lineHeight: "1.3em", // Line height override
                  }}
                >
                  {column.render("Footer")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableFooter>
      </MuiTable>
    </TableContainer>
  );
};

export default memo(TableFilter);
