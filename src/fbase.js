// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

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
