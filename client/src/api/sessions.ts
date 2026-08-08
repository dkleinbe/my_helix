import useSecureAPI from '../hooks/use-secure-api';

interface IContent {
    content: string;
    payment: string;
}

interface ICreate {
    patientId: string;
    kind: string;
    event: string;
}

const useSessionsRoute = () => {
    const api = useSecureAPI();
    const baseUrl = '/sessions';

    const getByContact = async (id: string) => {
        return await api.get(`${baseUrl}/contact/${id}`);
    };



    return {

        getByContact,

    };
};

export { useSessionsRoute };
