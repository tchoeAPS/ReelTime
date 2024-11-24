export function sortResults(sql, sortOn, sortOrder) {
  const validSortOrder = ['ASC', 'DESC'];
  if (sortOn && validSortOrder.includes(sortOrder?.toUpperCase())) {
    return `${sql} ORDER BY ${sortOn} ${sortOrder}`;
  }
  return sql;
}
