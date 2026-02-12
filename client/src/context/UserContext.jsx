import React, { use } from "react";

export const UserDataContext = React.createContext();

const UserContext = ({ children }) => {
  // start with `null` until the user is loaded/authenticated
  const [user, setUser] = React.useState(null);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
