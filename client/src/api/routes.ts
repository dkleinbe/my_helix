import { useAccountingRoute } from './accounting';
//import { useAppointmentsRoute } from './appointments';
import { useEventsRoute } from './events';
//import { usePatientsRoute } from './patients';
import { useUnsecuredRoute } from './unsecured';
import { useUsersRoute } from './users';
import { useContactsRoute } from './contacts';
import { useSessionsRoute } from './sessions';


const useApplicationRoutes = () => {
    return {
        accounting: useAccountingRoute(),
        //appointments: useAppointmentsRoute(),
        sessions: useSessionsRoute(),
        events: useEventsRoute(),
        //patients: usePatientsRoute(),
        unsecured: useUnsecuredRoute(),
        users: useUsersRoute(),
        contacts: useContactsRoute(),
    };
};

export default useApplicationRoutes;
