'use client';
import sortBy from 'lodash/sortBy';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { IconSearch, IconX, IconEye, IconEdit, IconTrash, IconUserCircle  } from '@tabler/icons-react';
import { Box, Group, TextInput, ActionIcon, MultiSelect, Modal, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { DataTable, DataTableSortStatus  } from 'mantine-datatable';
import { ID, KindAppointment, Role, ContactStatus } from '../../components/custom-badges';
import setNotification from '../../components/errors/feedback-notification';
import useApplicationRoutes from '../../api/routes';
import { IContact } from '../../types/interfaces';
//import { ModalContactDetails, Mode } from './modalContactDetails';
import { useTranslation } from 'react-i18next';

interface IProps {
  data: IContact[];
  fetching: boolean;
  onAction: () => void;
}

export function ContactsTable({ data ,  fetching, onAction } : IProps)
{
  const { t } = useTranslation();
  const [sortedData, setSortedData] = useState(data);
  const [query, setQuery] = useState('');
  const routes = useApplicationRoutes();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IContact>>({
    columnAccessor: 'lastName',
    direction: 'asc',
  });
  const [debouncedQuery] = useDebouncedValue(query, 200);
  /*
  const roles = useMemo(() => {
    const roles = new Set(data.map((e) => e.role));
    return [...roles];
  }, [data]);
  const states = useMemo(() => {
    const states = new Set(data.map((e) => e.state));
    return [...states];
  }, [data]);
  */
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const [contact, setContact] = useState<IContact|undefined>();

  const toggleModal = () => {
    if (show)
    {
      onAction();
    }
    setShow(!show);
      
  };

  const initialRecords = data;
  /*
  useEffect(() => {
    setSortedData(
      initialRecords.filter(({ login, role, state }: { login: string, role: string, state: string }) => {
        if (
          debouncedQuery !== '' &&
          !`${login}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase()) 
        )
          return false;

        if (selectedRoles.length && !selectedRoles.some((d) => d === role)) 
          return false;

        if (selectedStates.length && !selectedStates.some((d) => d === state)) 
          return false;

        return true;
      })
    );
    
  }, [debouncedQuery, selectedRoles, selectedStates]);
  */
  
  useEffect(() => {
    const data_ = sortBy(data, sortStatus.columnAccessor) as IContact[];
    setSortedData(sortStatus.direction === 'desc' ? data_.reverse() : data_);
  }, [sortStatus, data]);

  // <ModalContactDetails mode={Mode.Edit} show={show} toggleModal={toggleModal} contact={contact} />
  return (
    <>
    
    <DataTable
      backgroundColor={{ dark: '#232b25ff', light: '#f0f7f1ff' }}
      withTableBorder
      borderRadius="sm"
      withColumnBorders
      striped
      highlightOnHover
      pinLastColumn 
      // 👇 provide data
      records={sortedData}
      loaderSize='xl'
      fetching={fetching}
      // 👇 define columns
      columns={[
        {
          accessor: 'id',
          width: 130,
          // 👇 this column has a custom title
          title: t('id'),
          // 👇 right-align column
          textAlign: 'left',
          render: (contact) => (<ID id={contact.id.toString()} />),
        },
        { 
          accessor: 'firstName',
          title: t('name'), 
          render: ({firstName}) => `${firstName}`,
          filter: (
            <TextInput
              label={t('login')}
              description={t('show-contacts-whose-login-include-the-specified-text')}
              placeholder={t('search-contacts')}
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
          sortable: true 
        },
        /*
        { 
          accessor: 'role', 
          title: t('role'),
          render: (contact) => (<Role role={contact.role} />),
          filter: (
            <MultiSelect
              label={t('role')}
              description={t('show-all-contacts-with-role')}
              data={roles}
              value={selectedRoles}
              placeholder={t('search-contacts')}
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
        { 
          accessor: 'state', 
          title: t('state'),
          render: (contact) => (<ContactStatus status={contact.state} />),
          filter: (
            <MultiSelect
              label={t('state')}
              description={t('show-all-contacts-with-state')}
              data={states}
              value={selectedStates}
              placeholder={t('search-contacts')}
              onChange={setSelectedStates}
              leftSection={<IconSearch size={16} />}
              comboboxProps={{ withinPortal: false }}
              clearable
              searchable
            />
          ),
          filtering: selectedRoles.length > 0,          
          sortable: true 
        },
        { 
          accessor: 'lastActive', 
          title: t('last-active'),
          sortable: true 
        },
        */
        {
          accessor: 'actions',
          width: '0%',
          title: <Box mr={6}>{t('actions')}</Box>,
          textAlign: 'right',
          render: (contact) => (
            <Group gap={4} justify="right" wrap="nowrap">
               <ActionIcon
                size="sm"
                variant="subtle"
                color="red"
                onClick={() => {
                    setContact(contact);
                    toggleModal();
                  }
                }
              >
                <IconEdit size={16} />
              </ActionIcon>              
              <ActionIcon
                size="sm"
                variant="subtle"
                color="blue"
                onClick={() =>
                  showNotification({
                    title: `Clicked on ${contact.lastName}`,
                    message: `You clicked on ${contact.id}, a contact`,
                    withBorder: true,
                  })
                }
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ),
        },
      ]}
      // 👇 execute this callback when a row is clicked
      // onRowClick={({ record: { login } }) =>
      //   showNotification({
      //     title: `Clicked on ${login}`,
      //     message: `You clicked on ${login}, a contact`,
      //     withBorder: true,
      //   })
      // }
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
    />
    </>
  );
};

export default ContactsTable;