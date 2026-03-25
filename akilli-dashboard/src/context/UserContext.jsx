import React, { createContext, useState } from 'react';

// Create User Context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initial demo state
  const [user, setUser] = useState({
    name: 'Mahmut Paşa',
    role: 'Admin', // Admin or User
    profilePicture: 'https://ui-avatars.com/api/?name=Mahmut+Pasa&background=random&color=fff' 
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
