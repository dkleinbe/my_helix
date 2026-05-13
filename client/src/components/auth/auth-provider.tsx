import { LogtoConfig, LogtoProvider, UserScope } from '@logto/react';
import { createContext } from 'react';

type AuthContextType = {
  auth: any;
  setAuth: any;
  persist: any;
  setPersist: any;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // TODO: Replace with env variables and proxy
  const authConfig: LogtoConfig = {
    endpoint: 'http://localhost:3010/',
    appId: 'hhm8fu4f01r4hlw9q7n1s',
    scopes: [UserScope.Email, UserScope.Identities, UserScope.Organizations, UserScope.Roles, 'api:read', 'api:write'],
    resources: ['http://localhost:3001/api'],
  };

  return <LogtoProvider config={authConfig}>{children}</LogtoProvider>;
};
export const AuthContext = createContext<AuthContextType | null>(null);
export default AuthProvider;
