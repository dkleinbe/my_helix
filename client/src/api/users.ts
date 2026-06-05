import useSecureAPI from '../hooks/use-secure-api';

interface ICreateUser {
    login: string;
    role: number;
    state: number;
    password: string;
}

interface IUpdateUser {
    id: number;
    login: string;
    role: number;
    state: number;
    password: string;
}

const useUsersRoute = () => {
    const api = useSecureAPI();
    const baseUrl = '/users';

    const create = async (data: ICreateUser) => {
        return await api.post(`${baseUrl}/add`, data);
    };

    const update = async (data: IUpdateUser) => {
        return await api.post(`${baseUrl}/update`, data);
    };

    const disable = async (id: string) => {
        return api.delete(`${baseUrl}/${id}`);
    };

    const enable = async (id: string) => {
        return api.put(`${baseUrl}/${id}/enable`);
    };

    const getAll = async () => {
        return await api.get(baseUrl);
    };

    const getAllRoles = async () => {
        return await api.get(`${baseUrl}/roles`);
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
        getAllStates,
        getOne,
        getPractitioners,
    };
};

export { useUsersRoute };
