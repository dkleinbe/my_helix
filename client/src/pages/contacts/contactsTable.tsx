'use client';
import sortBy from 'lodash/sortBy';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconX, IconEye, IconEdit, IconTrash, IconUserCircle  } from '@tabler/icons-react';
import { Box, Group, TextInput, ActionIcon, MultiSelect, Modal, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { DataTable, DataTableSortStatus  } from 'mantine-datatable';
import { ID, ContactType } from '../../components/custom-badges';
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
  const [queryEmail, setQueryEmail] = useState('');   
  const [queryPhone, setQueryPhone] = useState('');     
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IContact>>({
    columnAccessor: 'lastName',
    direction: 'asc',
  });

  const [debouncedQueryLastname] = useDebouncedValue(queryLastname, 200);
  const [debouncedQueryFirsname] = useDebouncedValue(queryFirstname, 200);
  const [debouncedQueryEmail] = useDebouncedValue(queryEmail, 200);
  const [debouncedQueryPhone] = useDebouncedValue(queryPhone, 200);

  const [show, setShow] = useState(false);
  const [contact, setContact] = useState<IContact|undefined>();

  const navigate = useNavigate();

  const toggleModal = () => {
    if (show)
    {
      onAction();
    }
    setShow(!show);
      
  };

  const handleRowClick = (id: string) => {
    navigate(`/contacts/${id}`);
  };

  const initialRecords = data;
  
  useEffect(() => {
    setSortedData(
      initialRecords.filter(({ lastName, firstName, email, phone }
        : { lastName: string, firstName: string, email: string, phone: string }) => {

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

        if (
          debouncedQueryPhone !== '' &&
          !`${phone}`.toLowerCase().includes(debouncedQueryPhone.trim().toLowerCase()) 
        )        
          return false;          

        return true;
      })
    );
    
  }, [
      debouncedQueryLastname, 
      debouncedQueryFirsname, 
      debouncedQueryEmail, 
      debouncedQueryPhone
    ]);
  
  
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
          accessor: 'type', 
          title: t('user_type'),
          render: (contact) => (<ContactType type_id={contact.type_bitfield} />),
          sortable: true 
        },          
        { 
          accessor: 'lastName',
          title: t('lastName'), 
          render: ({lastName}) => `${lastName}`,
          filter: (
            <TextInput
              label={t('lastName')}
              description={t('filter-last-names')}
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
              description={t('filter-first-names')}
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
              description={t('filter-last-names')}
              placeholder={t('search-contacts')}
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setQueryEmail('')}>
                  <IconX size={14} />
                </ActionIcon>
              }
              value={queryEmail}
              onChange={(e) => setQueryEmail(e.currentTarget.value)}
            />
          ),
          filtering: queryEmail !== '',
          sortable: true 
        },        
        { 
          accessor: 'phone',
          title: t('phone'), 
          render: ({phone}) => `${phone}`,
          filter: (
            <TextInput
              label={t('phone')}
              description={t('filter-phone')}
              placeholder={t('search-phone')}
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => setQueryPhone('')}>
                  <IconX size={14} />
                </ActionIcon>
              }
              value={queryPhone}
              onChange={(e) => setQueryPhone(e.currentTarget.value)}
            />
          ),
          filtering: queryPhone !== '',
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
                    handleRowClick(contact.id)
                    //setContact(contact);
                    //toggleModal();
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