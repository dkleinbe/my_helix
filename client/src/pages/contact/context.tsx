import { ReactNode, createContext, useContext, useState } from 'react';

const ContactContext = createContext({});

const ContactProvider = ({ children }: { children: ReactNode }) => {
    const [update, setUpdate] = useState(false);
    return <ContactContext.Provider value={{ update, setUpdate }}>{children}</ContactContext.Provider>;
};

const useContactContext = (): { update: boolean; setUpdate: (state: boolean) => void } => {
    return useContext<any>(ContactContext);
};

export { ContactProvider, useContactContext };
