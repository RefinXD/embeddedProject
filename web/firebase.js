import { setDetectPeopleSensor, doorAlert } from "./script.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
//import { } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-SERVICE.js
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD40lZHQyy7IO1-tAHTp7Xpc5dknj4RpC4",
  authDomain: "embed-lab-5ca54.firebaseapp.com",
  databaseURL:
    "https://embed-lab-5ca54-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "embed-lab-5ca54",
  storageBucket: "embed-lab-5ca54.appspot.com",
  messagingSenderId: "344748612162",
  appId: "1:344748612162:web:02f91ef14bed50696febdb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const db = getDatabase(app);

export function writeIsOpen(isOpen) {
  set(ref(db, "isOpen/"), {
    bool: isOpen,
  });
}

export function writeDoorAlert(isAlert) {
  set(ref(db, "sensor2/"), {
    int: isAlert,
  });
}

const valRef = ref(db, "sensor1/int");
onValue(valRef, (snapshot) => {
  setDetectPeopleSensor(snapshot.val());
});

const alertRef = ref(db, "sensor2/int");
onValue(alertRef, (snapshot) => {
  const data = snapshot.val();
  if (data == 1) {
    doorAlert();
  }
  // setDoorSensor(snapshot.val());
});

// writeUserData(1);
