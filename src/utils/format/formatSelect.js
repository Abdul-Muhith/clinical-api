const formatSelect = (select = ``) => {
  return select.split(`,`).join(` `);
};

export default formatSelect;
