// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, docs, getDocs } from "firebase/firestore";
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDDshwp4uVe8mvpSX8dhbKG0qgs95CodwE",
  authDomain: "showmesomething-a0ee0.firebaseapp.com",
  projectId: "showmesomething-a0ee0",
  storageBucket: "showmesomething-a0ee0.appspot.com",
  messagingSenderId: "201296462781",
  appId: "1:201296462781:web:118f67e3cdd9961e42c8d4",
  measurementId: "G-P6C3YY8M9V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Authenticate
const provider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithRedirect(getAuth(), provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
  }
};

export const getDefaultButtons = async () => {
  try {
    console.log("Running code");
    const defaultCol = collection(db, "default");
    const defaultSnap = await getDocs(defaultCol);
    const defaultList = defaultSnap.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return defaultList;
  } catch (error) {
    console.error(error);
  }
};
