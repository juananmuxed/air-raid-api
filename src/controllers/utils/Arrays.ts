/* eslint-disable @typescript-eslint/no-explicit-any */
export const getUnique = <T extends { id: number }>(array: T[]) => {
  return array.reduce((unique, year) => {
    if (!unique.some((obj) => obj.id === year.id)) unique.push(year);
    return unique;
  }, [] as T[]);
};

export const sortByKey = <T extends Record<string, any>>(array: T[], key: keyof T, sortAsc = true) => {
  return array.sort((first, second) => (sortAsc ? first[key] - second[key] : second[key] - first[key]));
};
