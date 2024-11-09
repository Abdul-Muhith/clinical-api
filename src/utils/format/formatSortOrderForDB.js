const formatSortOrderForDB = (sortOrder = ``) => {
  return sortOrder.toLowerCase() === "descending" ? -1 : 1;
};

export default formatSortOrderForDB;
