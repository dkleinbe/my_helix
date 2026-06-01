'use client';
import sortBy from 'lodash/sortBy';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';
import { TextInput, ActionIcon, MultiSelect } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDebouncedValue } from '@mantine/hooks';
import { DataTable, DataTableSortStatus  } from 'mantine-datatable';
import setNotification from '../../components/errors/feedback-notification';
import useApplicationRoutes from '../../api/routes';
import { IUsers } from '../../types/interfaces';

interface IProps {
  data: IUsers[];
  fetching: boolean;
}

export function UsersTable({ data ,  fetching }
  : IProps)
{
  const [sortedData, setSortedData] = useState(data);
  const [query, setQuery] = useState('');
  const routes = useApplicationRoutes();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IUsers>>({
    columnAccessor: 'login',
    direction: 'asc',
  });
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const roles = useMemo(() => {
    const roles = new Set(data.map((e) => e.role));
    return [...roles];
  }, [data]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);


  const initialRecords = data;

  useEffect(() => {
    setSortedData(
      initialRecords.filter(({ login, role }: { login: string, role: string }) => {
        if (
          debouncedQuery !== '' &&
          !`${login}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase()) 
        )
          return false;

        if (selectedRoles.length && !selectedRoles.some((d) => d === role)) 
          return false;
        
        return true;
      })
      
    );
  }, [debouncedQuery, selectedRoles]);
  
  
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
        { 
          accessor: 'login', 
          render: ({login}) => `${login}`,
          filter: (
            <TextInput
              label="Employees"
              description="Show employees whose names include the specified text"
              placeholder="Search employees..."
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setQuery('')}>
                  <IconX size={14} />
                </ActionIcon>
              }
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
          ),
          filtering: query !== '',
          sortable: true },
        { 
          accessor: 'role', 
          filter: (
            <MultiSelect
              label="Roles"
              description="Show all users with role"
              data={roles}
              value={selectedRoles}
              placeholder="Search roles..."
              onChange={setSelectedRoles}
              leftSection={<IconSearch size={16} />}
              comboboxProps={{ withinPortal: false }}
              clearable
              searchable
            />
          ),
          filtering: selectedRoles.length > 0,
          sortable: true 
        },
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

export default UsersTable;