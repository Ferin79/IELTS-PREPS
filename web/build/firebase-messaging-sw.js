importScripts("https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js"
);

var firebaseConfig = {
  apiKey: "AIzaSyAeGlC39mCJhsStuaGT5rRYKNthOLU2Myg",
  authDomain: "ielts-preps.firebaseapp.com",
  databaseURL: "https://ielts-preps.firebaseio.com",
  projectId: "ielts-preps",
  storageBucket: "ielts-preps.appspot.com",
  messagingSenderId: "1048340373708",
  appId: "1:1048340373708:web:aeaeb3f53d5fcc67256269",
  measurementId: "G-KRE50H8H0Z",
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "./logo512.png",
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log(event);
  return event;
});

const initMessaging = firebase.messaging();
