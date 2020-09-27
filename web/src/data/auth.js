import React, { useEffect, createContext, useState, useContext } from "react";
import firebase from "./firebase";
import { Context } from "./context";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const { setInstitution, setRole, setIsLoading } = useContext(Context);

  useEffect(() => {
    setIsLoading(true);
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    if (userData && userData.role && userData.institute_id) {
      setInstitution(userData.institute_id);
      setRole(userData.role);
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setCurrentUser(user);
          setIsLoading(false);
        } else {
          setCurrentUser(null);
          setIsLoading(false);
        }
      });
    } else {
      firebase.auth().signOut();
      setIsLoading(false);
    }
  }, [setInstitution, setRole, setIsLoading]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
