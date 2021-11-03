// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDoc,
  setDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
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

export const getInitStatus = () => !!app;

// Authenticate
const provider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    // const result =
    await signInWithPopup(getAuth(), provider);
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    // const user = result.user;
  } catch (error) {
    if (error.code === "auth/popup-blocked") {
      try {
        await signInWithRedirect(getAuth(), provider);
      } catch (error) {
        console.log(error);
      }
      return;
    }
    console.log(error);
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // const email = error.email;
    // const credential = GoogleAuthProvider.credentialFromError(error);
  }
};

export const signOutWithGoogle = () => {
  signOut(getAuth());
};

export const isSignedIn = () => !!getAuth().currentUser;

export const initFirebaseAuth = (observer) => {
  onAuthStateChanged(getAuth(), observer);
};

export const getData = (() => {
  let defaultData;
  const defaults = async () => {
    if (!!defaultData) return defaultData;
    try {
      const defaultRef = doc(db, "app", "defaults");
      const defaultSnap = await getDoc(defaultRef);
      defaultData = defaultSnap.data();
      return defaultData;
    } catch (error) {
      console.error(error);
    }
  };
  const userData = async (UID) => {
    const docRef = doc(db, "users", UID);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // new user
        // write defaults to user document
        // (would be a Cloud Function if not a free user)
        const usersRef = collection(db, "users");
        await setDoc(doc(usersRef, UID), defaultData);
        return defaultData;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return {
    defaults,
    userData,
  };
})();

export const updateData = (() => {
  const _updateParam = async (uid, object) => {
    const userRef = doc(db, "users", uid);
    try {
      await updateDoc(userRef, object);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const userSettings = async (uid, settings) => {
    return await _updateParam(uid, { settings });
  };
  const userButtons = async (uid, buttons) => {
    return await _updateParam(uid, { buttons });
  };
  return {
    userSettings,
    userButtons,
  };
})();
