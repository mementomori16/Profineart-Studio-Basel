// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDFqIOcx2-fyaJzasJA-zQEwWWLjghuhKA",
  authDomain: "profineart-studio-basel.firebaseapp.com",
  projectId: "profineart-studio-basel",
  storageBucket: "profineart-studio-basel.firebasestorage.app",
  messagingSenderId: "957060931445",
  appId: "1:957060931445:web:0c0615498f24542fee3d3c",
  measurementId: "G-4EYJ5FNE94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { analytics };
