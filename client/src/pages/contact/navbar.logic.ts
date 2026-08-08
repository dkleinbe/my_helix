import { useNavigate } from 'react-router-dom';
import setNotification from '../../components/errors/feedback-notification';
import useApplicationRoutes from '../../api/routes';
import { useState } from 'react';
import { UseFormReturnType } from '@mantine/form';
import { IContact } from '../../types/interfaces';

const useContactNavBar = (form: UseFormReturnType<IContact>) => {
    const navigate = useNavigate();
    const routes = useApplicationRoutes();
    const [update, setUpdate] = useState(false);
    const [showExport, setShowExport] = useState(false);

    const handleDelete = async (id: string) => {
        if (!id) return console.error('No id');
        try {
            /*
            const res = await routes.patients.delete(id);
            setNotification(false, res.data.message);
            navigate('/patients');
            */
        } catch (error: any) {
            if (!error?.response) setNotification(true, 'Network error');
            else setNotification(true, `${error.message}: ${error.response.data.message}`);
        }
    };

    const handleUpdate = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (update) {
            if (form.validate().hasErrors) return;

            const finalContact: IContact = {
                id: form.values.id,
                firstName: form.values.firstName,
                lastName: form.values.lastName,
                birthDate: form.values.birthDate,
                sex: form.values.sex,
                email: form.values.email,
                city: form.values.city,
                address: form.values.address,
                phone: form.values.phone,
                doctor: form.values.doctor,
                job: form.values.job,
                type_bitfield: form.values.type_bitfield
            };

            try {
                const res = await routes.contacts.update(finalContact);
                setNotification(false, res.data.message);
            } catch (err: any) {
                if (!err?.response) setNotification(true, 'Network error');
                else setNotification(true, `${err.message}: ${err.response.data.message}`);
            }
        }
        setUpdate(!update);
    };

    const handleExport = () => {
        setShowExport(!showExport);
    };

    return { handleDelete, handleUpdate, update, handleExport, showExport };
};

export { useContactNavBar };
