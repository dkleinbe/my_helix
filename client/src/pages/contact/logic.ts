import { useEffect, useState } from 'react';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import useApplicationRoutes from '../../api/routes';
import { ITransaction } from './types';
import { ISession, IContact } from '../../types/interfaces';

const useContact = (id: string) => {
    const routes = useApplicationRoutes();
    const [sessions, setSessions] = useState<ISession[]>([]);
    const [transactions, setTransactions] = useState<ITransaction[]>([]);

    const form = useForm<IContact>({
        initialValues: {
            id: id,
            type_bitfield: 0,
            //type: '',
            firstName: '',
            lastName: '',
            birthDate: '',
            sex: '',
            email: '',
            city: '',
            address: '',
            phone: '',
            doctor: '',
            job: '',
        },

        validate: {
            firstName: (value) => (value.length < 2 ? 'Name must be at least 2 chars' : null),
            lastName: (value) => (value.length < 2 ? 'Last name must be at least 2 chars' : null),
            birthDate: (value) => (value.length !== 10 ? 'Birth date must be at `DD/MM/YYYY` format' : null),
            sex: (value) => (value !== 'F' && value !== 'M' ? 'Sex must be at `M` or `F`' : null),
            email: isEmail('Email must be valid'),
            city: (value) => (value.length < 2 ? 'City must be at least 2 chars' : null),
            address: isNotEmpty('Address is required'),
            phone: (value) => (value.length < 10 ? 'Phone must be at least 10 chars' : null),
            job: isNotEmpty('Job is required'),
            type_bitfield: (value) => (value < 1 ? 'Type can not be null' : null),
        },
    });

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const response = await routes.contacts.getOne(id);
                form.setValues({
                    id: id,
                    type_bitfield: response.data[0].type_bitfield,
                    firstName: response.data[0].firstName,
                    lastName: response.data[0].lastName,
                    birthDate: response.data[0].birthDate,
                    sex: response.data[0].sex,
                    email: response.data[0].email,
                    city: response.data[0].city,
                    //medicalIssues: JSON.parse(response.data[0].passif).medicalIssues,
                    address: response.data[0].address,
                    phone: response.data[0].phone,
                    doctor: response.data[0].doctor,
                    job: response.data[0].job,
                    //lastAppointments: JSON.parse(response.data[0].passif).lastAppointments,
                });
            } catch (error) {
                console.log(error);
            }
        };

        const fetchPatientSessions = async () => {
            try {
                const response = await routes.sessions.getByContact(id);
                console.log(response)
                setSessions(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchContact();
        fetchPatientSessions();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return { form, sessions, transactions };
};


export { useContact  };
