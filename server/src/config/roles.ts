const roles = {
    admin: 0,
    practitioner: 1,
    secretary: 2,
};

const getCode = (role: number) => {
    return role
    // switch (role) {
    //     case 'admin':
    //         return 2003;
    //     case 'practitioner':
    //         return 1998;
    //     case 'secretary':
    //         return 1515;
    // }
};

export default  {
    roles,
    getCode,
};
