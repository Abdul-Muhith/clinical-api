const formatSortOrder = (sortOrder = ``) => {
  return sortOrder.toLowerCase() === "descending" ? `-` : ``;
};

export default formatSortOrder;
