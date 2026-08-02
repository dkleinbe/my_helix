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
import { contactTypesToStrs, strsTocontactTypes } from '../../helpers/decode-contact-types'
import { useTranslation } from 'react-i18next';

const Biodatas = ({ form }: { form: UseFormReturnType<IContact> }) => {
    const { t } = useTranslation();
    const { update } = useContactContext();
    const [types, setTypes] = useState<IContactType[]>([]);
    const [typeValues, setTypeValues] = useState<string[]>();
    const routes = useApplicationRoutes();

    // const handleChipClick = (event: React.MouseEvent<HTMLInputElement>) => {
    //     if (event.currentTarget.value === typeValue?.toString()) {
    //     setTypeValue(null);
    //     }
    // };

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

    useEffect(() => {
        setTypeValues(contactTypesToStrs(form.values.type_bitfield))
    }, [form.values.type_bitfield])


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
        
        value={typeValues}
        onChange={(tv) => { 
            setTypeValues(tv)
            form.values.type_bitfield = strsTocontactTypes(tv)
            showNotification({
              title: `Clicked on ${tv}`,
              message: `You clicked on type ${tv}`,
              withBorder: true,
            })
          }
        }
      >
        <Group justify="center" mt="md" >
          
          {types.map(tt =>         
              <Chip 
                disabled={!update}
                value={tt.value.toString()}
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
                        label={t('firstName')}
                        placeholder={t('firstName')}
                        {...form.getInputProps('firstName')}
                        readOnly={!update}
                        withAsterisk={update}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label={t('lastName')}
                        placeholder={t('lastName')}
                        {...form.getInputProps('lastName')}
                        readOnly={!update}
                        withAsterisk={update}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label={t('birth-date')}
                        placeholder={t('birth-date')}
                        {...form.getInputProps('birthDate')}
                        readOnly={!update}
                        withAsterisk={update}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label={t('gender')}
                        placeholder={t('gender')}
                        {...form.getInputProps('sex')}
                        readOnly={!update}
                        withAsterisk={update}
                    />
                </Grid.Col>
                <Grid.Col span={12}>
                    <TextInput
                        label={t('address')}
                        placeholder={t('address')}
                        {...form.getInputProps('address')}
                        readOnly={!update}
                        withAsterisk={update}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label={t('ville')}
                        placeholder={t('ville')}
                        {...form.getInputProps('city')}
                        readOnly={!update}
                        withAsterisk={update}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label={t('phone')}
                        placeholder={t('phone')}
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
                        label={t('job')}
                        placeholder={t('job')}
                        {...form.getInputProps('job')}
                        readOnly={!update}
                    />
                </Grid.Col>                
                <Grid.Col span={6}>
                    <TextInput
                        label="Médecin traitant"
                        placeholder="Médecin traitant"
                        {...form.getInputProps('doctor')}
                        readOnly={!update}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label={t('email')}
                        placeholder={t('email')}
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
                {/*
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
                */}
            </Grid>
        </Paper>
    );
};

export { Biodatas };
