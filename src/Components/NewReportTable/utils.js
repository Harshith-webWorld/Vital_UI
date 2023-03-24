export const totalCountGenerator = (data, fieldName) => {
  const total = data.reduce((acc, cur) => {
    let value = parseFloat(cur[`${fieldName}`]);
    if (!Number.isInteger(value / 1)) {
      return parseFloat(acc) + parseFloat(cur[`${fieldName}`]);
    }
    return acc + parseInt(cur[`${fieldName}`]);
  }, 0);

  if (!Number.isInteger(parseFloat(data[0][`${fieldName}`]) / 1)) {
    return total.toFixed(2);
  }

  return total;
};
