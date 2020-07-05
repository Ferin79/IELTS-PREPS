import React, { useState, createContext } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [institute_id, setInstitute_id] = useState(null);
  const [userData, setUserData] = useState({});

  return (
    <Context.Provider
      value={{
        institute_id,
        setInstitute_id,
        userData,
        setUserData,
      }}
    >
      {children}
    </Context.Provider>
  );
};
