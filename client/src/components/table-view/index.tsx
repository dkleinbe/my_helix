'use client';
import { useEffect, useState } from 'react';

import { Box } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { DataTable } from 'mantine-datatable';
import setNotification from '../../components/errors/feedback-notification';
import useApplicationRoutes from '../../api/routes';

export function GettingStartedExample() {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const routes = useApplicationRoutes();

  useEffect(() => {
      setLoading(true);
      const fetchAllUsers = async () => {
          try {
              const res = await routes.users.getAll();
              setRecords(res.data);
          } catch (error: any) {
              if (!error?.response) setNotification(true, 'Network error');
              else if (error.response.status !== 404)
                  setNotification(true, `${error.message}: ${error.response.data.message}`);
          }
      };  
      fetchAllUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
    <DataTable
      withTableBorder
      borderRadius="sm"
      withColumnBorders
      striped
      highlightOnHover
      // 👇 provide data
      records={records}
      // 👇 define columns
      columns={[
        {
          accessor: 'id',
          // 👇 this column has a custom title
          title: '#',
          // 👇 right-align column
          textAlign: 'left',
        },
        { accessor: 'login' },
        { accessor: 'role' },
        { accessor: 'state' },
        { accessor: 'lastActive' },
      ]}
      // 👇 execute this callback when a row is clicked
      onRowClick={({ record: { login } }) =>
        showNotification({
          title: `Clicked on ${login}`,
          message: `You clicked on ${login}, a user`,
          withBorder: true,
        })
      }
    />
  );
}