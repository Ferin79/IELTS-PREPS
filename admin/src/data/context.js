import React, { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [institution, setInstitution] = useState(null);
  const [role, setRole] = useState(null);

  return (
    <Context.Provider
      value={{
        token,
        setToken,
        isLogin,
        setIsLogin,
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
