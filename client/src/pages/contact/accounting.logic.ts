import { useState } from 'react';

const useContactAccounting = () => {
    const [selected, setSelected] = useState<string>('0');
    const [showFacture, setShowFacture] = useState<boolean>(false);

    const handleShowFacture = (id: string) => {
        setSelected(id);
        setShowFacture(true);
    };

    const handleHideFacture = () => {
        setShowFacture(false);
    };

    return { selected, showFacture, handleShowFacture, handleHideFacture };
};

export { useContactAccounting };
