import { useEffect, useState } from 'react';
import useApplicationRoutes from '../../api/routes';
import { ISession } from '../../types/interfaces';




const useSessions = (id: number) => {
    
    const [sessions, setSessions] = useState<ISession[]>([]);
    const routes = useApplicationRoutes();

    useEffect(() => {
        const fetchPatientSessions = async () => {
            try {
                const response = await routes.sessions.getByContact(id.toString());
                
                //console.log(response)
                setSessions(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPatientSessions();

    }, [id, routes.sessions]);

    return { sessions };
};

export { useSessions  };
