import React from "react";

export const UserDataContext = React.createContext();

const UserContext = ({ children }) => {
  // const user = {}; // You can add user-related state and functions here
  return (
    <div>
      <UserDataContext.Provider>{children}</UserDataContext.Provider>
    </div>
  );
};

export default UserContext;
