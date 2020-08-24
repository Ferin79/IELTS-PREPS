import React, { useEffect, createContext, useState, useContext } from "react";
import firebase from "../context/firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);  
  const [isProfessor, setIsProfessor] = useState(false);  

  useEffect(() => {    
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    if (userData && userData.role && userData.institute_id) {      
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setCurrentUser(user);                    
        } else {
          setCurrentUser(null);          
        }
      });
    } else {
      firebase.auth().signOut();      
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isProfessor }}>
      {children}
    </AuthContext.Provider>
  );
};
