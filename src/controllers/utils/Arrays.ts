export const getUnique = <T extends { id: number }>(array: T[]) => {
  return array.reduce((unique, year) => {
    if (!unique.some((obj) => obj.id === year.id)) unique.push(year);
    return unique;
  }, [] as T[]);
};
