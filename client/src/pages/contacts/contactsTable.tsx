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
  const [queryLastname, setQueryLastname] = useState('');
  const [queryFirstname, setQueryFirstname] = useState('');
  const [queryEmail, setqueryEmail] = useState('');    
  const routes = useApplicationRoutes();
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IContact>>({
    columnAccessor: 'lastName',
    direction: 'asc',
  });
  const [debouncedQueryLastname] = useDebouncedValue(queryLastname, 200);
  const [debouncedQueryFirsname] = useDebouncedValue(queryFirstname, 200);
  const [debouncedQueryEmail] = useDebouncedValue(queryEmail, 200);
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
  
  useEffect(() => {
    setSortedData(
      initialRecords.filter(({ lastName, firstName, email }
        : { lastName: string, firstName: string, email: string }) => {
        if (
          debouncedQueryLastname !== '' &&
          !`${lastName}`.toLowerCase().includes(debouncedQueryLastname.trim().toLowerCase()) 
        )
          return false;

        if (
          debouncedQueryFirsname !== '' &&
          !`${firstName}`.toLowerCase().includes(debouncedQueryFirsname.trim().toLowerCase()) 
        )
          return false;

        if (
          debouncedQueryEmail !== '' &&
          !`${email}`.toLowerCase().includes(debouncedQueryEmail.trim().toLowerCase()) 
        )        
          return false;  

        return true;
      })
    );
    
  }, [debouncedQueryLastname, debouncedQueryFirsname, debouncedQueryEmail]);
  
  
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
          accessor: 'lastName',
          title: t('lastName'), 
          render: ({lastName}) => `${lastName}`,
          filter: (
            <TextInput
              label={t('lastName')}
              description={t('show-contacts-whose-lastname-include-the-specified-text')}
              placeholder={t('search-contacts')}
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setQueryLastname('')}>
                  <IconX size={14} />
                </ActionIcon>
              }
              value={queryLastname}
              onChange={(e) => setQueryLastname(e.currentTarget.value)}
            />
          ),
          filtering: queryLastname !== '',
          sortable: true 
        },        
        { 
          accessor: 'firstName',
          title: t('firstName'), 
          render: ({firstName}) => `${firstName}`,
          filter: (
            <TextInput
              label={t('firstName')}
              description={t('show-contacts-whose-firstname-include-the-specified-text')}
              placeholder={t('search-contacts')}
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setQueryFirstname('')}>
                  <IconX size={14} />
                </ActionIcon>
              }
              value={queryFirstname}
              onChange={(e) => setQueryFirstname(e.currentTarget.value)}
            />
          ),
          filtering: queryFirstname !== '',
          sortable: true 
        },
        { 
          accessor: 'email',
          title: t('email'), 
          render: ({email}) => `${email}`,
          filter: (
            <TextInput
              label={t('email')}
              description={t('show-contacts-whose-email-include-the-specified-text')}
              placeholder={t('search-contacts')}
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setqueryEmail('')}>
                  <IconX size={14} />
                </ActionIcon>
              }
              value={queryEmail}
              onChange={(e) => setqueryEmail(e.currentTarget.value)}
            />
          ),
          filtering: queryEmail !== '',
          sortable: true 
        },        

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