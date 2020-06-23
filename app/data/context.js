import React, { useState, createContext } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [institute_id, setInstitute_id] = useState(null);

  return (
    <Context.Provider
      value={{
        institute_id,
        setInstitute_id,
      }}
    >
      {children}
    </Context.Provider>
  );
};
