import { useForm, isNotEmpty } from '@mantine/form';
import useApplicationRoutes from '../../api/routes';
import setNotification from '../../components/errors/feedback-notification';
import { IUsers } from '../../types/interfaces';
import { Mode } from './modalUserDetails'
import { create, fromPairs } from 'lodash';

const useModalUserDetails = (mode: Mode, handleClose: () => void) => {
    const routes = useApplicationRoutes();

    const form = useForm({
        
        initialValues: {
            id: -1,
            login: '',
            role: -1,
            state: -1,
            password: '',
        },

        validate: {
            login: (value) => (value.length < 2 ? 'Name must be at least 2 chars' : null),
            role: isNotEmpty('Role is required'),
            state: isNotEmpty('State is required'),
            password: (value) => (mode === Mode.Create && value === "") ? 'Password is required' : null,
        },
    });

    const handleSave = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if ((await form.validate()).hasErrors) return;
        if (mode == Mode.Create) {
            try {
                const res = await routes.users.create({ 
                                                        login: form.values.login, 
                                                        password: form.values.password,
                                                        role: form.values.role,
                                                        state: form.values.state,
                                                    });
                setNotification(false, res.data.message);
                console.log(form.values);
                form.reset();
                handleClose();
            } catch (error: any) {
                if (!error?.response) setNotification(true, 'Network error');
                else setNotification(true, `${error.message}: ${error.response.data.message}`);
            }
        }
        else {
            try {
                const res = await routes.users.update({ id: form.values.id,
                                                        login: form.values.login, 
                                                        password: form.values.password,
                                                        role: form.values.role,
                                                        state: form.values.state,
                                                    });
                setNotification(false, res.data.message);
                console.log(form.values);
                form.reset();
                handleClose();
            } catch (error: any) {
                if (!error?.response) setNotification(true, 'Network error');
                else setNotification(true, `${error.message}: ${error.response.data.message}`);
            }
        }
    };



    return { form, handleSave };
};

export { useModalUserDetails };
