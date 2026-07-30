import useSecureAPI from '../hooks/use-secure-api';

interface ICreateContact {
    login: string;
    role: number;
    state: number;
    password: string;
}

interface IUpdateContact {
    id: number;
    login: string;
    role: number;
    state: number;
    password: string;
}

const useContactsRoute = () => {
    const api = useSecureAPI();
    const baseUrl = '/contacts';

    const create = async (data: ICreateContact) => {
        return await api.post(`${baseUrl}/add`, data);
    };

    const update = async (data: IUpdateContact) => {
        return await api.post(`${baseUrl}/update`, data);
    };

    const disable = async (id: string) => {
        return api.delete(`${baseUrl}/${id}`);
    };

    const enable = async (id: string) => {
        return api.put(`${baseUrl}/${id}/enable`);
    };

    const getAll = async (types: string) => {
        return await api.get(`${baseUrl}?types=${types}`);
    };

    const getAllRoles = async () => {
        return await api.get(`${baseUrl}/roles`);
    };

    const getAllTypes = async () => {
        return await api.get(`${baseUrl}/types`);
    };

    
    const getAllStates = async () => {
        return await api.get(`${baseUrl}/states`);
    };

    const getOne = async (id: string) => {
        return await api.get(`${baseUrl}/${id}`);
    };

    const getPractitioners = async () => {
        return await api.get(`${baseUrl}/practitioners`);
    };

    return {
        create,
        update,
        disable,
        enable,
        getAll,
        getAllRoles,
        getAllTypes,
        getAllStates,
        getOne,
        getPractitioners,
    };
};

export { useContactsRoute };
