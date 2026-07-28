import { Button, Grid, Group, Modal, PasswordInput, Select, Text, TextInput } from '@mantine/core';
import { useModalUserDetails } from './modalUserDetails.logic';
import ModalOverlay from '../../components/modal-overlay';
import { JSX, useEffect, useState } from 'react';
import { IUser, IRole, IState } from '../../types/interfaces';
import useApplicationRoutes from '../../api/routes';
import setNotification from '../../components/errors/feedback-notification';
import { CreateRows } from '../../components/list-view/rows';
import { useTranslation } from 'react-i18next';

enum Mode {Create, Edit};
interface IProps {
  mode: Mode;
  show: boolean;
  toggleModal: () => void;
  user: IUser | undefined
}

const ModalUserDetails = ({ mode, show, toggleModal, user }: IProps): JSX.Element => {
  const { t } = useTranslation();
  const { form, handleSave } = useModalUserDetails(mode, toggleModal);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [states, setStates] = useState<IState[]>([]);
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
                id: user.id,
                login: user.login,
                role: user.role_id,
                state: user.state_id,
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
              {t('edit-user')}
            </Text>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <form>
            <Grid columns={12}>
              { (mode === Mode.Edit) &&
                <Grid.Col span={12}>
                  
                  <TextInput
                    disabled
                    label={t('id')}
                    placeholder={t('id')}
                    withAsterisk
                    {...form.getInputProps('id')}
                
                  />
                </Grid.Col>              
              }
              <Grid.Col span={12}>
                <TextInput
                  label={t('login')}
                  placeholder={t('login')}
                  withAsterisk
                  {...form.getInputProps('login')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select<number>
                  label={t('role')}
                  placeholder={t('role')}
                  data={roles}
                  withAsterisk
                  {...form.getInputProps('role')}
                />
              </Grid.Col> 
              <Grid.Col span={6}>
                <Select<number>
                  label={t('state')}
                  placeholder={t('state')}
                  data={states}
                  withAsterisk
                  {...form.getInputProps('state')}
                />
              </Grid.Col>      
              <Grid.Col span={12}>
                <PasswordInput
                  label={t('password')}
                  placeholder={t('password')}
                  withAsterisk={(mode === Mode.Create) ? true : false}
                  {...form.getInputProps('password')}
                />
              </Grid.Col>                                   
            </Grid>
            <Group align="right" p="md">
              <Button variant="light" color="red" onClick={toggleModal}>
                {t('cancel')}
              </Button>
              <Button
                color="green"
                onClick={handleSave}
                // type="submit"
              >
                {t('save')}
              </Button>
            </Group>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export { ModalUserDetails, Mode };
