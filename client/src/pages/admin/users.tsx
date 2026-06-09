import { ModalUserDetails, Mode } from './modalUserDetails';
import { Badge, Button, Divider, Group, Title } from '@mantine/core';
import { useUsers } from './users.logic';
import HelixTableSort from '../../components/list-view';
import GettingStartedExample from '../../components/table-view'
import UsersTable from './usersTable'
import ModalCreateApp from '../appointments/create';

export function ListUsers() {
  const { users, fetching, toggleModal, reload, disableUser, enableUser, show } = useUsers();
  return (
    <>
      <Group align="apart">
        <Title order={2}>
          Users{' '}
          <Badge size="lg" radius="lg" variant="filled">
            {users.length}
          </Badge>
        </Title>
        <Button onClick={toggleModal}>New User</Button>
      </Group>
      <Divider my="lg" />
      <UsersTable data={users} fetching={fetching} onAction={reload} />
      <ModalUserDetails mode={Mode.Create} show={show} toggleModal={toggleModal} user={undefined} />
    </>
  );
};

