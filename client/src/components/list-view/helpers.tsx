import { keys } from '@mantine/core';
import { RowData } from './types.ts';

const filterData = (data: RowData[], search: string) => {
  const query = search.toLowerCase().trim();
  // TODO: Fix that !
  return data;
  //return data.filter((item) => keys(data[0]).some((key) => item[key].toLowerCase().includes(query)));
};

const sortData = (data: RowData[], payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }) => {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].toString().localeCompare(a[sortBy]);
      }

      return a[sortBy].toString().localeCompare(b[sortBy]);
    }),
    payload.search
  );
};

export { filterData, sortData };
