import { Button, Grid, Group, Modal, PasswordInput, Select, Text, TextInput } from '@mantine/core';
import { useModalUserDetails } from './modalUserDetails.logic';
import ModalOverlay from '../../components/modal-overlay';
import { JSX, useEffect, useState } from 'react';
import { IUsers, IRoles, IStates } from '../../types/interfaces';
import useApplicationRoutes from '../../api/routes';
import setNotification from '../../components/errors/feedback-notification';
import { CreateRows } from '../../components/list-view/rows';

enum Mode {Create, Edit};
interface IProps {
  mode: Mode;
  show: boolean;
  toggleModal: () => void;
  user: IUsers | undefined
}

const ModalUserDetails = ({ mode, show, toggleModal, user }: IProps): JSX.Element => {
  const { form, handleSave } = useModalUserDetails(mode, toggleModal);
  const [roles, setRoles] = useState<IRoles[]>([]);
  const [states, setStates] = useState<IStates[]>([]);
  const routes = useApplicationRoutes();

  useEffect(() => {
    const fetchAllRoles = async () => {
        //setFetching(true);
        try {
            const res = await routes.users.getAllRoles();
            /*
            if (isMounted()) {
                setUsers(res.data);
                setFetching(false);
            }
            */
            setRoles(res.data);

        } catch (error: any) {
            if (!error?.response) setNotification(true, 'Network error');
            else if (error.response.status !== 404)
                setNotification(true, `${error.message}: ${error.response.data.message}`);
        }
    };
    const fetchAllStates = async () => {
        //setFetching(true);
        try {
            const res = await routes.users.getAllStates();
            /*
            if (isMounted()) {
                setUsers(res.data);
                setFetching(false);
            }
            */
            setStates(res.data);

        } catch (error: any) {
            if (!error?.response) setNotification(true, 'Network error');
            else if (error.response.status !== 404)
                setNotification(true, `${error.message}: ${error.response.data.message}`);
        }
    };    
    fetchAllRoles();
    fetchAllStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user !== undefined)
      form.setValues({
                login: user.login,
                lastName: user.role,
                role: user.role_id,
                password: '',
            });
    else
      form.reset();
  }, [show, user, roles]);

  return (
    <Modal.Root opened={show} onClose={toggleModal} padding={12}>
      <Modal.Overlay {...ModalOverlay} />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            <Text size="xl" fw={700}>
              Edit User
            </Text>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <form>
            <Grid columns={12}>
              <Grid.Col span={6}>
                <TextInput
                  label="Login"
                  placeholder="Login"
                  withAsterisk
                  {...form.getInputProps('login')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select<number>
                  label="Role"
                  placeholder="Role"
                  data={roles}
                  withAsterisk
                  {...form.getInputProps('role')}
                />
              </Grid.Col> 
              <Grid.Col span={12}>
                <PasswordInput
                  label="Password"
                  placeholder="Password"
                  withAsterisk
                  {...form.getInputProps('password')}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Select<number>
                  label="State"
                  placeholder="State"
                  data={states}
                  withAsterisk
                  {...form.getInputProps('state')}
                />
              </Grid.Col>                           
            </Grid>
            <Group align="right" p="md">
              <Button variant="light" color="red" onClick={toggleModal}>
                Cancel
              </Button>
              <Button
                color="green"
                onClick={handleSave}
                // type="submit"
              >
                Save
              </Button>
            </Group>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export { ModalUserDetails, Mode };
