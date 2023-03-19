// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTHDOMAIN,
	projectId: process.env.REACT_APP_PROJECTID,
	storageBucket: process.env.REACT_APP_STORAGEBUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGGINGSENDERID,
	appId: process.env.REACT_APP_APPID,
	measurementId: process.env.REACT_APP_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const authService = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const dbService = getFirestore(app);
