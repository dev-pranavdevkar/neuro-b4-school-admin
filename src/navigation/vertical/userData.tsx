import React, { useState, useEffect } from 'react';

export default function UserData() {
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // Retrieve user data from local storage
        const userData = localStorage.getItem('userData');
        console.log("Add Team Members", userData);
        if (userData) {
            const { role } = JSON.parse(userData);
            setUserRole(role);
        }
    }, []);

    // Export userRole state
    return userRole;
}
