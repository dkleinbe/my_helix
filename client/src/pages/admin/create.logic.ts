import { useForm, isNotEmpty } from '@mantine/form';
import useApplicationRoutes from '../../api/routes';
import setNotification from '../../components/errors/feedback-notification';
import { IUsers } from '../../types/interfaces';
import { Mode } from './create'
import { create, fromPairs } from 'lodash';

const useUserCreate = (mode: Mode, handleClose: () => void) => {
    const routes = useApplicationRoutes();

    const form = useForm({
        initialValues: {
            login: '',
            lastName: '',
            role: -1,
            password: '',
        },

        validate: {
            login: (value) => (value.length < 2 ? 'Name must be at least 2 chars' : null),
            lastName: (value) => (value.length < 2 ? 'Last name must be at least 2 chars' : null),
            role: isNotEmpty('Role is required'),
            password: isNotEmpty('Password is required'),
        },
    });

    const handleSave = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if ((await form.validate()).hasErrors) return;
        if (mode == Mode.Create) {
            try {
                //const res = await routes.users.create(form.values);
                //setNotification(false, res.data.message);
                console.log(form.values);
                form.reset();
                handleClose();
            } catch (error: any) {
                if (!error?.response) setNotification(true, 'Network error');
                else setNotification(true, `${error.message}: ${error.response.data.message}`);
            }
        }
        else {
            console.log(form.values);
        }
    };



    return { form, handleSave };
};

export { useUserCreate };
