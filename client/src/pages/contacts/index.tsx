import { JSX, useEffect, useState } from 'react';
import { Badge, Button, Chip, Flex, Grid, Group, Paper, Title, useMantineColorScheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import useApplicationRoutes from '../../api/routes';
import { useContacts } from './contacts.logic';
import ContactsTable from './contactsTable';
import { useNavigate } from 'react-router-dom';
import setNotification from '../../components/errors/feedback-notification';
import { IContactType } from '../../types/interfaces';
import { forEach } from 'lodash';

const Contacts = (): JSX.Element => {
  const [mainColor, setMainColor] = useState('fr-yellow.4');
  const { colorScheme } = useMantineColorScheme();
  // const { classes } = ContactsStyles();
  const { contacts, fetching, reload, toggleModal, fetchAllContacts } = useContacts();
  const navigate = useNavigate();
  const routes = useApplicationRoutes();

  const [types, setTypes] = useState<IContactType[]>([]);
  const [typeValue, setTypeValue] = useState<string | null>('-1');
  const handleChipClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === typeValue?.toString()) {
      setTypeValue(null);
    }
  };
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
      <Chip.Group 
        multiple={false}
        value={typeValue}
        onChange={(tv) => { 
            setTypeValue(tv)
            fetchAllContacts(tv)

            showNotification({
              title: `Clicked on ${tv}`,
              message: `You clicked on type ${tv}`,
              withBorder: true,
            })
          }
        }
      >
        <Group justify="center" mt="md">
          <Chip value="-1" onClick={handleChipClick}>All</Chip>
          {types.map(tt =>         
              <Chip 
                value={tt.value.toString()}
                onClick={handleChipClick}
              >
                {tt.label}
              </Chip>)
          } 
        </Group>       
      </Chip.Group>
      </Flex>      
      <Paper shadow="sm" radius="md" p="lg" withBorder my="lg">
        <ContactsTable data={contacts} fetching={fetching} onAction={reload} />
      </Paper>
      
    </>
  );
};
//<ModalAddPatient show={show} toggleModal={toggleModal} />
export default Contacts;
