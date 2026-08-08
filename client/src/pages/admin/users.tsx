import { ModalUserDetails, Mode } from './modalUserDetails';
import { Badge, Button, Divider, Group, Title } from '@mantine/core';
import { useUsers } from './users.logic';
import HelixTableSort from '../../components/list-view';
import GettingStartedExample from '../../components/table-view'
import UsersTable from './usersTable'

import { useTranslation } from 'react-i18next';

export function ListUsers() {
  const { t } = useTranslation();
  const { users, fetching, toggleModal, reload, disableUser, enableUser, show } = useUsers();
  return (
    <>
      <Group align="apart">
        <Title order={2}>
          {t('user')}{' '}
          <Badge size="lg" radius="lg" variant="filled">
            {users.length}
          </Badge>
        </Title>
        <Button onClick={toggleModal}>{t('new_user')}</Button>
      </Group>
      <Divider my="lg" />
      <UsersTable data={users} fetching={fetching} onAction={reload} />
      <ModalUserDetails mode={Mode.Create} show={show} toggleModal={toggleModal} user={undefined} />
    </>
  );
};

