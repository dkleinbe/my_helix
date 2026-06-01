import { ModalAddUser } from './create';
import { Badge, Button, Divider, Group, Title } from '@mantine/core';
import { useUsers } from './users.logic';
import HelixTableSort from '../../components/list-view';
import GettingStartedExample from '../../components/table-view'
import UsersTable from './usersTabe'

export function ListUsers() {
  const { users, fetching, toggleModal, disableUser, enableUser, show } = useUsers();
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
      <UsersTable data={users} fetching={fetching}/>
      <ModalAddUser show={show} toggleModal={toggleModal} />
    </>
  );
};

