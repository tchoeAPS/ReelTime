export function sortResults(sortOn, sortOrder) {
  const validSortOrder = ['ASC', 'DESC'];
  if (!validSortOrder.includes(sortOrder.toUpperCase())) {
    throw new Error('Invalid sort order');
  }
  return ` ORDER BY ${sortOn} ${sortOrder}`;
}
