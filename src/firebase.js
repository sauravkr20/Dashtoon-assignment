import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCQSwLMYVCeTf66ZdqZB3-UhFfhXU1NxDY",
	authDomain: "dashtoon-ebcbb.firebaseapp.com",
	projectId: "dashtoon-ebcbb",
	storageBucket: "dashtoon-ebcbb.appspot.com",
	messagingSenderId: "211444065317",
	appId: "1:211444065317:web:a212629edf7c4b99920bcc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth();
