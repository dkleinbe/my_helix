import { JSX, useEffect, useState } from 'react';
import { Badge, Button, Chip, Flex, Grid, Group, Paper, Title, useMantineColorScheme } from '@mantine/core';
import useApplicationRoutes from '../../api/routes';
import { useContacts } from './contacts.logic';
import ContactsTable from './contactsTable';
import { useNavigate } from 'react-router-dom';
import setNotification from '../../components/errors/feedback-notification';
import { IContactType } from '../../types/interfaces';

const Contacts = (): JSX.Element => {
  const [mainColor, setMainColor] = useState('fr-yellow.4');
  const { colorScheme } = useMantineColorScheme();
  // const { classes } = ContactsStyles();
  const { contacts, fetching, reload, toggleModal } = useContacts();
  const navigate = useNavigate();
  const routes = useApplicationRoutes();
  const handleRowClick = (id: string) => {
    navigate(`/contacts/${id}`);
  };
  const [types, setTypes] = useState<IContactType[]>([]);

  useEffect(() => {
    setMainColor(colorScheme === 'dark' ? 'fr-yellow.6' : 'fr-yellow.4');
  }, [colorScheme]);

  useEffect(() => {
    const fetchAllTypes = async () => {
        //setFetching(true);
        console.log('Fetching types')
        try {
            const res = await routes.contacts.getAllTypes();
            /*
            if (isMounted()) {
                setUsers(res.data);
                setFetching(false);
            }
            */
            setTypes(res.data);

        } catch (error: any) {
            if (!error?.response) setNotification(true, 'Network error');
            else if (error.response.status !== 404)
                setNotification(true, `${error.message}: ${error.response.data.message}`);
        }
    };  
    fetchAllTypes();
  }, []);
  
  return (
    <>
      <Grid justify="space-between" align="center" p="md">
        <Group align="left">
          <Title order={1}>
            Contacts{' '}
            <Badge size="xl" radius="lg" variant="filled" color={mainColor}>
              {contacts.length}
            </Badge>
          </Title>
        </Group>
        <Group align="right">
          <Button onClick={toggleModal} color={mainColor}>
            Ajouter un patient
          </Button>
        </Group>
      </Grid>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'lg' }}
        justify={{ sm: 'left' }}
      >
      {types.map(tt =>         
          <Chip checked={false} >
              {tt.label}
          </Chip>)}
      </Flex>      
      <Paper shadow="sm" radius="md" p="lg" withBorder my="lg">
        <ContactsTable data={contacts} fetching={fetching} onAction={reload} />
      </Paper>
      
    </>
  );
};
//<ModalAddPatient show={show} toggleModal={toggleModal} />
export default Contacts;
