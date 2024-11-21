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

const ZigzagTable = ({
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
  maxHeight,
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
    <TableContainer sx={{ maxHeight: maxHeight }}>
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
                    backgroundColor: "#62B4FF", // Background color
                    color: "white", // Font color
                    padding: "5px 15px", // Padding as defined in the theme
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {column.render("Header")}
                </TableCell>
              ))
            )}
          </TableRow>
        </TableHead>
        <TableBody style={{ border: "1px solid red" }} {...getTableBodyProps()}>
          {page.map((row, index) => {
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
                {row.cells.map((cell) => {
                  const highlightStyle = {
                    fontWeight: "bolder",
                    fontSize: "14px",
                    padding: "05px 15px",
                    backgroundColor: "#f0f0f0",
                    // backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f8f8",
                  };
                  const rowStyle =
                    cell.row.original.head === "Sub Total 1" ||
                    cell.row.original.head === "Sub Total 2" ||
                    cell.row.original.head === "Grand Total"
                      ? {
                          ...highlightStyle,
                        }
                      : {
                          padding: "05px 15px",
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#f8f8f8",
                        };

                  return (
                    <TableCell
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      sx={rowStyle}
                      style={{
                        padding: "5px 10px", // Custom padding for table cells
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
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

export default memo(ZigzagTable);
