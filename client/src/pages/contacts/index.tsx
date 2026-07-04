import { JSX, useEffect, useState } from 'react';
import { Badge, Button, Grid, Group, Paper, Title, useMantineColorScheme } from '@mantine/core';
//import { ModalAddPatient } from './create';
// import { ContactsStyles } from './contacts.styles';
import { useContacts } from './contacts.logic';
import ContactsTable from './contactsTable';
import { useNavigate } from 'react-router-dom';

const Contacts = (): JSX.Element => {
  const [mainColor, setMainColor] = useState('fr-yellow.4');
  const { colorScheme } = useMantineColorScheme();
  // const { classes } = ContactsStyles();
  const { contacts, fetching, reload, toggleModal } = useContacts();
  const navigate = useNavigate();
  const handleRowClick = (id: string) => {
    navigate(`/contacts/${id}`);
  };

  useEffect(() => {
    setMainColor(colorScheme === 'dark' ? 'fr-yellow.6' : 'fr-yellow.4');
  }, [colorScheme]);

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
      <Paper shadow="sm" radius="md" p="lg" withBorder my="lg">
        <ContactsTable data={contacts} fetching={fetching} onAction={reload} />
      </Paper>
      
    </>
  );
};
//<ModalAddPatient show={show} toggleModal={toggleModal} />
export default Contacts;
