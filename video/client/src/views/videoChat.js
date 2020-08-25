import React, { useContext } from "react";
import firebase from "../context/firebase";
import { AuthContext } from "../context/auth";

export default function VideoChat() {
  const { isProfessor } = useContext(AuthContext);
  return (
    <div>
      <h1>{firebase.auth().currentUser.email}</h1>
      <p>{isProfessor ? "True" : "False"}</p>
      <h1>Video Chat</h1>
    </div>
  );
}
