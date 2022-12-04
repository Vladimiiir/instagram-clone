import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCPC4uKhgfL4CwiRt3XokDLCbJD3WfNqFE",
  authDomain: "instagram-clone-71c47.firebaseapp.com",
  projectId: "instagram-clone-71c47",
  storageBucket: "instagram-clone-71c47.appspot.com",
  messagingSenderId: "372686265302",
  appId: "1:372686265302:web:ba02394c59ba79c2ade277",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = getStorage(firebaseApp);

export { db, auth, storage };
