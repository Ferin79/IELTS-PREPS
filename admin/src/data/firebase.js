import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeGlC39mCJhsStuaGT5rRYKNthOLU2Myg",
  authDomain: "ielts-preps.firebaseapp.com",
  databaseURL: "https://ielts-preps.firebaseio.com",
  projectId: "ielts-preps",
  storageBucket: "ielts-preps.appspot.com",
  messagingSenderId: "1048340373708",
  appId: "1:1048340373708:web:aeaeb3f53d5fcc67256269",
  measurementId: "G-KRE50H8H0Z",
};
firebase.initializeApp(firebaseConfig);
export default firebase;
