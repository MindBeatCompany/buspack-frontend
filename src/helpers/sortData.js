import { useState, useMemo } from "react";

const SortData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (
          typeof a[sortConfig.key] === "string" &&
          typeof b[sortConfig.key] === "string"
        ) {
          if (
            a[sortConfig.key].toLowerCase() < b[sortConfig.key].toLowerCase()
          ) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (
            a[sortConfig.key].toLowerCase() > b[sortConfig.key].toLowerCase()
          ) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
        if (
          typeof a[sortConfig.key] === "object" &&
          typeof b[sortConfig.key] === "object"
        ) {
          if (
            a[sortConfig.key].name.toLowerCase() <
            b[sortConfig.key].name.toLowerCase()
          ) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (
            a[sortConfig.key].name.toLowerCase() >
            b[sortConfig.key].name.toLowerCase()
          ) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort };
};
export default SortData;
