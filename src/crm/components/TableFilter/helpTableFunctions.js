// Custom filters
export const dateRangeFilter = (rows, id, filterValue) => {
    const [start, end] = filterValue;
    if (!start && !end) return rows;
    return rows.filter((row) => {
        const rowDate = new Date(row.values[id]);
        const startDate = start ? new Date(start) : null;
        const endDate = end ? new Date(end) : null;
        if (startDate && endDate) return rowDate >= startDate && rowDate <= endDate;
        if (startDate) return rowDate >= startDate;
        if (endDate) return rowDate <= endDate;
        return true;
    });
};

export const numberRangeFilter = (rows, id, filterValue) => {
    const [operator, value] = filterValue;
    if (!value) return rows;
    switch (operator) {
        case "greaterThan":
            return rows.filter((row) => row.values[id] > value);
        case "lessThan":
            return rows.filter((row) => row.values[id] < value);
        case "equals":
        default:
            return rows.filter((row) => row.values[id] == value);
    }
};

export const multiSelectFilter = (rows, id, filterValue) => {
    if (!filterValue || filterValue.length === 0) {
        return rows;
    }
    return rows.filter((row) => filterValue.includes(row.values[id]));
};