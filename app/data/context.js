import React, { useState, createContext } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  return (
    <Context value={{ isLoading, setIsLoading, isLogin, setIsLogin }}>
      {children}
    </Context>
  );
};
