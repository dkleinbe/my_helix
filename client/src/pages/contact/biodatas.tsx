import { JSX, useEffect, useState } from 'react';
import { Chip, Flex, Grid, Group, TextInput, Button, Textarea, Paper, Title, Divider } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconPhone, IconSend } from '@tabler/icons-react';
import GrantAccess from '../../components/auth/grant-access';
import { UseFormReturnType } from '@mantine/form';
import { IContact } from '../../types/interfaces';
import { useContactContext } from './context';
import useApplicationRoutes from '../../api/routes';
import { IContactType } from '../../types/interfaces';
import setNotification from '../../components/errors/feedback-notification';


const Biodatas = ({ form }: { form: UseFormReturnType<IContact> }) => {
    const { update } = useContactContext();
    const [types, setTypes] = useState<IContactType[]>([]);
    const routes = useApplicationRoutes();

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
        <Paper shadow="md" p="md" radius="md" withBorder>
            <Title order={3}>Biodatas</Title>
            <Divider my="sm" />
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'lg' }}
        justify={{ sm: 'left' }}
      >
      <Chip.Group 
        multiple={true}
        //value={typeValue}
        onChange={(tv) => { 
            //setTypeValue(tv)
            //fetchAllContacts(tv)
            // let types: number = 0
            // value.forEach((v) => {
            //   types += parseInt(v)
            // })
            // fetchAllContacts(types.toString())
            showNotification({
              title: `Clicked on ${tv}`,
              message: `You clicked on type ${tv}`,
              withBorder: true,
            })
          }
        }
      >
        <Group justify="center" mt="md">
          
          {types.map(tt =>         
              <Chip 
                value={tt.value.toString()}
                //onClick={handleChipClick}
              >
                {tt.label}
              </Chip>)
          } 
        </Group>       
      </Chip.Group>
      </Flex>                  
            <Grid columns={12}>
                <Grid.Col span={6}>
                    <TextInput
                        label="Name"
                        placeholder="Name"
                        {...form.getInputProps('firstName')}
                        readOnly={!update}
                        withAsterisk={update}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label="Last Name"
                        placeholder="Last Name"
                        {...form.getInputProps('lastName')}
                        readOnly={!update}
                        withAsterisk={update}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label="Birth Date"
                        placeholder="Birth Date"
                        {...form.getInputProps('birthDate')}
                        readOnly={!update}
                        withAsterisk={update}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label="Sex"
                        placeholder="Sex"
                        {...form.getInputProps('sex')}
                        readOnly={!update}
                        withAsterisk={update}
                    />
                </Grid.Col>
                <Grid.Col span={12}>
                    <TextInput
                        label="Address"
                        placeholder="Address"
                        {...form.getInputProps('address')}
                        readOnly={!update}
                        withAsterisk={update}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label="City"
                        placeholder="City"
                        {...form.getInputProps('city')}
                        readOnly={!update}
                        withAsterisk={update}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label="Phone"
                        placeholder="Phone"
                        {...form.getInputProps('phone')}
                        readOnly={!update}
                        withAsterisk={update}
                        rightSection={
                            <Button
                                component="a"
                                href={`tel:${form.values.phone}`}
                                color="fr-yellow.3"
                                m="xs"
                                p="xs"
                                variant="subtle"
                            >
                                <IconPhone size="1rem" />
                            </Button>
                        }
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label="Médecin traitant"
                        placeholder="Médecin traitant"
                        defaultValue={form.values.doctor}
                        readOnly={!update}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label="Email"
                        placeholder="Email"
                        {...form.getInputProps('email')}
                        readOnly={!update}
                        withAsterisk={update}
                        rightSection={
                            <Button
                                component="a"
                                href={`mailto:${form.values.email}`}
                                color="fr-yellow.3"
                                m="xs"
                                p="xs"
                                variant="subtle"
                            >
                                <IconSend size="1rem" />
                            </Button>
                        }
                    />
                </Grid.Col>
                <GrantAccess levels={['ADMIN', 'PRACTITIONER']}>
                    <Grid.Col span={12}>
                        <Textarea
                            label="Antécédents médicaux"
                            maxRows={4}
                            placeholder="Antécédents"
                            {...form.getInputProps('medicalIssues')}
                            readOnly={!update}
                        />
                    </Grid.Col>
                </GrantAccess>
            </Grid>
        </Paper>
    );
};

export { Biodatas };
