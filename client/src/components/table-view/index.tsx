'use client';
import sortBy from 'lodash/sortBy';
import { useEffect, useState, useRef, useCallback } from 'react';

import { Box } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { DataTable, DataTableSortStatus  } from 'mantine-datatable';
import setNotification from '../../components/errors/feedback-notification';
import useApplicationRoutes from '../../api/routes';
import { IUsers } from '../../types/interfaces';

interface IProps {
  data: any;
  fetching: boolean;
}

export function GettingStartedExample({ data ,  fetching }
  : IProps)
{
  const [fetch, setFetch] = useState(fetching);
  const [sortedData, setSortedData] = useState(data);
  const [records, setRecords] = useState([]);
  const routes = useApplicationRoutes();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IUsers>>({
    columnAccessor: 'login',
    direction: 'asc',
  });
  
  useEffect(() => {
    const data_ = sortBy(data, sortStatus.columnAccessor) as IUsers[];
    setSortedData(sortStatus.direction === 'desc' ? data_.reverse() : data_);
  }, [sortStatus, data]);

  return (
    <DataTable
      withTableBorder
      borderRadius="sm"
      withColumnBorders
      striped
      highlightOnHover
      // 👇 provide data
      records={sortedData}
      loaderSize='xl'
      fetching={fetching}
      // 👇 define columns
      columns={[
        {
          accessor: 'id',
          // 👇 this column has a custom title
          title: '#',
          // 👇 right-align column
          textAlign: 'left',
        },
        { accessor: 'login', sortable: true },
        { accessor: 'role', sortable: true },
        { accessor: 'state', sortable: true },
        { accessor: 'lastActive', sortable: false },
      ]}
      // 👇 execute this callback when a row is clicked
      onRowClick={({ record: { login } }) =>
        showNotification({
          title: `Clicked on ${login}`,
          message: `You clicked on ${login}, a user`,
          withBorder: true,
        })
      }
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
    />
  );
};

export default GettingStartedExample;