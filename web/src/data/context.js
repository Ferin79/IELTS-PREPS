import React, { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [institution, setInstitution] = useState(null);
  const [role, setRole] = useState(null);

  return (
    <Context.Provider
      value={{
        isLoading,
        setIsLoading,
        institution,
        setInstitution,
        role,
        setRole,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
