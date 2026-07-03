import { Card, Center, Title } from '@mantine/core';
import { ListUsers } from './users';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';



const AdminPanel = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Center>
        <Title order={2}>{t('admin_panel')}</Title>
      </Center>
      <ListUsers />
    </Card>
  );
}

export default AdminPanel;
