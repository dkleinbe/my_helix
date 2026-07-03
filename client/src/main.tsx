import { createRoot } from 'react-dom/client';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import Helix from './helix';
import './config/i18n';

console.log('VITE running in ' + import.meta.env.MODE + ' PROD Value: ' + import.meta.env.PROD)
// disable console.log in production
if (import.meta.env.MODE == 'production') {
    disableReactDevTools();
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<Helix />);
