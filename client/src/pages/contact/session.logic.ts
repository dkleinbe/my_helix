import { useEffect, useState } from 'react';
import useApplicationRoutes from '../../api/routes';
import { ISession } from '../../types/interfaces';
import { useForm } from '@mantine/form';




const useSession = (session: ISession) => {
    
    
    const routes = useApplicationRoutes();

    const form = useForm<ISession>({
        
            initialValues: {
                id: session ? session.id : 0,
                type: session ? session.type : '',
                mode: session ? session.mode : '',
                notes: session ? session.notes : '',
            },
    
            validate: {
            },
        });
    
    useEffect(() => {
        const fetchPatientSessions = async () => {
            
        };

        fetchPatientSessions();

    }, [session]);

    return { form };
};

export { useSession  };
