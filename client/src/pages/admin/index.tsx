import { Card, Center, Title } from '@mantine/core';
import { ListUsers } from './users';
import { GettingStartedExample } from '../../components/table-view'
import { JSX } from 'react';

const AdminPanel = (): JSX.Element => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Center>
      <Title order={2}>Admin Panel</Title>
    </Center>
    <ListUsers />
    <GettingStartedExample />
  </Card>
);

export default AdminPanel;
