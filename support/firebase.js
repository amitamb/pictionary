import firebase from 'firebase';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPLPT03S7fRFHhG4-7MFW6MY_d0VgB1e8",
  authDomain: "pictionary-316407.firebaseapp.com",
  databaseURL: "https://pictionary-316407-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pictionary-316407",
  storageBucket: "pictionary-316407.appspot.com",
  messagingSenderId: "1056765382063",
  appId: "1:1056765382063:web:5c70cb55751c9d85d5f35a",
  measurementId: "G-CT2D5W9N78"
};

if (!firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();
}

const db=firebase.database();

export default db;