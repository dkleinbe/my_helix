import { IContact } from '../../types/interfaces';
import { useState, useEffect, useRef, useCallback } from 'react';
import setNotification from '../../components/errors/feedback-notification';
import useApplicationRoutes from '../../api/routes';

const useContacts = () => {
    const routes = useApplicationRoutes();
    const [show, setShow] = useState(false);
    const toggleModal = () => {
        if (show)
            setRefresh(!refresh);
        setShow(!show);
    };

    const reload = () => {
        setRefresh(!refresh);
    };

    const [contacts, setContacts] = useState<IContact[]>([]);
    const [refresh, setRefresh] = useState(false);
    const [fetching, setFetching] = useState(false);

    function useIsMounted() {
        const isMounted = useRef(false);

        useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
        }, []);

        return useCallback(() => isMounted.current, []);
    }
    const isMounted = useIsMounted();
    useEffect(() => {
        const fetchAllContacts = async () => {
            setFetching(true);
            try {
                const res = await routes.contacts.getAll();
                if (isMounted()) {
                    setContacts(res.data);
                    setFetching(false);
                }
            } catch (error: any) {
                if (!error?.response) setNotification(true, 'Network error');
                else if (error.response.status !== 404)
                    setNotification(true, `${error.message}: ${error.response.data.message}`);
            }
        };
        fetchAllContacts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    const disableContact = async (uid: string) => {
        try {
            const res = await routes.contacts.disable(uid);
            setNotification(false, res.data.message);
            setRefresh(!refresh);
        } catch (error: any) {
            if (!error?.response) setNotification(true, 'Network error');
            else setNotification(true, `${error.message}: ${error.response.data.message}`);
        }
    };

    const enableContact = async (uid: string) => {
        try {
            const res = await routes.contacts.enable(uid);
            setNotification(false, res.data.message);
            setRefresh(!refresh);
        } catch (error: any) {
            if (!error?.response) setNotification(true, 'Network error');
            else setNotification(true, `${error.message}: ${error.response.data.message}`);
        }
    };

    return { contacts, fetching, show, toggleModal, reload, disableContact, enableContact };
};

export { useContacts };
